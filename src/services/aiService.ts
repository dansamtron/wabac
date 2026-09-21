import type { AIResponse, AIToolCall, AIContext } from "../types/ai"
import api from "./api"

const CONTEXT_KEY = (sellerId: string, customerPhone: string) => `cognicart_ai_ctx_${sellerId}_${customerPhone}`
const AI_ENABLED_KEY = (sellerId: string) => `cognicart_ai_enabled_${sellerId}`

function getSellerId(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).id as string) || "mock_seller"
  } catch {}
  return "mock_seller"
}

function getBusinessName(sellerId: string): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) {
      const s = JSON.parse(raw)
      if (s.id === sellerId && s.businessName) return s.businessName
    }
    // fallback from business
    const bizRaw = localStorage.getItem("cognicart_business")
    if (bizRaw) {
      const businesses = JSON.parse(bizRaw)
      const biz = Array.isArray(businesses) ? businesses.find((b: { sellerId: string; name: string }) => b.sellerId === sellerId) : null
      if (biz?.name) return biz.name
    }
  } catch {}
  return "My Store"
}

function getContext(sellerId: string, customerPhone: string): AIContext {
  try {
    const raw = localStorage.getItem(CONTEXT_KEY(sellerId, customerPhone))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { sellerId, customerPhone }
}

function saveContext(ctx: AIContext) {
  localStorage.setItem(CONTEXT_KEY(ctx.sellerId, ctx.customerPhone), JSON.stringify(ctx))
}

function isMockMode(error: unknown) {
  return !error || (error as { response?: unknown })?.response === undefined
}

// Tool implementations - all sellerId scoped

async function toolSearchProducts(sellerId: string, args: { query: string; limit?: number }) {
  try {
    const prodRaw = localStorage.getItem("cognicart_products")
    const all = prodRaw ? (JSON.parse(prodRaw) as Array<{ sellerId: string; isActive: boolean; id: string; name: string; description: string; price: number; stock: number; category: string; images: string[] }>) : []
    let filtered = all.filter((p) => p.sellerId === sellerId && p.isActive)
    if (args.query) {
      const q = args.query.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }
    const limit = args.limit || 5
    return filtered.slice(0, limit).map((p) => ({ id: p.id, name: p.name, price: p.price, stock: p.stock, category: p.category, description: p.description }))
  } catch {
    return []
  }
}

async function toolGetProduct(sellerId: string, args: { productId: string }) {
  const prodRaw = localStorage.getItem("cognicart_products")
  const all = prodRaw ? (JSON.parse(prodRaw) as Array<{ sellerId: string; id: string; name: string; description: string; price: number; stock: number; category: string; images: string[]; isActive: boolean }>) : []
  const prod = all.find((p) => p.id === args.productId && p.sellerId === sellerId)
  if (!prod) throw new Error("Product not found")
  return prod
}

async function toolCheckStock(sellerId: string, args: { productId: string }) {
  const prod = await toolGetProduct(sellerId, args)
  return { productId: prod.id, name: prod.name, stock: prod.stock, price: prod.price, available: prod.stock > 0 }
}

async function toolGetBusinessInfo(sellerId: string) {
  try {
    const bizRaw = localStorage.getItem("cognicart_business")
    if (bizRaw) {
      const businesses = JSON.parse(bizRaw)
      const biz = Array.isArray(businesses) ? businesses.find((b: { sellerId: string }) => b.sellerId === sellerId) : null
      if (biz) return biz
    }
  } catch {}
  return { name: getBusinessName(sellerId), deliveryInfo: "Lagos 1-2 days, outside Lagos 2-4 days", deliveryFee: 1500, paymentMethod: "both" }
}

async function toolCalculateOrderTotal(sellerId: string, args: { items: Array<{ productId: string; quantity: number }>; deliveryFee?: number }) {
  let subtotal = 0
  for (const item of args.items) {
    const prod = await toolGetProduct(sellerId, { productId: item.productId })
    if (prod.stock < item.quantity) throw new Error(`Insufficient stock for ${prod.name}`)
    subtotal += prod.price * item.quantity
  }
  const deliveryFee = args.deliveryFee ?? (subtotal > 20000 ? 0 : 1500)
  return { subtotal, deliveryFee, total: subtotal + deliveryFee }
}

async function toolCreateOrder(_sellerId: string, args: { items: Array<{ productId: string; quantity: number }>; customer: { name: string; phone: string; address: string }; deliveryAddress?: string }) {
  // Use orderService mock directly via localStorage to stay sellerId scoped
  // Reuse logic from orderService.create but simplified - import dynamically to avoid circular
  const { orderService } = await import("./orderService")
  return orderService.create({
    customer: args.customer,
    items: args.items,
    deliveryAddress: args.deliveryAddress || args.customer.address,
  })
}

async function toolCreatePayment(sellerId: string, args: { orderId: string; email?: string }) {
  const { paymentService } = await import("./paymentService")
  const orderRaw = localStorage.getItem("cognicart_orders")
  const orders = orderRaw ? (JSON.parse(orderRaw) as Array<{ id: string; sellerId: string; total: number; subtotal: number; deliveryFee: number; paymentStatus: string }>) : []
  const order = orders.find((o) => o.id === args.orderId && o.sellerId === sellerId)
  if (!order) throw new Error("Order not found for this seller")
  if (order.paymentStatus === "Paid") return { alreadyPaid: true, reference: (order as unknown as { paymentReference?: string }).paymentReference }
  const email = args.email || `${sellerId}@cognicart.test`
  const { reference, transaction } = await paymentService.initialize({
    orderId: order.id,
    amount: order.total,
    email,
    sellerId,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
  })
  return { reference, amount: order.total, transaction }
}

// Helpers to parse customer intent

function extractQuantity(text: string): number | null {
  const m = text.match(/x\s*(\d+)|qty\s*(\d+)|quantity\s*(\d+)|(\d+)\s*units?/i)
  if (m) {
    const val = m[1] || m[2] || m[3] || m[4]
    const n = parseInt(val, 10)
    if (!isNaN(n) && n > 0) return n
  }
  // If text contains "one", "two"
  if (/\bone\b/i.test(text)) return 1
  if (/\btwo\b/i.test(text)) return 2
  if (/\bthree\b/i.test(text)) return 3
  return null
}

function extractAddress(text: string): string | null {
  // Look for deliver to / address : patterns
  const lower = text.toLowerCase()
  const markers = ["deliver to", "delivery to", "address", "ship to", "to "]
  for (const marker of markers) {
    const idx = lower.indexOf(marker)
    if (idx !== -1) {
      const after = text.slice(idx + marker.length).trim().replace(/^[:-\s]+/, "")
      if (after.length > 8) return after.slice(0, 80)
    }
  }
  // If text looks like address (contains number + street/road/avenue)
  if (/\d+.*(street|road|avenue|close|estate|lane|way|drive|avenue|ikoyi|yaba|ikeja|ph|lagos|abuja|port harcourt)/i.test(text)) {
    return text.slice(0, 80)
  }
  return null
}

function extractProductKeyword(text: string, products: Array<{ id: string; name: string }>): { id?: string; name?: string } | null {
  const lower = text.toLowerCase()
  for (const p of products) {
    if (lower.includes(p.name.toLowerCase())) return { id: p.id, name: p.name }
  }
  // Try partial word match
  const words = lower.split(/[^a-z0-9]+/).filter(Boolean)
  for (const p of products) {
    const nameWords = p.name.toLowerCase().split(/[^a-z0-9]+/)
    if (words.some((w) => nameWords.includes(w))) return { id: p.id, name: p.name }
  }
  return null
}

export const aiService = {
  isEnabled(sellerId?: string): boolean {
    const sid = sellerId || getSellerId()
    return localStorage.getItem(AI_ENABLED_KEY(sid)) !== "false" // default true after Phase 6
  },

  setEnabled(enabled: boolean, sellerId?: string) {
    const sid = sellerId || getSellerId()
    localStorage.setItem(AI_ENABLED_KEY(sid), String(enabled))
  },

  getToolDefinitions() {
    return [
      { name: "searchProducts", description: "Search seller products by query", parameters: { query: { type: "string", required: true, description: "search query" }, limit: { type: "number", required: false, description: "limit" } } },
      { name: "getProduct", description: "Get product details by id", parameters: { productId: { type: "string", required: true, description: "product id" } } },
      { name: "checkStock", description: "Check stock for product", parameters: { productId: { type: "string", required: true, description: "product id" } } },
      { name: "getBusinessInfo", description: "Get seller business info", parameters: {} },
      { name: "calculateOrderTotal", description: "Calculate order total", parameters: { items: { type: "array", required: true, description: "items" }, deliveryFee: { type: "number", required: false, description: "fee" } } },
      { name: "createOrder", description: "Create order for customer", parameters: { items: { type: "array", required: true, description: "items" }, customer: { type: "object", required: true, description: "customer" }, deliveryAddress: { type: "string", required: false, description: "address" } } },
      { name: "createPayment", description: "Create Paystack payment for order", parameters: { orderId: { type: "string", required: true, description: "order id" }, email: { type: "string", required: false, description: "customer email" } } },
    ]
  },

  async chat(sellerId: string, customerPhone: string, body: string, history?: string[]): Promise<AIResponse> {
    // Try real OpenAI if key present
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (openaiKey) {
      try {
        const res = await api.post<AIResponse>("/ai/chat", { sellerId, customerPhone, body, history })
        return res.data
      } catch (error) {
        if (!isMockMode(error)) throw error
        // fallthrough to mock
      }
    }

    const ctx = getContext(sellerId, customerPhone)
    const lower = body.toLowerCase().trim()
    const toolCalls: AIToolCall[] = []
    let intent = "unknown"
    let reply = ""
    let orderId: string | undefined

    const businessName = getBusinessName(sellerId)

    // Load products for matching
    const allProductsRaw = localStorage.getItem("cognicart_products")
    const allProducts = allProductsRaw ? (JSON.parse(allProductsRaw) as Array<{ sellerId: string; isActive: boolean; id: string; name: string; price: number; stock: number; category: string }>) : []
    const sellerProducts = allProducts.filter((p) => p.sellerId === sellerId && p.isActive)
    void (await toolGetBusinessInfo(sellerId))

    // Check for confirmation after awaiting
    if (ctx.awaitingConfirmation && /^(yes|confirm|proceed|place order|okay|ok)\b/i.test(lower)) {
      intent = "confirm_order"
      if (ctx.pendingProductId && ctx.pendingQuantity && ctx.pendingAddress) {
        const callId = "call_" + Date.now()
        toolCalls.push({ id: callId, name: "calculateOrderTotal", arguments: { items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity }] } })
        const totals = await toolCalculateOrderTotal(sellerId, { items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity }] })
        toolCalls[0].result = totals

        const createCallId = "call_" + (Date.now() + 1)
        toolCalls.push({
          id: createCallId,
          name: "createOrder",
          arguments: {
            items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity }],
            customer: { name: customerPhone, phone: customerPhone, address: ctx.pendingAddress },
            deliveryAddress: ctx.pendingAddress,
          },
        })
        try {
          const order = await toolCreateOrder(sellerId, {
            items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity }],
            customer: { name: customerPhone, phone: customerPhone, address: ctx.pendingAddress },
            deliveryAddress: ctx.pendingAddress,
          })
          const ord = order as unknown as { id: string; total: number }
          toolCalls[1].result = order
          orderId = ord.id
          ctx.lastOrderId = ord.id
          ctx.lastOrderTotal = (totals as { total: number }).total
          reply = `Order created! #${ord.id.slice(-6).toUpperCase()} — ${ctx.pendingProductName} x${ctx.pendingQuantity} → ₦${(totals as { total: number }).total.toLocaleString()} (delivery ₦${(totals as { deliveryFee: number }).deliveryFee.toLocaleString()}). I will confirm delivery to ${ctx.pendingAddress}. Reply PAY to get Paystack link or you can pay on delivery. Want anything else?`
          // clear context but keep lastOrderId
          ctx.pendingProductId = undefined
          ctx.pendingQuantity = undefined
          ctx.pendingAddress = undefined
          ctx.awaitingConfirmation = false
          ctx.awaitingAddress = false
          saveContext(ctx)
        } catch (e) {
          toolCalls[1].error = e instanceof Error ? e.message : "Failed"
          reply = `Could not create order: ${toolCalls[1].error}. Please check stock or try another product.`
        }
        return { reply, toolCalls, orderId, intent }
      } else {
        reply = `I need a product and delivery address before confirming. What would you like to order?`
        return { reply, toolCalls, intent }
      }
    }

    if (ctx.awaitingConfirmation && /^(no|cancel|wait)\b/i.test(lower)) {
      ctx.awaitingConfirmation = false
      saveContext(ctx)
      return { reply: `No problem, order not placed. Let me know what you would like to do.`, toolCalls: [], intent: "cancel_order" }
    }

    // If awaiting address and body looks like address
    if (ctx.awaitingAddress && ctx.pendingProductId) {
      const addr = extractAddress(body) || body
      if (addr && addr.length > 8) {
        ctx.pendingAddress = addr
        ctx.awaitingAddress = false
        // calculate total and ask confirmation
        const callId = "call_" + Date.now()
        toolCalls.push({ id: callId, name: "calculateOrderTotal", arguments: { items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity || 1 }] } })
        const totals = await toolCalculateOrderTotal(sellerId, { items: [{ productId: ctx.pendingProductId, quantity: ctx.pendingQuantity || 1 }] })
        toolCalls[0].result = totals
        ctx.awaitingConfirmation = true
        saveContext(ctx)
        reply = `Your order:\n${ctx.pendingProductName} x${ctx.pendingQuantity} — ₦${(totals as { subtotal: number }).subtotal.toLocaleString()}\nDelivery: ₦${(totals as { deliveryFee: number }).deliveryFee.toLocaleString()}\nTotal: ₦${(totals as { total: number }).total.toLocaleString()}\nDeliver to: ${addr}\nReply YES to confirm.`
        return { reply, toolCalls, intent: "confirm" }
      }
    }

    // Greeting
    if (/^(hi|hello|hey|good morning|good afternoon)\b/i.test(lower)) {
      intent = "greeting"
      // search top products as suggestion
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "searchProducts", arguments: { query: "", limit: 3 } })
      const results = await toolSearchProducts(sellerId, { query: "", limit: 3 })
      toolCalls[0].result = results
      if (results.length > 0) {
        const list = results.map((p) => `${p.name} — ₦${p.price.toLocaleString()} (${p.stock > 0 ? `${p.stock} in stock` : "out"})`).join("\n")
        reply = `Hello! Welcome to ${businessName}. I can find products, check price and stock, and place orders.\nTop items:\n${list}\nWhat are you looking for?`
      } else {
        reply = `Hello! Welcome to ${businessName}. What product are you looking for?`
      }
      return { reply, toolCalls, intent }
    }

    // Check if message is asking for business info
    if (lower.includes("deliver") || lower.includes("shipping") || lower.includes("payment") || lower.includes("where is") || lower.includes("location")) {
      intent = "business_info"
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "getBusinessInfo", arguments: {} })
      const info = await toolGetBusinessInfo(sellerId)
      toolCalls[0].result = info
      reply = `${businessName} — ${(info as { deliveryInfo?: string }).deliveryInfo || "Lagos 1-2 days"}. Payment: ${(info as { paymentMethod?: string }).paymentMethod || "both"}. What product would you like?`
      return { reply, toolCalls, intent }
    }

    // Try to detect order intent with product and address in same message
    const qty = extractQuantity(body)
    const productMatch = extractProductKeyword(body, sellerProducts)
    const addr = extractAddress(body)

    // If body contains both product and address, try to create order directly
    if (productMatch?.id && qty && addr) {
      intent = "create_order_direct"
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "checkStock", arguments: { productId: productMatch.id } })
      const stock = await toolCheckStock(sellerId, { productId: productMatch.id })
      toolCalls[0].result = stock
      if (!(stock as { available: boolean }).available) {
        reply = `${productMatch.name} is out of stock. Want another product?`
        return { reply, toolCalls, intent }
      }
      const calcId = "call_" + (Date.now() + 1)
      toolCalls.push({ id: calcId, name: "calculateOrderTotal", arguments: { items: [{ productId: productMatch.id, quantity: qty }] } })
      const totals = await toolCalculateOrderTotal(sellerId, { items: [{ productId: productMatch.id, quantity: qty }] })
      toolCalls[1].result = totals
      ctx.pendingProductId = productMatch.id
      ctx.pendingProductName = productMatch.name
      ctx.pendingQuantity = qty
      ctx.pendingAddress = addr
      ctx.awaitingConfirmation = true
      saveContext(ctx)
      reply = `Your order:\n${productMatch.name} x${qty} — ₦${(totals as { subtotal: number }).subtotal.toLocaleString()}\nDelivery: ₦${(totals as { deliveryFee: number }).deliveryFee.toLocaleString()}\nTotal: ₦${(totals as { total: number }).total.toLocaleString()}\nDeliver to: ${addr}\nReply YES to confirm.`
      return { reply, toolCalls, intent }
    }

    // If product + quantity but no address -> ask for address
    if (productMatch?.id && qty && !addr) {
      intent = "order_initiate"
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "checkStock", arguments: { productId: productMatch.id } })
      const stock = await toolCheckStock(sellerId, { productId: productMatch.id })
      toolCalls[0].result = stock
      if (!(stock as { available: boolean }).available) {
        reply = `${productMatch.name} is out of stock. Want another product?`
        return { reply, toolCalls, intent }
      }
      ctx.pendingProductId = productMatch.id
      ctx.pendingProductName = productMatch.name
      ctx.pendingQuantity = qty
      ctx.awaitingAddress = true
      saveContext(ctx)
      reply = `${productMatch.name} x${qty} is available. What is your delivery address? Example: "12 Allen Avenue, Ikeja, Lagos"`
      return { reply, toolCalls, intent }
    }

    // If only product mentioned without qty -> ask qty and provide details
    if (productMatch?.id && !qty) {
      // check if lower contains price/stock explicitly
      if (lower.includes("price") || lower.includes("how much") || lower.includes("cost")) {
        intent = "price"
        const callId = "call_" + Date.now()
        toolCalls.push({ id: callId, name: "getProduct", arguments: { productId: productMatch.id } })
        const prod = await toolGetProduct(sellerId, { productId: productMatch.id })
        toolCalls[0].result = prod
        reply = `${prod.name} is ₦${prod.price.toLocaleString()} and ${prod.stock > 0 ? `in stock (${prod.stock} units)` : "out of stock"}. Want to order? Tell me quantity, e.g. "1 x deliver to Ikeja"`
        ctx.pendingProductId = productMatch.id
        ctx.pendingProductName = productMatch.name
        saveContext(ctx)
        return { reply, toolCalls, intent }
      }
      if (lower.includes("stock") || lower.includes("available")) {
        intent = "stock"
        const callId = "call_" + Date.now()
        toolCalls.push({ id: callId, name: "checkStock", arguments: { productId: productMatch.id } })
        const stock = await toolCheckStock(sellerId, { productId: productMatch.id })
        toolCalls[0].result = stock
        reply = `${productMatch.name} • ₦${(stock as { price: number }).price.toLocaleString()} • ${(stock as { available: boolean }).available ? `In stock: ${(stock as { stock: number }).stock} units` : "Out of stock"}`
        return { reply, toolCalls, intent }
      }
      // General product mention -> show details + ask order
      intent = "product_detail"
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "getProduct", arguments: { productId: productMatch.id } })
      const prod = await toolGetProduct(sellerId, { productId: productMatch.id })
      toolCalls[0].result = prod
      ctx.pendingProductId = productMatch.id
      ctx.pendingProductName = productMatch.name
      saveContext(ctx)
      reply = `${prod.name} — ₦${prod.price.toLocaleString()} • ${prod.category}\n${prod.description}\n${prod.stock > 0 ? `In stock: ${prod.stock}` : "Out of stock"}\nWant to order? Tell me quantity and delivery address.`
      return { reply, toolCalls, intent }
    }

    // Search intent - if no exact product but keyword exists, search
    const keyword = body.replace(/^(show|search|find|need|want|looking for|hi|hello|hey)\s+/i, "").trim()
    if (keyword.length > 2) {
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "searchProducts", arguments: { query: keyword, limit: 3 } })
      const results = await toolSearchProducts(sellerId, { query: keyword, limit: 3 })
      toolCalls[0].result = results
      if (results.length > 0) {
        intent = "search"
        const list = results.map((p) => `${p.name} — ₦${p.price.toLocaleString()} (${p.stock > 0 ? `${p.stock} in stock` : "out"})`).join("\n")
        ctx.lastSearchResults = results as never
        saveContext(ctx)
        reply = `Found ${results.length} product${results.length > 1 ? "s" : ""} for "${keyword}":\n${list}\nReply with the name and quantity, e.g. "Elixir Glow Serum x1 deliver to Yaba"`
        return { reply, toolCalls, intent }
      }
    }

    // Payment intent - generate Paystack link for last order
    if (lower === "pay" || lower === "yes pay" || lower.includes("pay for") || lower.includes("paystack") || lower.includes("payment link") || lower.includes("how to pay")) {
      intent = "create_payment"
      let orderId = ctx.lastOrderId
      // fallback: find most recent pending order for this phone
      if (!orderId) {
        try {
          const ordersRaw = localStorage.getItem("cognicart_orders")
          const orders = ordersRaw ? (JSON.parse(ordersRaw) as Array<{ id: string; sellerId: string; customerPhone: string; paymentStatus: string; total: number }>) : []
          const pending = orders.filter((o) => o.sellerId === sellerId && o.customerPhone === customerPhone && o.paymentStatus === "Pending").sort((a, b) => b.id.localeCompare(a.id))
          if (pending.length > 0) orderId = pending[0].id
        } catch {}
      }
      if (!orderId) {
        reply = `I could not find a pending order for you. Please place an order first, e.g. "Elixir Glow Serum x1 deliver to Ikeja"`
        return { reply, toolCalls, intent }
      }
      const callId = "call_" + Date.now()
      toolCalls.push({ id: callId, name: "createPayment", arguments: { orderId, email: `${customerPhone.replace(/[^0-9]/g, "")}@cognicart.test` } })
      try {
        const result = await toolCreatePayment(sellerId, { orderId, email: `${customerPhone.replace(/[^0-9]/g, "")}@cognicart.test` })
        toolCalls[0].result = result
        if ((result as { alreadyPaid?: boolean }).alreadyPaid) {
          reply = `Order #${orderId.slice(-6).toUpperCase()} is already Paid. Thank you!`
        } else {
          const r = result as { reference: string; amount: number }
          reply = `Paystack link generated for order #${orderId.slice(-6).toUpperCase()} — ₦${r.amount.toLocaleString()}.\nRef: ${r.reference}\nPay now: your Paystack checkout will open. After payment, reply paid and I will confirm. Test mode: payment will auto-verify in 1 second.`
        }
      } catch (e) {
        toolCalls[0].error = e instanceof Error ? e.message : "Failed"
        reply = `Could not create payment: ${toolCalls[0].error}`
      }
      return { reply, toolCalls, orderId, intent }
    }

    // Fallback
    intent = "fallback"
    reply = `I can help you find products, check price and stock, and place orders. Try: "show me beauty products", "price of Cozy Knit Hoodie", or "I want Elixir Glow Serum x1 deliver to Ikeja"`
    return { reply, toolCalls, intent }
  },
}
