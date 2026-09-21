import { useState } from "react"
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Star,
  ArrowRight,
  Heart,
  MessageCircle,
  Store,
  Users,
  TrendingUp,
  Sparkles,
  Check,
  Play,
  Share2,
  Mail,
  Globe,
} from "lucide-react"

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cart] = useState(2)

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1a1a1a] selection:bg-[#0B9C74]/20">
      {/* Header */}
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
                <a href="#marketplace" className="px-3 py-2 rounded-full hover:bg-[#FFF1DA] transition flex items-center gap-1">Marketplace <span className="h-5 w-5 grid place-items-center rounded-full bg-[#FFE7C2] text-[10px]">⌄</span></a>
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[#FFFBF5]" />
        <div className="absolute -z-10 top-0 left-0 w-[78%] lg:w-[62%] h-[86%] bg-[#FDEDD3] rounded-br-[90px] lg:rounded-br-[140px]" />
        <div className="absolute -z-10 top-0 right-0 w-[45%] h-[62%] bg-[#F6C68B]/70 hidden lg:block" style={{ clipPath: "ellipse(80% 90% at 80% 0%)" }} />
        <div className="absolute -z-10 bottom-0 right-0 w-[58%] lg:w-[46%] h-[220px] lg:h-[300px] bg-[#E85D26] rounded-tl-[80px] lg:rounded-tl-[120px]" />
        <div className="absolute -z-10 left-[18%] top-[52%] h-3 w-20 hidden lg:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#0B9C74]" />
          <span className="h-2 w-2 rounded-full bg-white/80" />
          <span className="h-2 w-2 rounded-full bg-white/50" />
        </div>
        <div className="pointer-events-none absolute -z-10 left-[52%] top-[18%] hidden lg:block text-2xl">🪴</div>
        <div className="pointer-events-none absolute -z-10 right-[14%] top-[38%] hidden lg:block text-lg">🍋</div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-center py-8 lg:py-14">
            <div className="pt-2 lg:pt-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-3 py-1 text-xs font-medium shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#0B9C74] animate-pulse" /> Trusted by 5,000+ sellers on WhatsApp
              </div>
              <h1 className="font-display font-bold tracking-tight leading-[0.9] text-[38px] sm:text-[54px] lg:text-[62px] mt-5">
                WhatsApp
                <br />
                <span className="relative inline-block">
                  Commerce,
                  <span className="absolute -right-6 -top-2 hidden sm:inline-flex rotate-3 bg-[#0B9C74] text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded-full">NEW AI</span>
                </span>
                <br />
                <span className="text-[#E85D26]">without</span> the
                <br />
                chaos.
              </h1>
              <p className="mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-7 text-[#4a4a4a]">
                Chat to sell smarter — list once, let your AI handle DMs, upsells and “where’s my order?” while you focus on making. No website headaches.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#start" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B9C74] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(11,156,116,0.25)] hover:bg-[#0a8a66] active:scale-[0.98] transition">
                  Start selling free <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E85D26] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(232,93,38,0.25)] hover:bg-[#d55422] active:scale-[0.98] transition">
                  <Play className="h-4 w-4 fill-white" /> Watch 30s demo
                </a>
              </div>
            </div>

            <div className="relative lg:h-[520px] flex items-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="relative rounded-[22px] bg-white p-3 sm:p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#F3E6D3] flex flex-col">
                  <div className="absolute -top-2 -right-2 bg-[#0B9C74] text-white text-[10px] font-bold px-2 py-1 rounded-full rotate-3 shadow">BESTSELLER</div>
                  <div className="flex-1 rounded-xl bg-[#FFF6E8] p-3 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop" alt="Elixir bottle" className="h-28 w-28 object-contain mix-blend-multiply" />
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold leading-tight">Elixir Glow Serum</div>
                    <div className="text-[11px] text-[#6b6b6b]">30ml • Vitamin C</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold">$28.00</span>
                      <span className="h-7 w-7 grid place-items-center rounded-full bg-[#0B9C74] text-white"><ShoppingBag className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                  <span className="pointer-events-none absolute -right-6 top-10 hidden lg:block text-[#E85D26] text-xl rotate-12">🖍️</span>
                </div>

                <div className="relative rounded-[22px] overflow-hidden bg-[#FFF1DA] border border-[#F3E6D3] shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-0 flex flex-col">
                  <div className="relative flex-1 bg-white m-2 rounded-2xl overflow-hidden border border-[#F3E6D3]">
                    <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop" alt="laptop" className="h-28 sm:h-32 w-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="rounded-2xl bg-white p-2.5 shadow-lg max-w-[85%]">
                        <div className="text-[11px] font-bold leading-tight">Is it in stock? And a SPF one? Need advice for oily skin 🙏</div>
                        <div className="mt-2 rounded-xl bg-[#E6F7F1] p-2 text-[11px] leading-snug"><span className="font-bold text-[#0B9C74]">Cognicart AI •</span> Yes! For oily skin try Elixir + Matte Sunscreen — bundle ₹499, free delivery? Want me to add to cart?</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                      <span className="h-6 w-6 rounded-full bg-[#0B9C74] grid place-items-center text-white text-xs">💬</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 flex items-center gap-2 text-[11px] font-medium text-[#6b6b6b]">
                    <span className="h-6 w-6 rounded-full bg-white border border-[#F3E6D3] grid place-items-center">🌿</span> Replies in 3 seconds
                  </div>
                </div>

                <div className="relative rounded-[22px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#F3E6D3] h-[168px] sm:h-[190px]">
                  <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop" alt="two sellers smiling" className="h-full w-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 text-xs font-bold shadow flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-[#FFE7C2] grid place-items-center">✦</span> Amara & Lisa • Lagos
                  </div>
                </div>

                <div className="relative rounded-[22px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#F3E6D3] h-[168px] sm:h-[190px]">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop" alt="two sellers" className="h-full w-full object-cover" />
                  <div className="absolute top-2 left-2 bg-[#0B9C74] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">⭐ 2,341 orders via WhatsApp</div>
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <span className="flex-1 bg-white/95 backdrop-blur rounded-full px-2 py-1.5 text-[11px] font-bold text-center">Eco • Fashion</span>
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-white shadow"><Heart className="h-4 w-4 text-[#E85D26]" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-[#F3E6D3]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              {
                icon: Users,
                title: "Built for Sellers",
                desc: "List in 2 minutes. No code, no website. Your shop lives where customers already chat.",
              },
              {
                icon: MessageCircle,
                title: "AI that Sells",
                desc: "Answers FAQs, recommends sizes & bundles, and nudges abandoned carts — in your tone.",
              },
              {
                icon: Store,
                title: "One Tap Checkout",
                desc: "Customers check out inside WhatsApp. Cash, transfer or card — auto receipts & tracking.",
              },
              {
                icon: TrendingUp,
                title: "Seller Growth Kit",
                desc: "Broadcasts, coupons, and restock alerts. See what's selling with a calm, clear dashboard.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center lg:text-left">
                <div className="mx-auto lg:mx-0 h-10 w-10 rounded-xl border border-[#E6F7F1] bg-[#F0FFF8] grid place-items-center text-[#0B9C74]">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-display font-bold text-[16px] leading-tight">{f.title}</div>
                <div className="mt-1.5 text-sm leading-6 text-[#5a5a5a]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="bg-[#FFFBF5]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[34px] sm:text-[42px] font-bold tracking-tight leading-none">Marketplace</h2>
              <p className="mt-2 text-sm text-[#6b6b6b]">Fresh drops from sellers you follow — chat to buy in one message.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-white border border-[#F3E6D3] px-4 py-2 text-sm font-bold hover:bg-[#FFF1DA] transition">All</button>
              <button className="rounded-full bg-[#1a1a1a] text-white px-4 py-2 text-sm font-bold">Beauty</button>
              <button className="rounded-full bg-white border border-[#F3E6D3] px-4 py-2 text-sm font-bold hover:bg-[#FFF1DA] transition hidden sm:inline-flex">Fashion</button>
              <button className="rounded-full bg-white border border-[#F3E6D3] px-4 py-2 text-sm font-bold hover:bg-[#FFF1DA] transition hidden sm:inline-flex">Home</button>
              <a href="#" className="ml-2 inline-flex items-center gap-1 text-sm font-bold text-[#0B9C74] hover:gap-1.5 transition">View all <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                name: "Elixir Glow Serum",
                price: "₦8,500",
                old: "₦10,000",
                rating: "4.9 (212)",
                img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
                tag: "Bestseller",
                color: "bg-[#E6F7F1] text-[#0B9C74]",
              },
              {
                name: "Cozy Knit Hoodie",
                price: "₦14,000",
                rating: "4.8 (98)",
                img: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&h=600&fit=crop",
                tag: "New drop",
                color: "bg-[#FFF1DA] text-[#E85D26]",
              },
              {
                name: "Citrus Cold Press",
                price: "₦2,200",
                rating: "5.0 (44)",
                img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=600&fit=crop",
                tag: null,
                color: "",
              },
              {
                name: "Market Tote — Canvas",
                price: "₦6,500",
                rating: "4.9 (301)",
                img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop",
                tag: "Handmade",
                color: "bg-[#1a1a1a] text-white",
              },
            ].map((p) => (
              <div key={p.name} className="group relative rounded-[20px] bg-white border border-[#F3E6D3] overflow-hidden hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition">
                <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-full bg-white border border-[#F3E6D3] grid place-items-center shadow-sm">
                    <Check className="h-3.5 w-3.5 text-[#0B9C74]" />
                  </span>
                  {p.tag && <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${p.color}`}>{p.tag}</span>}
                </div>
                <button className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white border border-[#F3E6D3] grid place-items-center shadow-sm hover:bg-[#FFF1DA] transition">
                  <Heart className="h-4 w-4 text-[#1a1a1a]" />
                </button>
                <div className="aspect-square bg-[#FFFBF5] p-4 flex items-center justify-center">
                  <img src={p.img} alt={p.name} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition" />
                </div>
                <div className="p-3.5">
                  <div className="text-[13px] font-bold leading-tight line-clamp-1">{p.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-[#E85D26] text-[#E85D26]" />
                    <span className="font-medium">{p.rating}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold">{p.price}</span>
                      {p.old && <span className="ml-1 text-xs line-through text-[#9a9a9a]">{p.old}</span>}
                    </div>
                    <button className="h-8 w-8 rounded-full bg-[#1a1a1a] text-white grid place-items-center hover:bg-black transition">
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="sellers" className="bg-white border-y border-[#F3E6D3]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F1] border border-[#0B9C74]/10 px-3 py-1 text-xs font-bold text-[#0B9C74]"><Sparkles className="h-3.5 w-3.5" /> How Cognicart works</span>
            <h2 className="font-display text-[32px] lg:text-[40px] font-bold tracking-tight leading-none mt-4">From chat to checkout in 3 taps</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a5a5a]">No website needed. Your AI shop lives in WhatsApp — where your customers already are.</p>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "List your products",
                desc: "Snap photos, add prices. We generate descriptions and WhatsApp catalogs automatically.",
                icon: Store,
                img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
              },
              {
                step: "02",
                title: "AI handles the chat",
                desc: "Answers stock, size, delivery & haggles politely. Sends cart links inside the chat.",
                icon: MessageCircle,
                img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
              },
              {
                step: "03",
                title: "You pack & get paid",
                desc: "Orders sync to your dashboard. Print waybill, confirm payment, trigger delivery.",
                icon: TrendingUp,
                img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-[22px] bg-[#FFFBF5] border border-[#F3E6D3] overflow-hidden hover:shadow-[0_16px_30px_rgba(0,0,0,0.06)] transition group">
                <div className="h-44 overflow-hidden relative">
                  <img src={s.img} alt="" className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-700" />
                  <span className="absolute left-3 top-3 rounded-full bg-white border border-[#F3E6D3] px-3 py-1 text-xs font-bold">{s.step}</span>
                  <span className="absolute right-3 bottom-3 h-10 w-10 rounded-xl bg-white border border-[#F3E6D3] grid place-items-center shadow-sm">
                    <s.icon className="h-5 w-5 text-[#0B9C74]" />
                  </span>
                </div>
                <div className="p-6">
                  <div className="font-display font-bold text-[18px] leading-tight">{s.title}</div>
                  <div className="mt-2 text-sm leading-6 text-[#5a5a5a]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[34px] lg:text-[40px] font-bold tracking-tight leading-none">Simple, fair pricing</h2>
            <p className="mt-3 text-sm text-[#5a5a5a]">Start free. Grow with you — only pay when you sell. Cancel anytime.</p>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                sub: "For testing the waters",
                features: ["50 AI conversations / mo", "20 products", "Basic dashboard", "Community support"],
                cta: "Start free",
                featured: false,
              },
              {
                name: "Growth",
                price: "₦9,500",
                sub: "/month — most popular",
                features: ["Unlimited AI chats", "1,000 products", "Broadcasts & coupons", "Paystack & Flutterwave", "Priority support"],
                cta: "Start 14-day trial",
                featured: true,
              },
              {
                name: "Scale",
                price: "Custom",
                sub: "For teams & wholesalers",
                features: ["Multi-seller & branches", "API & webhooks", "Dedicated success manager", "SLA & invoicing"],
                cta: "Contact sales",
                featured: false,
              },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-[22px] border p-6 flex flex-col ${tier.featured ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,0.15)] scale-[1.02]" : "bg-[#FFFBF5] border-[#F3E6D3]"}`}>
                <div className="text-sm font-bold tracking-widest flex items-center gap-2">
                  {tier.name} {tier.featured && <span className="rounded-full bg-[#0B9C74] px-2 py-0.5 text-[11px] text-white">POPULAR</span>}
                </div>
                <div className="mt-3 font-display text-[32px] font-bold leading-none">{tier.price}</div>
                <div className={`text-xs ${tier.featured ? "text-white/60" : "text-[#6b6b6b]"}`}>{tier.sub}</div>
                <ul className="mt-6 space-y-3 text-sm flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-[#0B9C74]" />
                      <span className={tier.featured ? "text-white/90" : "text-[#2b2b2b]"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`mt-6 w-full rounded-full py-3 text-sm font-bold transition ${tier.featured ? "bg-[#0B9C74] text-white hover:bg-[#0a8a66]" : "bg-white border border-[#F3E6D3] hover:bg-[#FFF1DA] text-[#1a1a1a]"}`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="start" className="bg-[#E85D26]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="rounded-[24px] bg-white p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-[28px] lg:text-[36px] font-bold leading-none tracking-tight">Open your WhatsApp store today.</h3>
              <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#5a5a5a]">Import from Instagram or catalog in minutes. Your AI starts selling while you sleep — you keep the profit.</p>
              <div className="mt-2 flex items-center gap-4 text-xs font-bold text-[#6b6b6b]">
                <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-[#0B9C74]" /> No card required</span>
                <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-[#0B9C74]" /> 2-min setup</span>
              </div>
            </div>
            <div className="flex w-full lg:w-auto flex-col sm:flex-row gap-3">
              <a href="#" className="inline-flex justify-center items-center gap-2 rounded-full bg-[#0B9C74] px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-[#0a8a66] transition">
                Start selling free <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#" className="inline-flex justify-center items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-8 py-4 text-sm font-bold hover:bg-[#FFF1DA] transition">
                Talk to founder
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-8 w-8 rounded-lg bg-white text-[#1a1a1a] grid place-items-center font-bold text-sm">C</span>
                <span className="font-display font-bold text-lg">Cognicart</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60 max-w-[320px]">WhatsApp AI Commerce for African sellers. Sell where your customers chat.</p>
              <div className="mt-4 flex gap-2">
                <a href="#" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition"><Share2 className="h-4 w-4" /></a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition"><Mail className="h-4 w-4" /></a>
                <a href="#" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition"><Globe className="h-4 w-4" /></a>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold">Product</div>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Marketplace</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">WhatsApp API</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-bold">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy & Terms</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-bold">Get updates</div>
              <p className="mt-3 text-sm text-white/60">New sellers, tips & promo codes. No spam.</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
                <input placeholder="Your WhatsApp or email" className="flex-1 rounded-full bg-white/10 border border-white/10 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#0B9C74]" />
                <button className="rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold hover:bg-[#0a8a66] transition">Join</button>
              </form>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <span>© 2026 Cognicart — Built in Port Harcourt for sellers everywhere.</span>
            <span>Made with ♥ for WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
