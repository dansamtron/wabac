import api from "./api"
import type { Product, CreateProductPayload, UpdateProductPayload } from "../types/product"

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function isMockMode(error: unknown) {
  // If api is not reachable, axios throws without response
  return !error || (error as { response?: unknown })?.response === undefined
}

export const productService = {
  async list(params?: { search?: string; category?: string; isActive?: boolean }): Promise<Product[]> {
    try {
      const { data } = await api.get<Product[]>("/products", { params })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let products = getMockProducts().filter((p) => p.sellerId === getSellerId())
      if (params?.search) {
        const q = params.search.toLowerCase()
        products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      }
      if (params?.category) products = products.filter((p) => p.category === params.category)
      if (params?.isActive !== undefined) products = products.filter((p) => p.isActive === params.isActive)
      // Seed demo data once
      if (products.length === 0 && !params?.search && !params?.category && params?.isActive === undefined) {
        const sellerId = getSellerId()
        if (getMockProducts().filter((p) => p.sellerId === sellerId).length === 0) {
          // Do not auto seed here, let caller handle
        }
      }
      return products
    }
  },

  async getById(id: string): Promise<Product> {
    try {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let found = getMockProducts().find((p) => p.id === id && p.sellerId === getSellerId())
      if (!found) found = getMockProducts().find((p) => p.id === id)
      if (!found) throw new Error("Product not found")
      return found
    }
  },

  async listPublic(params?: { search?: string; category?: string }): Promise<Product[]> {
    try {
      const { data } = await api.get<Product[]>("/products", { params: { ...params, public: true } })
      return data.filter((p) => p.isActive)
    } catch {
      let products = getMockProducts().filter((p) => p.isActive)
      if (params?.search) {
        const q = params.search.toLowerCase()
        products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      }
      if (params?.category) products = products.filter((p) => p.category === params.category)
      return products
    }
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    try {
      const { data } = await api.post<Product>("/products", payload)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const now = new Date().toISOString()
      const product: Product = {
        id: "prod_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId: getSellerId(),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        currency: payload.currency || "NGN",
        stock: payload.stock,
        category: payload.category,
        images: payload.images,
        isActive: payload.isActive,
        createdAt: now,
        updatedAt: now,
      }
      const all = getMockProducts()
      all.push(product)
      saveMockProducts(all)
      return product
    }
  },

  async update(id: string, payload: UpdateProductPayload): Promise<Product> {
    try {
      const { data } = await api.patch<Product>(`/products/${id}`, payload)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getMockProducts()
      const idx = all.findIndex((p) => p.id === id && p.sellerId === getSellerId())
      if (idx === -1) throw new Error("Product not found")
      const updated: Product = { ...all[idx], ...payload, updatedAt: new Date().toISOString(), currency: payload.currency || all[idx].currency }
      all[idx] = updated
      saveMockProducts(all)
      return updated
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`)
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getMockProducts()
      const filtered = all.filter((p) => !(p.id === id && p.sellerId === getSellerId()))
      saveMockProducts(filtered)
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
  },
}
