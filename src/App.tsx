import { useState } from "react"
import {
  Check,
  Sparkles,
  Palette,
  LayoutGrid,
  Type,
  MousePointer2,
  Layers,
  Zap,
  Sun,
  Moon,
  ArrowRight,
  Search,
  Bell,
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Star,
  Heart,
  MessageCircle,
  ShieldCheck,
  Rocket,
  ExternalLink,
  ChevronRight,
  Play,
} from "lucide-react"

function App() {
  const [dark, setDark] = useState(false)
  const [count, setCount] = useState(0)
  const [email, setEmail] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [liked, setLiked] = useState(false)

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-violet-500/30 font-sans antialiased transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[15px] font-bold tracking-tight">
                    wabac<span className="text-violet-600 dark:text-violet-400">.ui</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600/20">Tailwind v4 • OK</span>
                </div>
                <nav className="hidden lg:flex items-center gap-1">
                  {["Overview", "Components", "Colors", "Typography"].map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition">
                      {item}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 p-1">
                  <button onClick={() => setDark(false)} className={`rounded-full p-1.5 transition ${!dark ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-300"}`} aria-label="Light">
                    <Sun className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDark(true)} className={`rounded-full p-1.5 transition ${dark ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`} aria-label="Dark">
                    <Moon className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => setDark(!dark)} className="md:hidden rounded-full bg-slate-900 dark:bg-white p-2.5 text-white dark:text-slate-900">
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <a href="https://tailwindcss.com" target="_blank" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition">
                  Docs <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-[#f8fafc] dark:from-violet-950/20 dark:via-slate-950 dark:to-[#020617]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[480px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/40 via-indigo-100/20 to-transparent dark:from-violet-900/20 dark:via-indigo-900/10 blur-3xl" />
            <div className="absolute top-20 right-[10%] h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-400/20 to-violet-400/20 blur-3xl" />
            <div className="absolute top-40 left-[8%] h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-700 dark:text-slate-300">Tailwind CSS is working</span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-white text-[11px]">v4.3.3 <Check className="h-3 w-3" /></span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95]">
                <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">Build faster with</span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Tailwind CSS</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                If you see gradients, rounded cards, shadows, and responsive layout — your setup is <span className="font-semibold text-slate-900 dark:text-white">correctly connected</span> to Vite + React. This page tests every utility.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => setCount((c) => c + 1)} className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700 active:scale-[0.98] transition">
                  <Zap className="h-4 w-4 group-hover:rotate-12 transition" />
                  Clicked {count} times
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                </button>
                <a href="#components" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                  <Play className="h-4 w-4" /> View components
                </a>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> JIT enabled</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> HMR active</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> @tailwindcss/vite</span>
              </div>
            </div>

            {/* Stats / Bento top */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: TrendingUp, label: "Build time", value: "42ms", sub: "Vite + Tailwind v4", color: "from-emerald-500 to-teal-600" },
                { icon: Palette, label: "Utilities", value: "100%", sub: "All classes work", color: "from-violet-500 to-indigo-600" },
                { icon: Layers, label: "Responsive", value: "xs → 2xl", sub: "Breakpoints active", color: "from-blue-500 to-cyan-600" },
                { icon: ShieldCheck, label: "Dark mode", value: dark ? "Dark" : "Light", sub: "Toggle to test", color: "from-amber-500 to-orange-600" },
              ].map((s) => (
                <div key={s.label} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 hover:shadow-md hover:ring-violet-200 dark:hover:ring-violet-900/50 transition">
                  <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-[0.08] group-hover:opacity-[0.12] transition`} />
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-sm`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-8">

          {/* Status banner — replaces simple "Tailwind is Working" card but keeps it as proof */}
          <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-[1px] shadow-xl">
            <div className="rounded-[19px] bg-white dark:bg-slate-900 px-6 py-6 sm:px-8 sm:py-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                    <span className="sm:hidden inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">✓</span>
                    Tailwind is Working
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600/20">Verified</span>
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    This card uses <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono">bg-slate-950</code>,
                    <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono mx-1">rounded-2xl</code>,
                    <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono">shadow-2xl</code> and
                    <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono ml-1">hover:bg-blue-700</code>. If it looks styled, you’re good.
                  </p>
                </div>
              </div>
              <div className="flex w-full lg:w-auto items-center gap-3">
                <button onClick={() => setCount(c => c + 1)} className="flex-1 lg:flex-none inline-flex justify-center items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 active:scale-[0.98] transition">
                  Test Button <span className="rounded-full bg-white/20 dark:bg-slate-900/10 px-2 py-0.5 text-xs">{count}</span>
                </button>
                <button onClick={() => setLiked(!liked)} className={`rounded-xl p-3 ring-1 transition ${liked ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 ring-rose-200 dark:ring-rose-900/50" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-700 hover:text-rose-500"}`}>
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutGrid },
              { id: "buttons", label: "Buttons & Actions", icon: MousePointer2 },
              { id: "forms", label: "Forms", icon: Search },
              { id: "grid", label: "Layout & Grid", icon: Layers },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === t.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            ))}
          </div>

          {/* Components Showcase */}
          <section id="components" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Buttons */}
            <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-violet-600" /> Buttons & States</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">hover • focus • active • disabled</span>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-500/20 hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2 active:scale-[0.98] transition">Primary</button>
                  <button className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition">Secondary</button>
                  <button className="rounded-xl bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Outline</button>
                  <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Ghost</button>
                  <button disabled className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">Disabled</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"><ShoppingBag className="h-4 w-4" /> Add to cart</button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 transition"><Heart className="h-4 w-4" /> Wishlist</button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 hover:opacity-90 transition">Gradient <Sparkles className="h-4 w-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">bg-blue-600</button>
                  <button className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition">bg-amber-500</button>
                  <button className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition">bg-rose-600</button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium"><span className="h-2 w-2 rounded-full bg-emerald-500" /> transition</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium"><span className="h-2 w-2 rounded-full bg-blue-500" /> hover:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium"><span className="h-2 w-2 rounded-full bg-violet-500" /> focus-visible:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-medium"><span className="h-2 w-2 rounded-full bg-amber-500" /> active:scale</span>
                </div>
              </div>
            </div>

            {/* Right: Alerts & Badges */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                <h3 className="text-sm font-bold tracking-tight mb-4">Badges & Pills</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">New</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600/20"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</span>
                  <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">Beta</span>
                  <span className="inline-flex items-center rounded-full bg-slate-900 dark:bg-white px-3 py-1 text-xs font-semibold text-white dark:text-slate-900">Pro</span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium">Neutral</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"><Star className="h-3 w-3" /> 4.9</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"><Bell className="h-3.5 w-3.5" /></span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white"><MessageCircle className="h-3.5 w-3.5" /></span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-3.5 w-3.5" /></span>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-lg shadow-violet-500/20">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <Rocket className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-lg font-bold">Gradient + blur test</h4>
                <p className="mt-1 text-sm text-violet-100">Checks bg-gradient, backdrop-blur, shadow, and rounded.</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition">
                  Try hover <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Forms */}
          {(activeTab === "overview" || activeTab === "forms") && (
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Search className="h-4 w-4 text-violet-600" /> Forms — ring, focus, placeholder</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</span>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@wabac.com" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition" />
                      </div>
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select</span>
                      <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition">
                        <option>Starter — $0/mo</option>
                        <option>Pro — $29/mo</option>
                        <option>Scale — $99/mo</option>
                      </select>
                    </label>
                  </div>
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message</span>
                    <textarea rows={3} placeholder="Tell us about your store..." className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition resize-none" />
                  </label>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" /> Remember me
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="plan" defaultChecked className="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500" /> Monthly
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="radio" name="plan" className="h-4 w-4 border-slate-300 text-violet-600 focus:ring-violet-500" /> Yearly <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">Save 20%</span>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition">Subscribe</button>
                    <button className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Cancel</button>
                    <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 self-center hidden sm:inline">Validates focus:ring & border</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                  <h3 className="text-sm font-bold mb-3">Shadows & Radius</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-lg bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center text-xs font-medium">shadow-sm</div>
                    <div className="h-20 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-xs font-medium">shadow-md</div>
                    <div className="h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-xs font-medium">shadow-xl</div>
                    <div className="h-20 rounded-md bg-violet-600 text-white flex items-center justify-center text-xs font-medium">rounded-md</div>
                    <div className="h-20 rounded-xl bg-violet-600 text-white flex items-center justify-center text-xs font-medium">rounded-xl</div>
                    <div className="h-20 rounded-[24px] bg-violet-600 text-white flex items-center justify-center text-xs font-medium">rounded-[24px]</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-900 dark:bg-white p-6 text-white dark:text-slate-900">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Opacity & Filters</h4>
                    <span className="rounded-full bg-white/10 dark:bg-slate-900/10 px-2.5 py-1 text-xs font-medium backdrop-blur">backdrop-blur</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-12 flex-1 rounded-xl bg-white dark:bg-slate-900 opacity-100 flex items-center justify-center text-xs font-medium ring-1 ring-white/20 dark:ring-slate-200">100%</div>
                    <div className="h-12 flex-1 rounded-xl bg-white dark:bg-slate-900 opacity-70 flex items-center justify-center text-xs font-medium">70%</div>
                    <div className="h-12 flex-1 rounded-xl bg-white dark:bg-slate-900 opacity-40 flex items-center justify-center text-xs font-medium">40%</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Color palette */}
          <section id="colors" className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold flex items-center gap-2"><Palette className="h-4 w-4 text-violet-600" /> Color system & Gradients</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">bg-* • text-* • from-* via-* to-*</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { name: "violet", cls: "bg-violet-600" },
                  { name: "indigo", cls: "bg-indigo-600" },
                  { name: "blue", cls: "bg-blue-600" },
                  { name: "emerald", cls: "bg-emerald-600" },
                  { name: "amber", cls: "bg-amber-500" },
                  { name: "rose", cls: "bg-rose-600" },
                  { name: "slate", cls: "bg-slate-900 dark:bg-slate-700" },
                ].map((c) => (
                  <div key={c.name} className="space-y-2">
                    <div className={`h-14 rounded-xl ${c.cls} shadow-sm`} />
                    <div className="text-xs font-medium capitalize">{c.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{c.cls}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="h-20 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-semibold text-white">from-violet → indigo</div>
                <div className="h-20 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-sm font-semibold text-white">emerald → teal → cyan</div>
                <div className="h-20 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 flex items-center justify-center text-sm font-semibold text-white">amber → rose</div>
              </div>
            </div>
          </section>

          {/* Grid & Typography & Spacing */}
          {(activeTab === "overview" || activeTab === "grid") && (
            <>
              <section id="grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4"><LayoutGrid className="h-4 w-4 text-violet-600" /> Grid & Flex — responsive test</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Resize window: 1 col on mobile → 2 on md → 3 on lg</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="group relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-indigo-500/0 group-hover:from-violet-500/5 group-hover:to-indigo-500/5 transition" />
                        <div className="relative flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center text-sm font-bold">{n}</div>
                          <div>
                            <div className="text-sm font-semibold">Item {n}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">gap-3 • p-4</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-violet-600" /> flex</div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-blue-600" /> grid</div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-emerald-600" /> gap</div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-amber-600" /> space-y / space-x</div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 self-center">— all working</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-4"><Layers className="h-4 w-4 text-violet-600" /> Spacing & Sizing</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Padding scale (p-2 → p-8)</div>
                      <div className="flex items-end gap-2">
                        <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold p-2">2</div>
                        <div className="h-12 w-12 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold p-4">4</div>
                        <div className="h-16 w-16 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold p-6">6</div>
                        <div className="h-20 w-20 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold p-8">8</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Width fractions</div>
                      <div className="space-y-2">
                        <div className="h-6 w-1/4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                        <div className="h-6 w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                        <div className="h-6 w-3/4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
                        <div className="h-6 w-full rounded-full bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center text-[11px] font-medium">w-full</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="typography" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-5"><Type className="h-4 w-4 text-violet-600" /> Typography scale</h3>
                  <div className="space-y-3">
                    <div className="text-4xl font-black tracking-tight">4xl • Black</div>
                    <div className="text-2xl font-bold">2xl • Bold</div>
                    <div className="text-xl font-semibold">xl • Semibold</div>
                    <div className="text-base font-medium">base • Medium — The quick brown fox</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">sm • Regular — Tailwind resets and scales type correctly.</div>
                    <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">text-xs font-mono — 0 1 2 — tracking-tight leading-relaxed</div>
                    <div className="pt-3 flex flex-wrap gap-2 text-xs">
                      <span className="font-bold">bold</span>
                      <span className="font-semibold">semibold</span>
                      <span className="italic">italic</span>
                      <span className="underline">underline</span>
                      <span className="line-through">line-through</span>
                      <span className="tracking-widest">tracking-widest</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6">
                  <h3 className="text-sm font-bold mb-4">Cards & Hover</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "WhatsApp Store", price: "$29", icon: MessageCircle, color: "bg-emerald-500" },
                      { title: "AI Commerce", price: "$49", icon: Sparkles, color: "bg-violet-600" },
                      { title: "Analytics Pro", price: "$19", icon: TrendingUp, color: "bg-blue-600" },
                      { title: "Team Plan", price: "$99", icon: Users, color: "bg-amber-500" },
                    ].map((card) => (
                      <div key={card.title} className="group rounded-xl bg-slate-50 dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer">
                        <div className={`h-9 w-9 rounded-xl ${card.color} flex items-center justify-center text-white shadow-sm`}>
                          <card.icon className="h-4 w-4" />
                        </div>
                        <div className="mt-3 text-sm font-semibold leading-tight">{card.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{card.price}/mo</div>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition">View <ChevronRight className="h-3 w-3" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Product/storefront preview */}
              <section className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-2 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center rounded-full bg-slate-900 dark:bg-white px-2.5 py-1 text-xs font-bold text-white dark:text-slate-900">STORE PREVIEW</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">wabac — WhatsApp AI Commerce</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Handmade Ceramic Mug", price: "$24.00", rating: "4.9", img: "from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30", badge: "Bestseller" },
                        { name: "Linen Tote Bag", price: "$32.00", rating: "4.8", img: "from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30", badge: "New" },
                        { name: "Scented Candle Set", price: "$18.00", rating: "5.0", img: "from-violet-100 to-indigo-100 dark:from-violet-950/30 dark:to-indigo-950/30", badge: null },
                      ].map((p) => (
                        <div key={p.name} className="group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 hover:shadow-md transition">
                          <div className={`h-28 bg-gradient-to-br ${p.img} relative flex items-center justify-center`}>
                            <Package className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                            {p.badge && <span className="absolute left-2 top-2 rounded-full bg-slate-900 dark:bg-white px-2 py-0.5 text-[11px] font-bold text-white dark:text-slate-900">{p.badge}</span>}
                            <button className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-500 transition">
                              <Heart className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-semibold leading-tight line-clamp-1">{p.name}</div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"><Star className="h-3 w-3 fill-current" /> {p.rating} <span className="text-slate-400">• 120 sold</span></div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm font-bold">{p.price}</span>
                              <button className="rounded-full bg-slate-900 dark:bg-white px-3 py-1 text-xs font-semibold text-white dark:text-slate-900 hover:opacity-90 transition">Add</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Order summary</h4>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Subtotal</span><span className="font-medium">$74.00</span></div>
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Shipping</span><span className="font-medium text-emerald-600">Free</span></div>
                      <div className="h-px bg-slate-200 dark:bg-slate-700" />
                      <div className="flex justify-between text-base font-bold"><span>Total</span><span>$74.00</span></div>
                    </div>
                    <button className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 transition flex items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" /> Checkout on WhatsApp
                    </button>
                    <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Powered by wabac • Tailwind v4</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Pseudo & Animation row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <h4 className="text-sm font-bold mb-3">Animations & Transitions</h4>
              <div className="space-y-3">
                <div className="h-12 rounded-xl bg-violet-600 animate-pulse flex items-center justify-center text-sm font-semibold text-white">animate-pulse</div>
                <div className="flex gap-3">
                  <div className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="h-6 w-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                  </div>
                  <div className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium hover:scale-105 transition">hover:scale-105</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <h4 className="text-sm font-bold mb-3">Borders & Divide</h4>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-4 py-3 text-sm font-medium flex items-center justify-between">Row 1 <span className="text-xs text-slate-500">divide-y</span></div>
                <div className="px-4 py-3 text-sm font-medium flex items-center justify-between">Row 2 <span className="h-2 w-2 rounded-full bg-emerald-500" /></div>
                <div className="px-4 py-3 text-sm font-medium flex items-center justify-between">Row 3 <span className="text-xs text-slate-500">border</span></div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 h-10 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs">dashed</div>
                <div className="flex-1 h-10 rounded-lg border-2 border-slate-900 dark:border-white flex items-center justify-center text-xs font-medium">solid</div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 p-6 text-white dark:text-slate-900">
              <h4 className="text-sm font-bold">Filters & Backdrop</h4>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 dark:bg-slate-900/10 backdrop-blur p-3 ring-1 ring-white/20 dark:ring-slate-900/10">
                  <div className="text-xs font-medium">backdrop-blur</div>
                  <div className="text-[11px] opacity-70">frosted glass</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 p-3 shadow-lg">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">shadow-lg</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">elevation</div>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/10 dark:bg-slate-900/5 p-3 ring-1 ring-white/10 dark:ring-slate-900/10">
                <div className="text-xs opacity-80">If this card has blur & transparency, filters work.</div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="relative overflow-hidden rounded-[20px] bg-slate-950 dark:bg-white px-6 py-8 sm:px-10 sm:py-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-600/20 to-violet-600/20 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white dark:text-slate-900 tracking-tight">All utilities passed ✅</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400 dark:text-slate-600">
                  Colors, spacing, flex, grid, typography, shadows, gradients, transitions, responsive breakpoints, dark mode, hover/focus states — everything is wired. Start building your UI.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <code className="rounded-full bg-white/10 dark:bg-slate-900/10 px-3 py-1 text-xs font-mono text-white dark:text-slate-900">npm run dev</code>
                  <code className="rounded-full bg-white/10 dark:bg-slate-900/10 px-3 py-1 text-xs font-mono text-white dark:text-slate-900">src/index.css → @import "tailwindcss"</code>
                  <code className="rounded-full bg-violet-600 px-3 py-1 text-xs font-mono text-white">@tailwindcss/vite</code>
                </div>
              </div>
              <div className="flex w-full lg:w-auto gap-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Back to top <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </section>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pb-4">
            wabac • WhatsApp AI Commerce Platform • Tailwind CSS v4.3.3 • Vite + React • Built with <span className="text-rose-500">♥</span> — edit <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono">src/App.tsx</code> to continue.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
