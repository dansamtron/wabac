import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { productService } from "../services/productService"
import { orderService } from "../services/orderService"
import type { Product } from "../types/product"

export default function Cart() {
  const [items, setItems] = useState<Product[]>([])
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" })
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const load = async () => {
    productService.seedDemo()
    const raw = localStorage.getItem("cognicart_cart")
    const ids: string[] = raw ? JSON.parse(raw) : []
    const prods: Product[] = []
    for (const id of ids) {
      try {
        const p = await productService.getById(id)
        prods.push(p)
      } catch { /* ignore */ }
    }
    setItems(prods)
  }

  useEffect(() => { load() }, [])

  const clear = () => {
    localStorage.removeItem("cognicart_cart")
    setItems([])
  }

  const remove = (id: string) => {
    const next = items.filter((p) => p.id !== id)
    localStorage.setItem("cognicart_cart", JSON.stringify(next.map((p) => p.id)))
    setItems(next)
  }

  const total = items.reduce((sum, p) => sum + p.price, 0)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!customer.name || !customer.phone || !customer.address) {
      setError("Name, phone and delivery address are required")
      return
    }
    if (items.length === 0) return
    setPlacing(true)
    try {
      const order = await orderService.create({
        customer: { name: customer.name, phone: customer.phone, address: customer.address },
        items: items.map((p) => ({ productId: p.id, quantity: 1 })),
        deliveryAddress: customer.address,
      })
      localStorage.removeItem("cognicart_cart")
      setSuccess(order.id)
      setItems([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order")
    } finally {
      setPlacing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] bg-[#FFFBF5] grid place-items-center px-4 py-10">
        <div className="max-w-md text-center rounded-[22px] bg-white border border-[#F3E6D3] p-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#E6F7F1] border border-[#0B9C74]/20 grid place-items-center text-[#0B9C74]">✓</div>
          <h1 className="font-display text-2xl font-bold mt-3">Order placed</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Order <span className="font-mono font-bold">#{success.slice(-6).toUpperCase()}</span> is Pending. The seller will see it in Orders and can update status.</p>
          <div className="mt-4 rounded-2xl bg-[#FFF1DA] border border-[#F3E6D3] p-3 text-xs leading-5">Price and stock were checked against the seller's database. WhatsApp AI would have used the same `createOrder` tool.</div>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/store")} className="rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66]">Continue shopping</button>
            <Link to="/dashboard/orders" className="rounded-full bg-white border border-[#F3E6D3] px-6 py-3 text-sm font-bold hover:bg-[#FFF1DA]">View in dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FFFBF5] grid place-items-center px-4 py-10">
        <div className="text-center max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#FFF1DA] border border-[#F3E6D3] grid place-items-center"><ShoppingBag className="h-6 w-6 text-[#E85D26]" /></div>
          <h1 className="font-display text-2xl font-bold mt-3">Cart is empty</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Add from the storefront or chat on WhatsApp. Prices are verified from the same database.</p>
          <Link to="/store" className="mt-4 inline-flex rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66]">Browse store</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-[34px] font-bold tracking-tight">Cart</h1>
        <p className="text-sm text-[#6b6b6b]">{items.length} items • Phase 4 test checkout creates a real order for the seller</p>
        {error && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>}

        <div className="mt-6 grid lg:grid-cols-[1.7fr_0.9fr] gap-6">
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id + Math.random()} className="rounded-2xl bg-white border border-[#F3E6D3] p-4 flex gap-4 items-center">
                <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded-xl object-cover bg-[#FFFBF5] border border-[#F3E6D3]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold leading-tight truncate">{p.name}</div>
                  <div className="text-xs text-[#6b6b6b]">{p.category} • Stock {p.stock}</div>
                  <div className="text-sm font-bold">₦{p.price.toLocaleString()}</div>
                </div>
                <button onClick={() => remove(p.id)} className="h-9 w-9 grid place-items-center rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={clear} className="text-xs font-bold text-[#6b6b6b] hover:text-[#1a1a1a] underline">Clear cart</button>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] bg-white border border-[#F3E6D3] p-6 h-fit">
              <div className="text-sm font-bold">Order summary</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6b6b6b]">Subtotal</span><span className="font-bold">₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#6b6b6b]">Delivery</span><span className="text-xs">{total > 20000 ? "Free" : "₦1,500"}</span></div>
                <div className="pt-2 border-t border-[#F3E6D3] flex justify-between text-base font-bold"><span>Total</span><span>₦{(total + (total > 20000 ? 0 : 1500)).toLocaleString()}</span></div>
              </div>

              <form onSubmit={handlePlaceOrder} className="mt-5 space-y-3">
                <div className="text-xs font-bold">Customer (for test order)</div>
                <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
                <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="Phone e.g. +2348010000001" className="w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
                <input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Delivery address" className="w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
                <button type="submit" disabled={placing} className="w-full flex justify-center items-center gap-2 rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-60">
                  {placing ? "Placing..." : "Place test order"} <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-[#9a9a9a] leading-5">Creates an order via `orderService.create` with price preserved at order time and stock checked. Seller sees it in Dashboard → Orders.</p>
              </form>

              <div className="mt-4 pt-4 border-t border-[#F3E6D3] flex flex-col gap-2">
                <Link to="/checkout" className="w-full flex justify-center items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-bold text-white hover:bg-black">Checkout on WhatsApp</Link>
                <Link to="/store" className="text-center text-xs font-bold text-[#0B9C74] hover:underline">Continue shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
