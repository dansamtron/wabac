import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Wallet, TrendingUp, PieChart, Calendar, Award, ArrowUpRight } from "lucide-react"
import { orderService } from "../../services/orderService"
import { productService } from "../../services/productService"
import { adminService } from "../../services/adminService"
import { paymentService } from "../../services/paymentService"
import type { Order } from "../../types/order"
import type { Transaction } from "../../types/payment"

export default function Revenue() {
  const [orders, setOrders] = useState<Order[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [fee, setFee] = useState({ percentage: 5, fixed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.seedDemo()
    orderService.seedDemo()
    setFee(adminService.getFeeConfig())
    orderService.list().then((data) => {
      setOrders(data)
      setTransactions(paymentService.list())
      setLoading(false)
    })
  }, [])

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid")
  const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const platformFeeFromOrders = Math.round(totalSales * (fee.percentage / 100) + paidOrders.length * fee.fixed)
  // Prefer transaction sums if available
  const platformFee = transactions.filter((t) => t.status === "success").reduce((sum, t) => sum + t.platformFee, platformFeeFromOrders && transactions.length === 0 ? 0 : 0) || platformFeeFromOrders
  const paystackFees = transactions.filter((t) => t.status === "success").reduce((sum, t) => sum + t.paystackFee, 0)
  const sellerEarnings = totalSales - platformFee - paystackFees
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length

  // Sales by day last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    const dayOrders = paidOrders.filter((o) => o.createdAt.slice(0, 10) === key)
    const sales = dayOrders.reduce((sum, o) => sum + o.total, 0)
    return { label: d.toLocaleDateString(undefined, { weekday: "short" }), sales, count: dayOrders.length }
  })
  const maxSales = Math.max(1, ...last7.map((d) => d.sales))

  // Top products
  const productSales = new Map<string, { name: string; qty: number; revenue: number }>()
  paidOrders.forEach((o) => {
    o.items.forEach((it) => {
      const cur = productSales.get(it.name) || { name: it.name, qty: 0, revenue: 0 }
      cur.qty += it.quantity
      cur.revenue += it.price * it.quantity
      productSales.set(it.name, cur)
    })
  })
  const topProducts = Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 4)

  if (loading) return <div className="grid place-items-center py-16"><div className="h-8 w-8 rounded-full border-2 border-[#0B9C74] border-t-transparent animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Sales and Revenue</h1>
        <p className="text-sm text-[#6b6b6b]">Paystack-verified revenue. Platform fee {fee.percentage}% + ₦{fee.fixed} per paid order. Paystack fee 1.5% capped ₦2000 is shown separately.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#0B9C74] text-white p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest opacity-80"><Wallet className="h-4 w-4" /> TOTAL SALES</div>
          <div className="mt-2 text-2xl font-bold">₦{totalSales.toLocaleString()}</div>
          <div className="text-xs opacity-80">{paidOrders.length} paid orders</div>
        </div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#9a9a9a]"><TrendingUp className="h-4 w-4" /> SELLER EARNINGS</div>
          <div className="mt-2 text-2xl font-bold">₦{Math.max(0, sellerEarnings).toLocaleString()}</div>
          <div className="text-xs text-[#6b6b6b]">After fees {fee.percentage}% + Paystack</div>
        </div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#9a9a9a]"><PieChart className="h-4 w-4" /> PLATFORM FEE</div>
          <div className="mt-2 text-2xl font-bold">₦{platformFee.toLocaleString()}</div>
          <div className="text-xs text-[#6b6b6b]">{fee.percentage}% • {paidOrders.length} orders</div>
        </div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#9a9a9a]"><Calendar className="h-4 w-4" /> ORDERS</div>
          <div className="mt-2 text-xl font-bold">{orders.length} total • {pendingOrders} pending</div>
          <div className="text-xs text-[#6b6b6b]">{deliveredOrders} delivered • Paystack ₦{paystackFees.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Sales last 7 days</h2>
            <span className="text-xs font-bold text-[#6b6b6b]">Paid orders only</span>
          </div>
          <div className="mt-6 flex items-end gap-2 h-36">
            {last7.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center" style={{ height: "96px" }}>
                  <div
                    className="w-full max-w-12 rounded-t-xl bg-[#0B9C74] hover:bg-[#0a8a66] transition"
                    style={{ height: `${Math.max(8, (d.sales / maxSales) * 96)}px`, alignSelf: "flex-end" }}
                    title={`₦${d.sales.toLocaleString()} • ${d.count} orders`}
                  />
                </div>
                <span className="text-xs font-bold">{d.label}</span>
                <span className="text-[11px] text-[#6b6b6b]">₦{d.sales > 0 ? d.sales.toLocaleString() : "0"}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3 text-xs leading-5 text-[#6b6b6b]">
            Chart uses paid order totals scoped by sellerId. Transactions are verified via Paystack and split by fee config.
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
            <h3 className="font-bold flex items-center gap-2"><Award className="h-4 w-4 text-[#E85D26]" /> Top products</h3>
            <div className="mt-4 space-y-3">
              {topProducts.length === 0 ? (
                <div className="text-xs text-[#6b6b6b]">No sales yet. Create a test order and pay via Paystack.</div>
              ) : (
                topProducts.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-bold leading-tight">{p.name}</div>
                      <div className="text-xs text-[#6b6b6b]">{p.qty} sold</div>
                    </div>
                    <div className="font-bold">₦{p.revenue.toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
            <Link to="/dashboard/products" className="mt-3 inline-flex text-xs font-bold text-[#0B9C74] hover:underline">Manage catalog →</Link>
          </div>

          <div className="rounded-2xl bg-[#1a1a1a] text-white p-6">
            <h3 className="font-bold">Payouts</h3>
            <p className="text-xs leading-5 text-white/70 mt-1">Payouts are triggered after Paystack confirmation. Platform fee {fee.percentage}% stays with platform, remainder settled to your bank shown in Settings.</p>
            <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
              <div className="flex justify-between"><span className="text-white/70">Next payout</span><span className="font-bold">₦{Math.max(0, sellerEarnings).toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-white/70">To bank on file</span><span className="text-white/70">{pendingOrders} pending orders excluded</span></div>
            </div>
            <Link to="/dashboard/orders" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1a1a1a] hover:bg-[#FFF1DA]">
              View orders <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent transactions</h2>
          <span className="text-xs font-bold text-[#6b6b6b]">{transactions.length} total</span>
        </div>
        <div className="mt-4 grid gap-2">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex flex-wrap gap-2 justify-between rounded-xl border border-[#F3E6D3] p-3 text-xs">
              <div>
                <div className="font-bold font-mono">{t.reference} • Order #{t.orderId.slice(-6).toUpperCase()}</div>
                <div className="text-[#6b6b6b]">{new Date(t.createdAt).toLocaleString()} • {t.status} • {t.email}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">₦{t.amount.toLocaleString()} • Fee ₦{t.platformFee.toLocaleString()} • Seller ₦{t.sellerAmount.toLocaleString()}</div>
                <div className="text-[#6b6b6b]">Paystack ₦{t.paystackFee.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <div className="text-sm text-[#6b6b6b] py-4 text-center">No transactions yet. Pay for an order in Cart or Checkout.</div>}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent paid orders</h2>
          <Link to="/dashboard/orders" className="text-sm font-bold text-[#0B9C74] hover:underline">View all</Link>
        </div>
        <div className="mt-4 grid gap-2">
          {paidOrders.slice(0, 5).map((o) => (
            <Link key={o.id} to={`/dashboard/orders/${o.id}`} className="flex items-center justify-between rounded-xl border border-[#F3E6D3] p-3 hover:bg-[#FFFBF5]">
              <div>
                <div className="text-sm font-bold">#{o.id.slice(-6).toUpperCase()} • {o.customerName}</div>
                <div className="text-xs text-[#6b6b6b]">{new Date(o.createdAt).toLocaleDateString()} • {o.items.length} items {o.paymentReference ? `• ${o.paymentReference}` : ""}</div>
              </div>
              <div className="text-sm font-bold">₦{o.total.toLocaleString()}</div>
            </Link>
          ))}
          {paidOrders.length === 0 && <div className="text-sm text-[#6b6b6b] py-4 text-center">No paid orders yet.</div>}
        </div>
      </div>
    </div>
  )
}
