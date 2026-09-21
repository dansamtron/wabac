import { useEffect, useState } from "react"
import { adminService } from "../../services/adminService"

export default function AdminPayments() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof adminService.listAllOrders>>>([])

  useEffect(() => { adminService.listAllOrders().then((data) => setOrders(data.filter((o) => o.paymentStatus === "Paid"))) }, [])

  const total = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-[#6b6b6b]">Paystack reconciliation. Each paid order has reference and platform fee split.</p>
      </div>
      <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
        <div className="text-sm font-bold">Paid orders: {orders.length} • Total ₦{total.toLocaleString()}</div>
        <div className="mt-3 space-y-2">
          {orders.slice(0, 20).map((o) => (
            <div key={o.id} className="flex flex-wrap gap-3 justify-between rounded-xl border border-[#F3E6D3] p-3 bg-[#FFFBF5]">
              <div>
                <div className="text-sm font-bold font-mono">#{o.id.slice(-6).toUpperCase()} • Ref PAY_{o.id.slice(-6).toUpperCase()}</div>
                <div className="text-xs text-[#6b6b6b]">Seller {o.sellerId.slice(-6)} • {o.customerName} • {new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm font-bold">₦{o.total.toLocaleString()} • {o.paymentStatus}</div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-sm text-[#6b6b6b] py-6 text-center">No paid orders yet. Phase 7 Paystack webhooks will populate.</div>}
        </div>
      </div>
    </div>
  )
}
