import { Share2, Mail, Globe } from "lucide-react"

export function Footer() {
  return (
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
              <a href="#" aria-label="Share" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Mail" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Website" className="h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20 transition">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#marketplace" className="hover:text-white transition">Marketplace</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">WhatsApp API</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy and Terms</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold">Get updates</div>
            <p className="mt-3 text-sm text-white/60">New sellers, tips and promo codes. No spam.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
              <input placeholder="Your WhatsApp or email" className="flex-1 rounded-full bg-white/10 border border-white/10 px-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#0B9C74]" />
              <button className="rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold hover:bg-[#0a8a66] transition">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© 2026 Cognicart. Built in Port Harcourt for sellers everywhere.</span>
          <span>Made with love for WhatsApp</span>
        </div>
      </div>
    </footer>
  )
}
