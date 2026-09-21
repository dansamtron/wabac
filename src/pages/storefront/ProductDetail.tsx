import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ShoppingBag, Heart, Check, Truck, Shield } from "lucide-react"
import { productService } from "../../services/productService"
import type { Product } from "../../types/product"

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    productService.seedDemo()
    productService.getById(id).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (!product) return
    const raw = localStorage.getItem("cognicart_cart")
    const cart: string[] = raw ? JSON.parse(raw) : []
    cart.push(product.id)
    localStorage.setItem("cognicart_cart", JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="min-h-[50vh] grid place-items-center"><div className="h-8 w-8 rounded-full border-2 border-[#0B9C74] border-t-transparent animate-spin" /></div>
  if (!product) return <div className="min-h-[50vh] grid place-items-center px-4"><div className="text-center"><div className="font-bold">Product not found</div><Link to="/store" className="mt-3 inline-flex rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white">Back to store</Link></div></div>

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/store" className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a]"><ArrowLeft className="h-4 w-4" /> Back to store</Link>
        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="rounded-[22px] bg-white border border-[#F3E6D3] p-4">
            <div className="aspect-square rounded-2xl bg-[#FFFBF5] border border-[#F3E6D3] p-6 flex items-center justify-center"><img src={product.images[0]} alt={product.name} className="h-full w-full object-contain mix-blend-multiply" /></div>
            {product.images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{product.images.slice(1, 4).map((src, i) => <img key={i} src={src} alt="" className="h-20 w-full rounded-xl object-cover border border-[#F3E6D3] bg-white" />)}</div>}
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F1] border border-[#0B9C74]/15 px-3 py-1 text-xs font-bold text-[#0B9C74]">{product.category} {product.isActive ? "• Active" : "• Inactive"}</div>
            <h1 className="font-display text-[30px] font-bold leading-tight mt-3">{product.name}</h1>
            <p className="mt-2 text-sm leading-6 text-[#5a5a5a]">{product.description}</p>
            <div className="mt-4 flex items-baseline gap-3"><span className="text-2xl font-bold">₦{product.price.toLocaleString()}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${product.stock === 0 ? "bg-red-50 text-red-700 border-red-200" : product.stock <= 5 ? "bg-[#FFF1DA] text-[#E85D26] border-[#F3E6D3]" : "bg-[#E6F7F1] text-[#0B9C74] border-[#0B9C74]/20"}`}>{product.stock === 0 ? "Out of stock" : `In stock: ${product.stock}`}</span></div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={handleAdd} disabled={product.stock === 0} className="inline-flex items-center gap-2 rounded-full bg-[#0B9C74] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-50">
                <ShoppingBag className="h-4 w-4" /> {added ? "Added" : product.stock === 0 ? "Out of stock" : "Add to cart"}
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-6 py-3.5 text-sm font-bold hover:bg-[#FFF1DA]"><Heart className="h-4 w-4" /> Wishlist</button>
            </div>
            {added && <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-white"><Check className="h-4 w-4" /> Added to cart • <Link to="/cart" className="underline">View cart</Link></div>}

            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-4 flex gap-3"><Truck className="h-5 w-5 text-[#0B9C74]" /><div><div className="font-bold">Delivery</div><div className="text-[#6b6b6b] text-xs leading-5">Lagos 1-2 days. Rest of Nigeria 2-4 days. Fee is confirmed in WhatsApp checkout.</div></div></div>
              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-4 flex gap-3"><Shield className="h-5 w-5 text-[#0B9C74]" /><div><div className="font-bold">WhatsApp verified</div><div className="text-[#6b6b6b] text-xs leading-5">Same price and stock AI will confirm inside WhatsApp.</div></div></div>
            </div>

            <div className="mt-6 rounded-2xl bg-white border border-[#F3E6D3] p-4">
              <div className="text-sm font-bold">Prefer WhatsApp?</div>
              <p className="text-xs text-[#6b6b6b] leading-5">Send the seller a message: \"Hi, is {product.name} still ₦{product.price.toLocaleString()}?\" AI replies in 3 seconds.</p>
              <Link to="/contact" className="mt-3 inline-flex rounded-full bg-[#FFF1DA] border border-[#F3E6D3] px-4 py-2 text-xs font-bold hover:bg-white">Ask on WhatsApp</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
