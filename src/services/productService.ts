import api from "./api"
import type { Product, CreateProductPayload, UpdateProductPayload } from "../types/product"
import { validateProductPayload, clampRequestSize, sanitize } from "../utils/validation"
import { rateLimited } from "./rateLimitService"
import { logger } from "./logger"
import { getIdempotencyKey, getIdempotentResponse, setIdempotentResponse } from "../utils/idempotency"

const STORAGE_KEY = "cognicart_products"

function getSellerId(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).id as string) || "mock_seller"
  } catch {}
  return "mock_seller"
}

function getMockProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveMockProducts(products: Product[]) {
  // Simulate DB indexes: sellerId, isActive, category
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function isMockMode(error: unknown) {
  return !error || (error as { response?: unknown })?.response === undefined
}

export const productService = {
  async list(params?: { search?: string; category?: string; isActive?: boolean }): Promise<Product[]> {
    rateLimited(`products:list:${getSellerId()}`, 60, 60 * 1000)
    try {
      const { data } = await api.get<Product[]>("/products", { params })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let products = getMockProducts().filter((p) => p.sellerId === getSellerId())
      if (params?.search) {
        const q = sanitize(params.search, 100).toLowerCase()
        products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      }
      if (params?.category) products = products.filter((p) => p.category === params.category)
      if (params?.isActive !== undefined) products = products.filter((p) => p.isActive === params.isActive)
      logger.debug("productService:list tenant isolated", { sellerId: getSellerId(), count: products.length })
      return products
    }
  },

  async getById(id: string): Promise<Product> {
    rateLimited(`products:get:${getSellerId()}`, 60, 60 * 1000)
    if (!id || id.length > 100) throw new Error("Invalid product id")
    try {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let found = getMockProducts().find((p) => p.id === id && p.sellerId === getSellerId())
      if (!found) found = getMockProducts().find((p) => p.id === id)
      if (!found) {
        logger.warn("productService:getById not found or tenant isolation", { id, sellerId: getSellerId() })
        throw new Error("Product not found")
      }
      if (found.sellerId !== getSellerId() && getSellerId() !== "mock_seller") {
        logger.debug("productService:getById public read cross-seller", { id, productSeller: found.sellerId })
      }
      return found
    }
  },

  async listPublic(params?: { search?: string; category?: string }): Promise<Product[]> {
    rateLimited(`products:listPublic:global`, 60, 60 * 1000)
    try {
      const { data } = await api.get<Product[]>("/products", { params: { ...params, public: true } })
      return data.filter((p) => p.isActive)
    } catch {
      let products = getMockProducts().filter((p) => p.isActive)
      if (params?.search) {
        const q = sanitize(params.search, 100).toLowerCase()
        products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      }
      if (params?.category) products = products.filter((p) => p.category === params.category)
      // Public storefront: allow discovery across sellers, but log
      logger.debug("productService:listPublic", { count: products.length })
      return products
    }
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    rateLimited(`products:create:${getSellerId()}`, 20, 60 * 1000)
    const validated = validateProductPayload(payload as { name: string; description: string; price: number; stock: number; images: string[] })
    clampRequestSize(JSON.stringify(payload), 800) // images base64 limit
    // Image size check: each base64 approx 1.37x file size
    for (const img of validated.images) {
      if (img.length > 500 * 1024) throw new Error("Image too large (500KB limit per image)")
    }
    const idemKey = getIdempotencyKey({ name: validated.name, price: validated.price })
    const cached = getIdempotentResponse<Product>(idemKey)
    if (cached) {
      logger.info("productService:create idempotency hit", { idemKey })
      return cached
    }
    try {
      const { data } = await api.post<Product>("/products", payload, { headers: { "X-Idempotency-Key": idemKey } })
      logger.info("productService:create", { productId: data.id, sellerId: getSellerId() })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const now = new Date().toISOString()
      const product: Product = {
        id: "prod_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId: getSellerId(),
        name: validated.name,
        description: validated.description,
        price: validated.price,
        currency: payload.currency || "NGN",
        stock: validated.stock,
        category: sanitize(payload.category, 40),
        images: validated.images,
        isActive: payload.isActive,
        createdAt: now,
        updatedAt: now,
      }
      const all = getMockProducts()
      all.push(product)
      saveMockProducts(all)
      setIdempotentResponse(idemKey, product)
      logger.info("productService:create mock", { productId: product.id, sellerId: product.sellerId })
      return product
    }
  },

  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    rateLimited(`products:update:${getSellerId()}`, 30, 60 * 1000)
    if (payload.name) sanitize(payload.name, 80)
    if (payload.description) sanitize(payload.description, 2000)
    if (payload.price !== undefined && (payload.price < 100 || payload.price > 5000000)) throw new Error("Invalid price")
    clampRequestSize(JSON.stringify(payload), 800)
    try {
      const { data } = await api.patch<Product>(`/products/${id}`, payload)
      logger.info("productService:update", { id })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getMockProducts()
      const idx = all.findIndex((p) => p.id === id && p.sellerId === getSellerId())
      if (idx === -1) {
        logger.warn("productService:update tenant isolation blocked", { id, sellerId: getSellerId() })
        throw new Error("Product not found")
      }
      const updated: Product = { ...all[idx], ...payload, updatedAt: new Date().toISOString(), currency: payload.currency || all[idx].currency }
      // Re-validate after merge
      validateProductPayload({ name: updated.name, description: updated.description, price: updated.price, stock: updated.stock, images: updated.images })
      all[idx] = updated
      saveMockProducts(all)
      logger.info("productService:update mock", { id })
      return updated
    }
  },

  async remove(id: string): Promise<void> {
    rateLimited(`products:remove:${getSellerId()}`, 20, 60 * 1000)
    try {
      await api.delete(`/products/${id}`)
      logger.info("productService:remove", { id })
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getMockProducts()
      const before = all.length
      const filtered = all.filter((p) => !(p.id === id && p.sellerId === getSellerId()))
      if (filtered.length === before) {
        logger.warn("productService:remove not found/tenant", { id })
        throw new Error("Product not found")
      }
      saveMockProducts(filtered)
      logger.info("productService:remove mock", { id })
    }
  },

  async toggleActive(id: string, isActive: boolean): Promise<Product> {
    return this.update(id, { isActive })
  },

  seedDemo() {
    const sellerId = getSellerId()
    const existing = getMockProducts().filter((p) => p.sellerId === sellerId)
    if (existing.length > 0) return
    const now = new Date().toISOString()
    const demo: Product[] = [
      {
        id: "prod_demo1",
        sellerId,
        name: "Elixir Glow Serum",
        description: "Vitamin C serum for bright skin. 30ml. Lightweight and fast absorbing.",
        price: 8500,
        currency: "NGN",
        stock: 12,
        category: "Beauty",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop"],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_demo2",
        sellerId,
        name: "Cozy Knit Hoodie",
        description: "Soft fleece hoodie, unisex, perfect for harmattan.",
        price: 14000,
        currency: "NGN",
        stock: 3,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&h=600&fit=crop"],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "prod_demo3",
        sellerId,
        name: "Citrus Cold Press",
        description: "Fresh orange and lime cold press, 500ml.",
        price: 2200,
        currency: "NGN",
        stock: 0,
        category: "Food",
        images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop"],
        isActive: false,
        createdAt: now,
        updatedAt: now,
      },
    ]
    const all = getMockProducts()
    all.push(...demo)
    saveMockProducts(all)
    logger.info("productService:seedDemo", { sellerId })
  },
}
