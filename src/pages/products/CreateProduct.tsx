import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { productService } from "../../services/productService"
import { PRODUCT_CATEGORIES } from "../../types/product"
import { Upload, X, ArrowLeft } from "lucide-react"

export default function CreateProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Beauty",
    isActive: true,
  })
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      if (images.length >= 4) return
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") setImages((prev) => [...prev, reader.result as string].slice(0, 4))
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name || !form.price || !form.stock) {
      setError("Name, price and stock are required")
      return
    }
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (Number.isNaN(price) || price <= 0) {
      setError("Price must be greater than 0")
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be 0 or more")
      return
    }
    if (images.length === 0) {
      setError("Add at least one image")
      return
    }
    setLoading(true)
    try {
      await productService.create({
        name: form.name,
        description: form.description,
        price,
        stock,
        category: form.category,
        images,
        isActive: form.isActive,
        currency: "NGN",
      })
      navigate("/dashboard/products")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/dashboard/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a]">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Add product</h1>
        <p className="text-sm text-[#6b6b6b]">This is the source of truth for WhatsApp AI. Price and stock must be accurate.</p>
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-[#F3E6D3] p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="sm:col-span-2">
            <span className="text-xs font-bold">Product name *</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Elixir Glow Serum" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] focus:ring-2 focus:ring-[#0B9C74]/15 outline-none" />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs font-bold">Description</span>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Vitamin C serum for bright skin..." className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] focus:ring-2 focus:ring-[#0B9C74]/15 outline-none resize-none" />
          </label>
          <label>
            <span className="text-xs font-bold">Price (NGN) *</span>
            <input type="number" min={1} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="8500" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] focus:ring-2 focus:ring-[#0B9C74]/15 outline-none" />
          </label>
          <label>
            <span className="text-xs font-bold">Stock *</span>
            <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="12" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] focus:ring-2 focus:ring-[#0B9C74]/15 outline-none" />
          </label>
          <label>
            <span className="text-xs font-bold">Category</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border border-[#F3E6D3] bg-white px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none">
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 pt-6">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-[#F3E6D3] text-[#0B9C74] focus:ring-[#0B9C74]" />
            <span className="text-sm font-medium">Active (visible on WhatsApp)</span>
          </label>
        </div>

        <div>
          <span className="text-xs font-bold">Images * (1 to 4, Cloudinary in production)</span>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((src, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-[#F3E6D3] bg-[#FFFBF5] h-28">
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white border border-[#F3E6D3] grid place-items-center">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="h-28 rounded-xl border-2 border-dashed border-[#F3E6D3] bg-[#FFFBF5] grid place-items-center cursor-pointer hover:bg-[#FFF1DA] text-sm font-medium text-[#6b6b6b]">
                <span className="flex flex-col items-center gap-1">
                  <Upload className="h-5 w-5" /> Upload
                </span>
                <input type="file" accept="image/*" multiple onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-[#9a9a9a]">Images are stored locally now. In production they upload to Cloudinary and we save the URL and public ID.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-60">
            {loading ? "Creating..." : "Create product"}
          </button>
          <Link to="/dashboard/products" className="rounded-full border border-[#F3E6D3] bg-white px-6 py-2.5 text-sm font-bold hover:bg-[#FFF1DA]">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
