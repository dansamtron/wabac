import api from "./api"
import type { Transaction, InitializePaymentPayload } from "../types/payment"
import { adminService } from "./adminService"

const TRANSACTION_KEY = "cognicart_transactions"

function getSellerId(): string {
  try {
    const raw = localStorage.getItem("cognicart_seller")
    if (raw) return (JSON.parse(raw).id as string) || "mock_seller"
  } catch {}
  return "mock_seller"
}

function getTransactions(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem(TRANSACTION_KEY) || "[]")
  } catch {
    return []
  }
}

function saveTransactions(list: Transaction[]) {
  localStorage.setItem(TRANSACTION_KEY, JSON.stringify(list))
}

function isMockMode(error: unknown) {
  return !error || (error as { response?: unknown })?.response === undefined
}

function genReference() {
  return "PSK_" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
}

function paystackFee(amount: number) {
  // Paystack NG fee 1.5% capped 2000 plus 100 for >2500? Mock 1.5% cap 2000
  const fee = Math.round(amount * 0.015)
  return Math.min(fee, 2000)
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: {
        key: string
        email: string
        amount: number
        currency?: string
        ref: string
        callback: (res: { reference: string }) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve()
    const s = document.createElement("script")
    s.src = "https://js.paystack.co/v1/inline.js"
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error("Failed to load Paystack"))
    document.head.appendChild(s)
  })
}

export const paymentService = {
  getPublicKey(): string | null {
    // Vite env
    const key = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_PAYSTACK_PUBLIC_KEY as string | undefined
    return key || null
  },

  list(): Transaction[] {
    // sync mock list filtered by sellerId
    const sellerId = getSellerId()
    return getTransactions().filter((t) => t.sellerId === sellerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  listAll(): Transaction[] {
    return getTransactions().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async initialize(payload: InitializePaymentPayload): Promise<{ reference: string; authorization_url?: string; transaction: Transaction }> {
    const sellerId = payload.sellerId || getSellerId()
    try {
      const { data } = await api.post<{ reference: string; authorization_url?: string }>("/payments/initialize", payload)
      // create local mirror transaction for tracking
      const feeCfg = adminService.getFeeConfig()
      const platformFee = Math.round(payload.amount * (feeCfg.percentage / 100) + feeCfg.fixed)
      const pFee = paystackFee(payload.amount)
      const t: Transaction = {
        id: "txn_" + Date.now().toString(36),
        sellerId,
        orderId: payload.orderId,
        amount: payload.amount,
        subtotal: payload.subtotal ?? payload.amount,
        deliveryFee: payload.deliveryFee ?? 0,
        platformFee,
        sellerAmount: payload.amount - platformFee - pFee,
        paystackFee: pFee,
        currency: "NGN",
        reference: data.reference,
        email: payload.email,
        status: "pending",
        createdAt: new Date().toISOString(),
        channel: "paystack",
      }
      const all = getTransactions()
      all.push(t)
      saveTransactions(all)
      return { reference: data.reference, authorization_url: data.authorization_url, transaction: t }
    } catch (error) {
      if (!isMockMode(error)) throw error
      const feeCfg = adminService.getFeeConfig()
      const platformFee = Math.round(payload.amount * (feeCfg.percentage / 100) + feeCfg.fixed)
      const pFee = paystackFee(payload.amount)
      const reference = genReference()
      const t: Transaction = {
        id: "txn_" + Date.now().toString(36),
        sellerId,
        orderId: payload.orderId,
        amount: payload.amount,
        subtotal: payload.subtotal ?? payload.amount,
        deliveryFee: payload.deliveryFee ?? 0,
        platformFee,
        sellerAmount: payload.amount - platformFee - pFee,
        paystackFee: pFee,
        currency: "NGN",
        reference,
        email: payload.email,
        status: "pending",
        createdAt: new Date().toISOString(),
        channel: "paystack",
      }
      const all = getTransactions()
      all.push(t)
      saveTransactions(all)
      return { reference, transaction: t }
    }
  },

  async payWithPaystack(payload: InitializePaymentPayload & { onSuccess?: (ref: string) => void; onClose?: () => void }): Promise<string> {
    const { reference } = await this.initialize(payload)
    const publicKey = this.getPublicKey()

    // If backend provided authorization_url, open it
    // Else try PaystackPop if key available, else mock success

    if (publicKey) {
      try {
        await loadPaystackScript()
        if (window.PaystackPop) {
          return await new Promise<string>((resolve, reject) => {
            const handler = window.PaystackPop!.setup({
              key: publicKey,
              email: payload.email,
              amount: payload.amount * 100,
              currency: "NGN",
              ref: reference,
              callback: (res) => {
                this.verify(res.reference).then(() => {
                  payload.onSuccess?.(res.reference)
                  resolve(res.reference)
                }).catch(reject)
              },
              onClose: () => {
                const all = getTransactions()
                const idx = all.findIndex((t) => t.reference === reference)
                if (idx !== -1) {
                  all[idx].status = "abandoned"
                  saveTransactions(all)
                }
                payload.onClose?.()
                reject(new Error("Payment closed"))
              },
            })
            handler.openIframe()
          })
        }
      } catch {
        // fallback to mock verify after delay
      }
    }

    // Mock flow: simulate user paying after 1.2s
    return await new Promise<string>((resolve) => {
      setTimeout(async () => {
        await this.verify(reference)
        payload.onSuccess?.(reference)
        resolve(reference)
      }, 1200)
    })
  },

  async verify(reference: string): Promise<Transaction> {
    try {
      const { data } = await api.post<Transaction>(`/payments/verify/${reference}`)
      // mirror update locally
      const all = getTransactions()
      const idx = all.findIndex((t) => t.reference === reference)
      if (idx !== -1) {
        all[idx] = { ...all[idx], status: data.status || "success", verifiedAt: new Date().toISOString() }
        saveTransactions(all)
        // update order payment status
        const { orderService } = await import("./orderService")
        try {
          await orderService.updatePaymentStatus(all[idx].orderId, "Paid")
          // also set paymentReference on order
          const ordersRaw = localStorage.getItem("cognicart_orders")
          if (ordersRaw) {
            const orders = JSON.parse(ordersRaw)
            const oIdx = orders.findIndex((o: { id: string }) => o.id === all[idx].orderId)
            if (oIdx !== -1) {
              orders[oIdx].paymentReference = reference
              orders[oIdx].paymentStatus = "Paid"
              orders[oIdx].updatedAt = new Date().toISOString()
              localStorage.setItem("cognicart_orders", JSON.stringify(orders))
            }
          }
        } catch {}
      }
      return data
    } catch (error) {
      if (!isMockMode(error)) throw error
      const all = getTransactions()
      const idx = all.findIndex((t) => t.reference === reference)
      if (idx === -1) throw new Error("Transaction not found")
      all[idx].status = "success"
      all[idx].verifiedAt = new Date().toISOString()
      saveTransactions(all)
      // update order
      const { orderService } = await import("./orderService")
      try {
        await orderService.updatePaymentStatus(all[idx].orderId, "Paid")
      } catch {}
      // also directly patch order reference if sellerId mismatch fallback?
      try {
        const ordersRaw = localStorage.getItem("cognicart_orders")
        if (ordersRaw) {
          const orders = JSON.parse(ordersRaw) as Array<Record<string, unknown>>
          const oIdx = orders.findIndex((o) => o.id === all[idx].orderId)
          if (oIdx !== -1) {
            (orders[oIdx] as Record<string, unknown>).paymentReference = reference
            ;(orders[oIdx] as Record<string, unknown>).paymentStatus = "Paid"
            ;(orders[oIdx] as Record<string, unknown>).updatedAt = new Date().toISOString()
            localStorage.setItem("cognicart_orders", JSON.stringify(orders))
          }
        }
      } catch {}
      return all[idx]
    }
  },

  getByReference(reference: string): Transaction | null {
    return getTransactions().find((t) => t.reference === reference) || null
  },

  getByOrderId(orderId: string): Transaction | null {
    return getTransactions().find((t) => t.orderId === orderId) || null
  },
}
