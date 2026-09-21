import api from "./api"
import type { WhatsAppConfig, WhatsAppMessage } from "../types/whatsapp"

const CONFIG_KEY = "cognicart_whatsapp_config"
const MESSAGES_KEY = "cognicart_whatsapp_messages"

function getSellerId(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).id as string) || "mock_seller"
  } catch {}
  return "mock_seller"
}

function getSellerBusinessName(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).businessName as string) || "My Store"
  } catch {}
  return "My Store"
}

function getConfigs(): WhatsAppConfig[] {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || "[]")
  } catch {
    return []
  }
}

function saveConfigs(configs: WhatsAppConfig[]) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(configs))
}

function getMessages(): WhatsAppMessage[] {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]")
  } catch {
    return []
  }
}

function saveMessages(messages: WhatsAppMessage[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

function isMockMode(error: unknown) {
  return !error || (error as { response?: unknown })?.response === undefined
}

function deterministicReply(sellerId: string, body: string): string {
  const lower = body.toLowerCase()
  const businessName = getSellerBusinessName()

  // Try to get business delivery info
  let deliveryInfo = "Lagos 1-2 days, outside Lagos 2-4 days"
  let paymentInfo = "Paystack and bank transfer"
  try {
    const bizRaw = localStorage.getItem("cognicart_business")
    if (bizRaw) {
      const businesses = JSON.parse(bizRaw)
      const biz = Array.isArray(businesses) ? businesses.find((b: { sellerId: string }) => b.sellerId === sellerId) : null
      if (biz) {
        if (biz.deliveryInfo) deliveryInfo = biz.deliveryInfo
        if (biz.paymentMethod) paymentInfo = biz.paymentMethod === "both" ? "Paystack and bank transfer" : biz.paymentMethod
      }
    }
  } catch {}

  // Get products for seller
  let products: Array<{ name: string; price: number; stock: number; category: string }> = []
  try {
    const prodRaw = localStorage.getItem("cognicart_products")
    if (prodRaw) {
      const all = JSON.parse(prodRaw) as Array<{ sellerId: string; isActive: boolean; name: string; price: number; stock: number; category: string }>
      products = all.filter((p) => p.sellerId === sellerId && p.isActive).map((p) => ({ name: p.name, price: p.price, stock: p.stock, category: p.category }))
    }
  } catch {}

  // Greeting
  if (/(^|\s)(hi|hello|hey|hiya|good morning|good afternoon)(\s|!|\.|$)/i.test(lower)) {
    return `Hello! Welcome to ${businessName} on WhatsApp. I can help you find products, check price and stock, and place orders. Try: "show me serums under 10000" or "is Cozy Knit Hoodie in stock?"`
  }

  // Delivery question
  if (lower.includes("deliver") || lower.includes("shipping") || lower.includes("where is my order") || lower.includes("when will")) {
    return `Delivery: ${deliveryInfo}. Fee is confirmed at checkout. Orders in Lagos usually arrive in 1-2 days. Want to see products?`
  }

  // Payment question
  if (lower.includes("pay") || lower.includes("payment") || lower.includes("paystack") || lower.includes("transfer")) {
    return `Payment: ${paymentInfo}. You can pay via Paystack (card/bank) or transfer. We confirm payment before shipping. What would you like to order?`
  }

  // Try to extract product keyword for search/price/stock
  const extractKeyword = (text: string) => {
    const stopwords = ["show", "me", "i", "need", "want", "looking", "for", "a", "an", "the", "is", "are", "price", "stock", "available", "in", "how", "much", "what", "tell", "about", "do", "you", "have", "any", "with", "under", "around", "please", "hi", "hello"]
    const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
    const filtered = words.filter((w) => !stopwords.includes(w) && w.length > 2)
    return filtered.join(" ") || words.join(" ")
  }

  const keyword = extractKeyword(body)
  const searchProducts = (kw: string) => {
    if (!kw) return []
    const kwLower = kw.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(kwLower) || p.category.toLowerCase().includes(kwLower))
  }

  // Price query
  if (lower.includes("price") || lower.includes("how much") || lower.includes("cost")) {
    if (keyword) {
      const matches = searchProducts(keyword)
      if (matches.length > 0) {
        return `${matches[0].name} is ₦${matches[0].price.toLocaleString()} and ${matches[0].stock > 0 ? `in stock (${matches[0].stock} units)` : "out of stock"}. Want me to add it to cart?`
      }
    }
    return `Tell me which product you want the price for. Example: "price of Elixir Glow Serum"`
  }

  // Stock query
  if (lower.includes("stock") || lower.includes("available") || lower.includes("in stock")) {
    if (keyword) {
      const matches = searchProducts(keyword)
      if (matches.length > 0) {
        const m = matches[0]
        return `${m.name} • ₦${m.price.toLocaleString()} • ${m.stock > 0 ? `In stock: ${m.stock} units` : "Out of stock"} • ${m.category}. Want to order?`
      }
    }
    return `Which product should I check? Example: "is Citrus Cold Press available?"`
  }

  // Search / need / show
  if (lower.includes("show") || lower.includes("search") || lower.includes("need") || lower.includes("looking") || lower.includes("sneaker") || lower.includes("serum") || lower.includes("hoodie") || lower.includes("tote") || keyword.length > 3) {
    const matches = searchProducts(keyword)
    if (matches.length > 0) {
      const list = matches.slice(0, 3).map((p) => `${p.name} — ₦${p.price.toLocaleString()} (${p.stock > 0 ? `${p.stock} in stock` : "out"})`).join("\n")
      return `Found ${matches.length} product${matches.length > 1 ? "s" : ""}:\n${list}\nTell me which one you want to order.`
    }
    if (products.length > 0) {
      const list = products.slice(0, 3).map((p) => `${p.name} — ₦${p.price.toLocaleString()}`).join("\n")
      return `I did not find "${keyword}" but here are our top items:\n${list}\nWhat are you looking for?`
    }
  }

  // Order intent
  if (lower.includes("order") || lower.includes("buy") || lower.includes("want to") || lower.includes("add to cart")) {
    return `Great! Tell me the product and quantity. Example: "I want Elixir Glow Serum x1 deliver to Ikeja". I will confirm stock, price and delivery before creating the order.`
  }

  // Fallback help
  return `I can help you find products, check price and stock, and place orders — all from this seller's catalog. Try: "show me beauty products", "price of Cozy Knit Hoodie", or "is Market Tote available?"`
}

export const whatsappService = {
  async getConfig(): Promise<WhatsAppConfig | null> {
    try {
      const { data } = await api.get<WhatsAppConfig>("/whatsapp/config")
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getConfigs()
      return all.find((c) => c.sellerId === getSellerId()) || null
    }
  },

  async connect(payload: { businessPhone: string; phoneNumberId?: string; verifyToken?: string; accessToken?: string }): Promise<WhatsAppConfig> {
    try {
      const { data } = await api.post<WhatsAppConfig>("/whatsapp/connect", payload)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const all = getConfigs()
      const idx = all.findIndex((c) => c.sellerId === sellerId)
      const now = new Date().toISOString()
      const config: WhatsAppConfig = {
        sellerId,
        businessPhone: payload.businessPhone,
        phoneNumberId: payload.phoneNumberId || "pnid_" + sellerId.slice(-6),
        verifyToken: payload.verifyToken || "verify_" + sellerId.slice(-6),
        accessToken: payload.accessToken || "token_" + sellerId.slice(-6),
        webhookUrl: `${window.location.origin}/api/whatsapp/webhook`,
        webhookVerified: false,
        connectedAt: now,
        createdAt: idx === -1 ? now : all[idx].createdAt,
        updatedAt: now,
      }
      if (idx === -1) all.push(config)
      else all[idx] = config
      saveConfigs(all)
      // also sync to business
      try {
        const bizRaw = localStorage.getItem("cognicart_business")
        if (bizRaw) {
          const businesses = JSON.parse(bizRaw)
          const bIdx = businesses.findIndex((b: { sellerId: string }) => b.sellerId === sellerId)
          if (bIdx !== -1) {
            businesses[bIdx].whatsappPhone = payload.businessPhone
            businesses[bIdx].whatsappConnected = true
            businesses[bIdx].whatsappVerifiedAt = now
            businesses[bIdx].updatedAt = now
            localStorage.setItem("cognicart_business", JSON.stringify(businesses))
          }
        }
      } catch {}
      return config
    }
  },

  async disconnect(): Promise<void> {
    try {
      await api.post("/whatsapp/disconnect")
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const all = getConfigs().filter((c) => c.sellerId !== sellerId)
      saveConfigs(all)
      try {
        const bizRaw = localStorage.getItem("cognicart_business")
        if (bizRaw) {
          const businesses = JSON.parse(bizRaw)
          const bIdx = businesses.findIndex((b: { sellerId: string }) => b.sellerId === sellerId)
          if (bIdx !== -1) {
            businesses[bIdx].whatsappConnected = false
            businesses[bIdx].updatedAt = new Date().toISOString()
            localStorage.setItem("cognicart_business", JSON.stringify(businesses))
          }
        }
      } catch {}
    }
  },

  async verifyWebhook(params: { mode: string; verifyToken: string; challenge: string }): Promise<string> {
    try {
      const { data } = await api.get<string>("/whatsapp/webhook", { params })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const all = getConfigs()
      const cfg = all.find((c) => c.sellerId === sellerId)
      if (!cfg) throw new Error("No config. Connect first.")
      if (params.mode !== "subscribe") throw new Error("Invalid mode")
      if (params.verifyToken !== cfg.verifyToken) throw new Error("Verify token mismatch")
      // mark verified
      cfg.webhookVerified = true
      cfg.verifiedAt = new Date().toISOString()
      cfg.updatedAt = new Date().toISOString()
      saveConfigs(all)
      return params.challenge
    }
  },

  async listMessages(filters?: { customerPhone?: string; direction?: string }): Promise<WhatsAppMessage[]> {
    try {
      const { data } = await api.get<WhatsAppMessage[]>("/whatsapp/messages", { params: filters })
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      let msgs = getMessages().filter((m) => m.sellerId === getSellerId())
      if (filters?.customerPhone) msgs = msgs.filter((m) => m.customerPhone === filters.customerPhone)
      if (filters?.direction) msgs = msgs.filter((m) => m.direction === filters.direction)
      return msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }
  },

  async handleIncoming(payload: { from: string; body: string; businessPhone?: string }): Promise<{ inbound: WhatsAppMessage; outbound: WhatsAppMessage; toolCalls?: unknown }> {
    try {
      const { data } = await api.post<{ inbound: WhatsAppMessage; outbound: WhatsAppMessage }>("/whatsapp/incoming", payload)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      // seller identification: map businessPhone to sellerId
      let targetSellerId = sellerId
      let targetBusinessPhone = payload.businessPhone
      if (payload.businessPhone) {
        const allCfg = getConfigs()
        const matched = allCfg.find((c) => c.businessPhone === payload.businessPhone)
        if (matched) {
          targetSellerId = matched.sellerId
          targetBusinessPhone = matched.businessPhone
        }
      } else {
        const cfg = getConfigs().find((c) => c.sellerId === sellerId)
        targetBusinessPhone = cfg?.businessPhone || "mock_business"
      }

      const now = new Date().toISOString()
      const inbound: WhatsAppMessage = {
        id: "wmsg_in_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId: targetSellerId,
        businessPhone: targetBusinessPhone || "mock_business",
        customerPhone: payload.from,
        direction: "inbound",
        body: payload.body,
        timestamp: now,
        status: "received",
        deterministic: false,
      }

      let replyBody: string
      let toolCalls: unknown = null
      let isDeterministic = true
      try {
        const { aiService } = await import("./aiService")
        if (aiService.isEnabled(targetSellerId)) {
          const aiRes = await aiService.chat(targetSellerId, payload.from, payload.body)
          replyBody = aiRes.reply
          toolCalls = aiRes.toolCalls
          isDeterministic = false
          // store tool log for UI
          try {
            const key = `cognicart_ai_logs_${targetSellerId}_${payload.from}`
            const existing = JSON.parse(localStorage.getItem(key) || "[]")
            const outboundId = "wmsg_out_" + (Date.now() + 1).toString(36) + Math.random().toString(36).slice(2, 6)
            // we will create outbound after to have id, so store later
            localStorage.setItem(`${key}_pending`, JSON.stringify({ toolCalls, intent: aiRes.intent, orderId: aiRes.orderId }))
            // keep for later retrieval
            void existing
            void outboundId
          } catch {}
        } else {
          replyBody = deterministicReply(targetSellerId, payload.body)
        }
      } catch {
        replyBody = deterministicReply(targetSellerId, payload.body)
      }

      const outbound: WhatsAppMessage = {
        id: "wmsg_out_" + (Date.now() + 1).toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId: targetSellerId,
        businessPhone: targetBusinessPhone || "mock_business",
        customerPhone: payload.from,
        direction: "outbound",
        body: replyBody,
        timestamp: new Date(Date.now() + 800).toISOString(),
        status: "sent",
        deterministic: isDeterministic,
      }

      // persist toolCalls for this outbound if AI
      if (toolCalls) {
        try {
          const logKey = `cognicart_ai_tool_${outbound.id}`
          localStorage.setItem(logKey, JSON.stringify(toolCalls))
        } catch {}
      }

      const all = getMessages()
      all.push(inbound, outbound)
      saveMessages(all)
      return { inbound, outbound, toolCalls }
    }
  },

  async sendOutbound(payload: { to: string; body: string }): Promise<WhatsAppMessage> {
    try {
      const { data } = await api.post<WhatsAppMessage>("/whatsapp/send", payload)
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const sellerId = getSellerId()
      const cfg = getConfigs().find((c) => c.sellerId === sellerId)
      const msg: WhatsAppMessage = {
        id: "wmsg_out_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        sellerId,
        businessPhone: cfg?.businessPhone || "mock_business",
        customerPhone: payload.to,
        direction: "outbound",
        body: payload.body,
        timestamp: new Date().toISOString(),
        status: "sent",
        deterministic: false,
      }
      const all = getMessages()
      all.push(msg)
      saveMessages(all)
      return msg
    }
  },

  // Helper to get conversations grouped
  async getConversations(): Promise<{ customerPhone: string; lastMessage: WhatsAppMessage; count: number }[]> {
    let msgs = getMessages().filter((m) => m.sellerId === getSellerId())
    msgs = msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const map = new Map<string, WhatsAppMessage[]>()
    msgs.forEach((m) => {
      const arr = map.get(m.customerPhone) || []
      arr.push(m)
      map.set(m.customerPhone, arr)
    })
    return Array.from(map.entries()).map(([customerPhone, arr]) => ({
      customerPhone,
      lastMessage: arr[arr.length - 1],
      count: arr.length,
    })).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime())
  },

  clearAll() {
    const sellerId = getSellerId()
    const filtered = getMessages().filter((m) => m.sellerId !== sellerId)
    saveMessages(filtered)
  },
}
