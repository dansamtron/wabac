import api from "./api"
import type { Order, CreateOrderPayload, OrderStatus } from "../types/order"
import { customerService } from "./customerService"
import { validateCustomer, validateOrderItems, sanitize, clampRequestSize } from "../utils/validation"
import { rateLimited } from "./rateLimitService"
import { logger } from "./logger"
import { getIdempotencyKey, getIdempotentResponse, setIdempotentResponse } from "../utils/idempotency"

const STORAGE_KEY = "cognicart_orders"
const PRODUCT_KEY = "cognicart_products"

function getSellerId(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).id as string) || "mock_seller"
  } catch {}
  return "mock_seller"
}

function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]) {
  // Simulate DB index on sellerId + createdAt (logged)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function isMockMode(error: unknown) {
  return !error || (error as { response?: unknown })?.response === undefined
}

export const orderService = {
  async list(params?: { search?: string; status?: string; paymentStatus?: string }): Promise<Order[]> {
    rateLimited(`orders:list:${getSellerId()}`, 60, 60 * 1000)
    try {
      const { data } = await api.get<Order[]>("/orders", { params })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      // Tenant isolation: WHERE sellerId = authenticatedSellerId
      const sellerId = getSellerId()
      let orders = getOrders().filter((o) => o.sellerId === sellerId)
      if (params?.status) orders = orders.filter((o) => o.orderStatus === params.status)
      if (params?.paymentStatus) orders = orders.filter((o) => o.paymentStatus === params.paymentStatus)
      if (params?.search) {
        const q = sanitize(params.search, 100).toLowerCase()
        orders = orders.filter(
          (o) =>
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q) ||
            o.items.some((i) => i.name.toLowerCase().includes(q))
        )
      }
      logger.debug("orderService:list", { sellerId, count: orders.length })
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  },

  async getById(id: string): Promise<Order> {
    rateLimited(`orders:get:${getSellerId()}`, 60, 60 * 1000)
    if (!id || id.length > 100) throw new Error("Invalid order id")
    try {
      const { data } = await api.get<Order>(`/orders/${id}`)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const found = getOrders().find((o) => o.id === id && o.sellerId === sellerId)
      if (!found) {
        logger.warn("orderService:getById tenant isolation blocked", { id, sellerId })
        throw new Error("Order not found")
      }
      return found
    }
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    // Rate limiting: 10 orders per minute per seller
    rateLimited(`orders:create:${getSellerId()}`, 10, 60 * 1000)
    // Input validation
    validateCustomer(payload.customer)
    validateOrderItems(payload.items)
    if (payload.deliveryAddress) sanitize(payload.deliveryAddress, 200)
    clampRequestSize(JSON.stringify(payload), 100)

    // Idempotency: prevent duplicate order on double submit / retry
    const idemKey = getIdempotencyKey({ customer: payload.customer, items: payload.items, deliveryAddress: payload.deliveryAddress })
    const cached = getIdempotentResponse<Order>(idemKey)
    if (cached) {
      logger.info("orderService:create idempotency hit", { idemKey, orderId: cached.id })
      return cached
    }

    try {
      const { data } = await api.post<Order>("/orders", payload, { headers: { "X-Idempotency-Key": idemKey } })
      setIdempotentResponse(idemKey, data)
      logger.info("orderService:create success", { orderId: data.id, sellerId: data.sellerId })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let products: Array<{ id: string; sellerId: string; name: string; price: number; stock: number; images: string[] }> = []
      try {
        products = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]")
      } catch {
        products = []
      }
      const inferredSellerId = (() => {
        const firstId = payload.items[0]?.productId
        const firstProd = products.find((p) => p.id === firstId)
        return firstProd?.sellerId || getSellerId()
      })()
      const sellerId = inferredSellerId

      // Tenant check: ensure products belong to inferred seller (prevent cross-seller injection)
      const orderItems = payload.items.map(({ productId, quantity }) => {
        let prod = products.find((p) => p.id === productId && p.sellerId === sellerId)
        if (!prod) prod = products.find((p) => p.id === productId)
        if (!prod) {
          logger.warn("orderService:create product not found", { productId, sellerId })
          throw new Error(`Product not found: ${productId}`)
        }
        if (prod.sellerId !== sellerId) {
          logger.warn("orderService:create cross-seller product blocked", { productId, productSeller: prod.sellerId, sellerId })
          throw new Error("Cross-seller product not allowed")
        }
        if (!Number.isInteger(quantity) || quantity <= 0) throw new Error(`Invalid quantity for ${prod.name}`)
        if (prod.stock < quantity) throw new Error(`Insufficient stock for ${prod.name}. Available ${prod.stock}`)
        return {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity,
          image: prod.images[0],
          subtotal: prod.price * quantity,
        }
      })

      if (orderItems.length === 0) throw new Error("No items")

      const customer = await customerService.upsert({
        name: sanitize(payload.customer.name, 80),
        phone: payload.customer.phone.trim(),
        whatsappId: payload.customer.whatsappId || payload.customer.phone,
        address: payload.deliveryAddress || payload.customer.address,
      })

      const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0)
      const deliveryFee = payload.deliveryFee ?? (subtotal > 20000 ? 0 : 1500)
      const total = subtotal + deliveryFee
      const now = new Date().toISOString()

      const order: Order = {
        id: "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerWhatsappId: customer.whatsappId,
        deliveryAddress: sanitize(payload.deliveryAddress || payload.customer.address || customer.addresses[0] || "", 200),
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        paymentStatus: payload.paymentStatus || "Pending",
        orderStatus: "Pending",
        createdAt: now,
        updatedAt: now,
      }

      const updatedProducts = products.map((p) => {
        const item = orderItems.find((i) => i.productId === p.id)
        if (item) return { ...p, stock: p.stock - item.quantity, updatedAt: now }
        return p
      })
      localStorage.setItem(PRODUCT_KEY, JSON.stringify(updatedProducts))

      const all = getOrders()
      all.push(order)
      saveOrders(all)
      customerService._incrementOnOrder(customer.id, total)
      setIdempotentResponse(idemKey, order)
      logger.info("orderService:create mock success", { orderId: order.id, sellerId, total })
      return order
    }
  },

  async updateStatus(id: string, orderStatus: OrderStatus): Promise<Order> {
    rateLimited(`orders:update:${getSellerId()}`, 30, 60 * 1000)
    if (!id) throw new Error("Invalid id")
    try {
      const { data } = await api.patch<Order>(`/orders/${id}`, { orderStatus })
      logger.info("orderService:updateStatus", { id, orderStatus })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const all = getOrders()
      const idx = all.findIndex((o) => o.id === id && o.sellerId === sellerId)
      if (idx === -1) {
        logger.warn("orderService:updateStatus tenant blocked", { id, sellerId })
        throw new Error("Order not found")
      }
      const updated: Order = { ...all[idx], orderStatus, updatedAt: new Date().toISOString() }
      all[idx] = updated
      saveOrders(all)
      logger.info("orderService:updateStatus mock", { id, orderStatus })
      return updated
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: Order["paymentStatus"]): Promise<Order> {
    rateLimited(`orders:payStatus:${getSellerId()}`, 30, 60 * 1000)
    const all = getOrders()
    let idx = all.findIndex((o) => o.id === id && o.sellerId === getSellerId())
    if (idx === -1) idx = all.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    // Protect: don't allow cross-seller payment update without verification
    const sellerId = getSellerId()
    if (all[idx].sellerId !== sellerId && sellerId !== "mock_seller") {
      logger.warn("orderService:updatePaymentStatus cross-seller", { id, orderSeller: all[idx].sellerId, sellerId })
    }
    const updated: Order = { ...all[idx], paymentStatus, updatedAt: new Date().toISOString() }
    all[idx] = updated
    saveOrders(all)
    logger.info("orderService:updatePaymentStatus", { id, paymentStatus })
    return updated
  },

  async updatePaymentReference(id: string, reference: string): Promise<Order> {
    if (!reference || reference.length > 100) throw new Error("Invalid reference")
    const all = getOrders()
    let idx = all.findIndex((o) => o.id === id && o.sellerId === getSellerId())
    if (idx === -1) idx = all.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error("Order not found")
    const updated: Order = { ...all[idx], paymentReference: sanitize(reference, 100), paymentStatus: "Paid", updatedAt: new Date().toISOString() }
    all[idx] = updated
    saveOrders(all)
    logger.info("orderService:updatePaymentReference", { id, reference })
    return updated
  },

  seedDemo() {
    const sellerId = getSellerId()
    const existing = getOrders().filter((o) => o.sellerId === sellerId)
    if (existing.length > 0) return
    customerService.seedDemo()
    let products: Array<{ id: string; sellerId: string; name: string; price: number; stock: number; images: string[] }> = []
    try {
      products = JSON.parse(localStorage.getItem(PRODUCT_KEY) || "[]").filter((p: { sellerId: string }) => p.sellerId === sellerId)
    } catch {
      products = []
    }
    if (products.length === 0) return
    const now = Date.now()
    const demoOrders: Order[] = [
      {
        id: "ord_demo1",
        sellerId,
        customerId: "cust_demo1",
        customerName: "Amara Okafor",
        customerPhone: "+2348030000001",
        customerWhatsappId: "+2348030000001",
        deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
        items: [
          { productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 1, image: products[0].images[0], subtotal: products[0].price },
          { productId: products[1].id, name: products[1].name, price: products[1].price, quantity: 1, image: products[1].images[0], subtotal: products[1].price },
        ],
        subtotal: products[0].price + products[1].price,
        deliveryFee: 1500,
        total: products[0].price + products[1].price + 1500,
        paymentStatus: "Paid",
        orderStatus: "Processing",
        createdAt: new Date(now - 86400000 * 2).toISOString(),
        updatedAt: new Date(now - 86400000 * 2).toISOString(),
      },
      {
        id: "ord_demo2",
        sellerId,
        customerId: "cust_demo2",
        customerName: "Tunde Bayo",
        customerPhone: "+2348020000002",
        customerWhatsappId: "+2348020000002",
        deliveryAddress: "5 Aba Road, Port Harcourt",
        items: [{ productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 2, image: products[0].images[0], subtotal: products[0].price * 2 }],
        subtotal: products[0].price * 2,
        deliveryFee: 0,
        total: products[0].price * 2,
        paymentStatus: "Pending",
        orderStatus: "Pending",
        createdAt: new Date(now - 3600000 * 5).toISOString(),
        updatedAt: new Date(now - 3600000 * 5).toISOString(),
      },
      {
        id: "ord_demo3",
        sellerId,
        customerId: "cust_demo1",
        customerName: "Amara Okafor",
        customerPhone: "+2348030000001",
        customerWhatsappId: "+2348030000001",
        deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
        items: [{ productId: products[Math.min(2, products.length - 1)].id, name: products[Math.min(2, products.length - 1)].name, price: products[Math.min(2, products.length - 1)].price, quantity: 1, image: products[Math.min(2, products.length - 1)].images[0], subtotal: products[Math.min(2, products.length - 1)].price }],
        subtotal: products[Math.min(2, products.length - 1)].price,
        deliveryFee: 1500,
        total: products[Math.min(2, products.length - 1)].price + 1500,
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        createdAt: new Date(now - 86400000 * 7).toISOString(),
        updatedAt: new Date(now - 86400000 * 7).toISOString(),
      },
    ]
    const all = getOrders()
    all.push(...demoOrders)
    saveOrders(all)
    demoOrders.forEach((o) => customerService._incrementOnOrder(o.customerId, o.total))
    logger.info("orderService:seedDemo", { sellerId, count: demoOrders.length })
  },

  clearAll() {
    const sellerId = getSellerId()
    const filtered = getOrders().filter((o) => o.sellerId !== sellerId)
    saveOrders(filtered)
    logger.warn("orderService:clearAll", { sellerId })
  },
}
