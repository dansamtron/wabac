import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, ShoppingCart, AlertTriangle, TrendingUp, Plus } from "lucide-react"
import { productService } from "../../services/productService"
import type { Product } from "../../types/product"

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    productService.seedDemo()
    productService.list().then(setProducts)
  }, [])

  const total = products.length
  const active = products.filter((p) => p.isActive).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  // Mock orders stats for Phase 2
  const stats = [
    { label: "Total products", value: total, icon: Package, color: "bg-[#0B9C74]" },
    { label: "Active", value: active, icon: TrendingUp, color: "bg-[#1a1a1a]" },
    { label: "Low stock", value: lowStock, icon: AlertTriangle, color: "bg-[#E85D26]" },
    { label: "Out of stock", value: outOfStock, icon: ShoppingCart, color: "bg-[#6b6b6b]" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#6b6b6b]">Overview of your WhatsApp store.</p>
        </div>
        <Link to="/dashboard/products/new" className="inline-flex items-center gap-2 rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-[#F3E6D3] p-4">
            <div className={`h-9 w-9 rounded-xl ${s.color} text-white grid place-items-center`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium text-[#6b6b6b]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#F3E6D3] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Recent products</h2>
            <Link to="/dashboard/products" className="text-sm font-bold text-[#0B9C74] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-[#F3E6D3] p-3">
                <img src={p.images[0] || "https://via.placeholder.com/80"} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-[#FFFBF5]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{p.name}</div>
                  <div className="text-xs text-[#6b6b6b]">₦{p.price.toLocaleString()} • Stock {p.stock} • {p.category}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${p.isActive ? "bg-[#E6F7F1] text-[#0B9C74]" : "bg-[#FFF1DA] text-[#6b6b6b]"}`}>{p.isActive ? "Active" : "Inactive"}</span>
              </div>
            ))}
            {products.length === 0 && <div className="text-sm text-[#6b6b6b] py-8 text-center">No products yet. Create your first product.</div>}
          </div>
        </div>

        <div className="rounded-2xl bg-[#1a1a1a] text-white p-6">
          <h3 className="font-bold">WhatsApp AI</h3>
          <p className="mt-2 text-sm text-white/70 leading-6">Connect your WhatsApp Business to let Cognicart AI sell for you. Customers will chat and buy inside WhatsApp.</p>
          <Link to="/dashboard/settings" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1a1a1a] hover:bg-[#FFF1DA]">
            Connect WhatsApp
          </Link>
          <div className="mt-6 rounded-xl bg-white/10 p-3 text-xs leading-5 text-white/70">
            <div className="font-bold text-white">Phase 2 and 3 done</div>
            Auth and product management are ready. Orders and WhatsApp integration are next.
          </div>
        </div>
      </div>
    </div>
  )
}
