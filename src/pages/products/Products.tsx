import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search, Plus, Pencil, Trash2, Power, Package } from "lucide-react"
import { productService } from "../../services/productService"
import { PRODUCT_CATEGORIES } from "../../types/product"
import type { Product } from "../../types/product"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await productService.list({ search: search || undefined, category: category || undefined })
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    productService.seedDemo()
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return
    await productService.remove(id)
    load()
  }

  const handleToggle = async (p: Product) => {
    await productService.toggleActive(p.id, !p.isActive)
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-[#6b6b6b]">Manage your catalog. Stock and price are the source of truth for WhatsApp AI.</p>
        </div>
        <Link to="/dashboard/products/new" className="inline-flex items-center gap-2 rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-[#F3E6D3] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9a9a]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or description" className="w-full rounded-xl border border-[#F3E6D3] bg-white pl-9 pr-3 py-2.5 text-sm focus:border-[#0B9C74] focus:ring-2 focus:ring-[#0B9C74]/15 outline-none" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-[#F3E6D3] bg-white px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none">
            <option value="">All categories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-[#0B9C74] border-t-transparent animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#F3E6D3] p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#FFF1DA] grid place-items-center">
            <Package className="h-6 w-6 text-[#E85D26]" />
          </div>
          <div className="mt-3 font-bold">No products found</div>
          <div className="text-sm text-[#6b6b6b]">Try a different search or create a new product.</div>
          <Link to="/dashboard/products/new" className="mt-4 inline-flex rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-bold text-white hover:bg-black">
            Add product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="hidden lg:grid grid-cols-[64px_1fr_120px_100px_120px_140px] gap-3 px-4 text-xs font-bold tracking-widest text-[#9a9a9a]">
            <span>IMAGE</span>
            <span>PRODUCT</span>
            <span>PRICE</span>
            <span>STOCK</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {products.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white border border-[#F3E6D3] p-4 lg:py-3 lg:grid lg:grid-cols-[64px_1fr_120px_100px_120px_140px] lg:items-center gap-4">
              <img src={p.images[0] || "https://via.placeholder.com/80"} alt={p.name} className="hidden lg:block h-12 w-12 rounded-xl object-cover bg-[#FFFBF5] border border-[#F3E6D3]" />
              <div className="flex gap-3 lg:contents">
                <img src={p.images[0] || "https://via.placeholder.com/80"} alt={p.name} className="lg:hidden h-14 w-14 rounded-xl object-cover bg-[#FFFBF5] border border-[#F3E6D3]" />
                <div className="min-w-0">
                  <div className="text-sm font-bold leading-tight truncate">{p.name}</div>
                  <div className="text-xs text-[#6b6b6b] truncate">{p.category} • {p.description.slice(0, 60)}</div>
                  <div className="lg:hidden mt-2 flex items-center gap-2 text-xs">
                    <span className="font-bold">₦{p.price.toLocaleString()}</span>
                    <span className={`rounded-full px-2 py-0.5 font-bold ${p.stock === 0 ? "bg-red-50 text-red-700 border border-red-200" : p.stock <= 5 ? "bg-[#FFF1DA] text-[#E85D26] border border-[#F3E6D3]" : "bg-[#E6F7F1] text-[#0B9C74] border border-[#0B9C74]/20"}`}>
                      Stock {p.stock}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 font-bold ${p.isActive ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#F3E6D3]"}`}>{p.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block text-sm font-bold">₦{p.price.toLocaleString()}</div>
              <div className="hidden lg:block">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${p.stock === 0 ? "bg-red-50 text-red-700 border-red-200" : p.stock <= 5 ? "bg-[#FFF1DA] text-[#E85D26] border-[#F3E6D3]" : "bg-[#E6F7F1] text-[#0B9C74] border-[#0B9C74]/20"}`}>
                  {p.stock === 0 ? "Out of stock" : `Stock ${p.stock}`}
                </span>
              </div>
              <div className="hidden lg:block">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.isActive ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#F3E6D3] text-[#6b6b6b]"}`}>{p.isActive ? "Active" : "Inactive"}</span>
              </div>

              <div className="mt-3 lg:mt-0 flex items-center justify-end gap-1.5">
                <button onClick={() => handleToggle(p)} title={p.isActive ? "Deactivate" : "Activate"} className="h-8 w-8 grid place-items-center rounded-full border border-[#F3E6D3] bg-white hover:bg-[#FFF1DA]">
                  <Power className={`h-4 w-4 ${p.isActive ? "text-[#0B9C74]" : "text-[#9a9a9a]"}`} />
                </button>
                <Link to={`/dashboard/products/${p.id}/edit`} className="h-8 w-8 grid place-items-center rounded-full bg-white border border-[#F3E6D3] hover:bg-[#FFF1DA]">
                  <Pencil className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(p.id)} className="h-8 w-8 grid place-items-center rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
