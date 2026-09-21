import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { productService } from "../services/productService"
import type { Product } from "../types/product"

export default function Cart() {
  const [items, setItems] = useState<Product[]>([])

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
        <p className="text-sm text-[#6b6b6b]">{items.length} items • Same checkout AI will confirm on WhatsApp</p>

        <div className="mt-6 grid lg:grid-cols-[1.7fr_0.9fr] gap-6">
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id + Math.random()} className="rounded-2xl bg-white border border-[#F3E6D3] p-4 flex gap-4 items-center">
                <img src={p.images[0]} alt={p.name} className="h-16 w-16 rounded-xl object-cover bg-[#FFFBF5] border border-[#F3E6D3]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold leading-tight truncate">{p.name}</div>
                  <div className="text-xs text-[#6b6b6b]">{p.category}</div>
                  <div className="text-sm font-bold">₦{p.price.toLocaleString()}</div>
                </div>
                <button onClick={() => remove(p.id)} className="h-9 w-9 grid place-items-center rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={clear} className="text-xs font-bold text-[#6b6b6b] hover:text-[#1a1a1a] underline">Clear cart</button>
          </div>

          <div className="rounded-[22px] bg-white border border-[#F3E6D3] p-6 h-fit">
            <div className="text-sm font-bold">Order summary</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#6b6b6b]">Subtotal</span><span className="font-bold">₦{total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#6b6b6b]">Delivery</span><span className="text-xs">Confirmed on WhatsApp</span></div>
              <div className="pt-2 border-t border-[#F3E6D3] flex justify-between text-base font-bold"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
            </div>
            <Link to="/checkout" className="mt-5 flex justify-center items-center gap-2 rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66]">Checkout on WhatsApp <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-2 text-xs text-[#9a9a9a] leading-5">Checkout continues in WhatsApp where AI re-confirms stock, price and delivery before creating the order.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
