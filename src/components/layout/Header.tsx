import { useState } from "react"
import { Search, ShoppingBag, Menu, X, MessageCircle, ChevronDown } from "lucide-react"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cart] = useState(2)

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-[#F3E6D3]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-xl bg-[#0B9C74] flex items-center justify-center text-white shadow-sm">
                <MessageCircle className="h-5 w-5 fill-white/20" />
              </span>
              <span className="font-display text-[22px] font-bold tracking-tight leading-none">Cognicart</span>
              <span className="hidden sm:block text-[11px] font-bold tracking-widest text-[#0B9C74] border border-[#0B9C74]/20 bg-[#E6F7F1] px-1.5 py-0.5 rounded">WHATSAPP AI</span>
            </a>
            <nav className="hidden lg:flex items-center gap-1 text-[14px] font-medium text-[#2b2b2b]">
              <a href="#features" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition">Features</a>
              <a href="#marketplace" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition flex items-center gap-1">
                Marketplace <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </a>
              <a href="#sellers" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition">Sellers</a>
              <a href="#pricing" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition">Pricing</a>
              <a href="#" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition">Contact</a>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button aria-label="Search" className="h-10 w-10 grid place-items-center rounded-full bg-white border border-[#F3E6D3] hover:bg-[#FFF1DA] transition">
              <Search className="h-4 w-4 text-[#6b6b6b]" />
            </button>
            <button aria-label="Cart" className="relative h-10 w-10 grid place-items-center rounded-full bg-white border border-[#F3E6D3] hover:bg-[#FFF1DA] transition">
              <ShoppingBag className="h-4 w-4 text-[#2b2b2b]" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#E85D26] text-white text-[11px] font-bold grid place-items-center">{cart}</span>
            </button>
            <a href="#start" className="ml-1 inline-flex items-center justify-center rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0a8a66] transition">
              Start Selling
            </a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-white border border-[#F3E6D3]">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-6 border-t border-[#F3E6D3] pt-4 bg-[#FFFBF5]">
            <nav className="grid gap-1 text-sm font-medium">
              <a href="#features" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl bg-white border border-[#F3E6D3]">Features</a>
              <a href="#marketplace" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl bg-white border border-[#F3E6D3]">Marketplace</a>
              <a href="#sellers" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl bg-white border border-[#F3E6D3]">Sellers</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl bg-white border border-[#F3E6D3]">Pricing</a>
              <a href="#start" className="mt-2 inline-flex justify-center rounded-full bg-[#0B9C74] px-6 py-3 font-bold text-white">Start Selling</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
