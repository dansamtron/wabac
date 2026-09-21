import { useEffect, useState } from "react"
import { adminService } from "../../services/adminService"

export default function AdminRevenue() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminService.getRevenueBreakdown>> | null>(null)

  useEffect(() => { adminService.getRevenueBreakdown().then(setData) }, [])

  if (!data) return <div className="grid place-items-center py-16"><div className="h-8 w-8 rounded-full border-2 border-[#0B9C74] border-t-transparent animate-spin" /></div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Tracks platform revenue</h1>
        <p className="text-sm text-[#6b6b6b]">Transaction fee {data.fee.percentage}% + fixed ₦{data.fee.fixed} per paid order + Paystack 1.5% capped ₦2000. Every order shows seller earnings vs platform fee.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#1a1a1a] text-white p-5"><div className="text-xs tracking-widest opacity-60">TOTAL SALES</div><div className="text-2xl font-bold">₦{data.totalSales.toLocaleString()}</div></div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5"><div className="text-xs tracking-widest text-[#9a9a9a]">PLATFORM REVENUE</div><div className="text-2xl font-bold">₦{data.platformRevenue.toLocaleString()}</div></div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5"><div className="text-xs tracking-widest text-[#9a9a9a]">PAYSTACK FEE</div><div className="text-2xl font-bold">₦{data.paystackFees.toLocaleString()}</div></div>
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-5"><div className="text-xs tracking-widest text-[#9a9a9a]">SELLER EARNINGS</div><div className="text-2xl font-bold">₦{data.sellerEarnings.toLocaleString()}</div></div>
      </div>
      <div className="rounded-2xl bg-white border border-[#F3E6D3] p-4">
        <div className="text-sm font-bold">Recent paid orders breakdown</div>
        <div className="mt-3 space-y-2">
          {data.breakdown.slice(0, 15).map((b) => (
            <div key={b.orderId} className="flex flex-wrap gap-3 justify-between rounded-xl border border-[#F3E6D3] p-3">
              <div>
                <div className="text-sm font-bold font-mono">#{b.orderId.slice(-6).toUpperCase()} • Seller {b.sellerId.slice(-6)} • {b.reference}</div>
                <div className="text-xs text-[#6b6b6b]">{b.customerName} • {new Date(b.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-right text-sm">
                <div>Total ₦{b.total.toLocaleString()} • Platform ₦{b.fee.toLocaleString()} • Paystack ₦{b.paystackFee.toLocaleString()} • Seller ₦{b.sellerEarning.toLocaleString()}</div>
              </div>
            </div>
          ))}
          {data.breakdown.length === 0 && <div className="text-sm text-[#6b6b6b] py-6 text-center">No paid orders yet</div>}
        </div>
      </div>
    </div>
  )
}
