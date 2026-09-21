import { useState } from "react"
import { MessageCircle, Check, Shield, ExternalLink, Phone, Unplug, Copy } from "lucide-react"
import { useBusiness } from "../../context/BusinessContext"

export default function WhatsApp() {
  const { business, connectWhatsApp, disconnectWhatsApp } = useBusiness()
  const [phone, setPhone] = useState(business?.whatsappPhone || "")
  const [connecting, setConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const isConnected = business?.whatsappConnected

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) return
    setConnecting(true)
    await connectWhatsApp(phone)
    setConnecting(false)
  }

  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp? AI will stop replying.")) return
    await disconnectWhatsApp()
  }

  const copyWebhook = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/api/whatsapp/webhook`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">WhatsApp Business</h1>
        <p className="text-sm text-[#6b6b6b]">Connects their WhatsApp Business account — seller's AI lives where customers already chat. Tenant-isolated by sellerId.</p>
      </div>

      <div className={`rounded-[22px] border p-6 flex flex-col lg:flex-row items-start justify-between gap-4 ${isConnected ? "bg-[#E6F7F1] border-[#0B9C74]/20" : "bg-white border-[#F3E6D3]"}`}>
        <div className="flex gap-3">
          <div className={`h-11 w-11 rounded-xl grid place-items-center ${isConnected ? "bg-[#0B9C74] text-white" : "bg-[#FFF1DA] border border-[#F3E6D3] text-[#E85D26]"}`}>
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              {isConnected ? "Connected" : "Not connected"}
              {isConnected && <span className="inline-flex items-center gap-1 rounded-full bg-[#0B9C74] px-2 py-0.5 text-xs font-bold text-white"><Check className="h-3 w-3" /> Active</span>}
            </div>
            <div className="text-sm text-[#6b6b6b] leading-5">
              {isConnected
                ? `AI replies on ${business?.whatsappPhone}. Verified ${business?.whatsappVerifiedAt ? new Date(business.whatsappVerifiedAt).toLocaleString() : ""}.`
                : "AI will reply inside WhatsApp after you connect. Webhook verification comes in Phase 5."}
            </div>
            {isConnected && <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white border border-[#0B9C74]/20 px-3 py-1 text-xs font-bold"><Phone className="h-3 w-3" /> {business?.whatsappPhone}</div>}
          </div>
        </div>
        {isConnected ? (
          <button onClick={handleDisconnect} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-4 py-2 text-sm font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700">
            <Unplug className="h-4 w-4" /> Disconnect
          </button>
        ) : (
          <div className="rounded-xl bg-[#FFF1DA] border border-[#F3E6D3] px-3 py-2 text-xs font-bold">Phase 5 mock — stores locally</div>
        )}
      </div>

      {!isConnected ? (
        <form onSubmit={handleConnect} className="rounded-2xl bg-white border border-[#F3E6D3] p-6 space-y-4">
          <div className="text-sm font-bold">Connect WhatsApp Business</div>
          <p className="text-xs text-[#6b6b6b] leading-5">Sellers paste their WhatsApp Business number. In production this uses WhatsApp Cloud API onboarding and webhook verification at <span className="font-mono font-bold">POST /api/whatsapp/webhook</span>.</p>
          <label className="block">
            <span className="text-xs font-bold">WhatsApp Business phone *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2348010000001" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" required />
          </label>
          <button type="submit" disabled={connecting} className="rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-60">
            {connecting ? "Connecting..." : "Connect WhatsApp"}
          </button>
          <div className="rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3 text-xs leading-5 text-[#6b6b6b]">
            <div className="font-bold text-[#1a1a1a]">What happens after connect</div>
            AI will handle stock, price, delivery and cart links inside WhatsApp via constrained tools. No invented prices — all from your catalog.
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#F3E6D3] p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Webhook setup (Phase 5)</div>
              <button onClick={copyWebhook} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-3 py-1.5 text-xs font-bold hover:bg-[#FFF1DA]">
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy webhook URL"}
              </button>
            </div>
            <div className="mt-3 rounded-xl bg-[#1a1a1a] text-white p-3 font-mono text-xs break-all">{window.location.origin}/api/whatsapp/webhook</div>
            <div className="mt-2 text-xs text-[#6b6b6b]">Add this to WhatsApp Cloud API dashboard. Verification token is stored per seller. Each seller has independent credentials isolated by sellerId.</div>
          </div>

          <div className="rounded-2xl bg-white border border-[#F3E6D3] p-6">
            <div className="text-sm font-bold flex items-center gap-2"><Shield className="h-4 w-4 text-[#0B9C74]" /> Test your AI</div>
            <p className="text-xs text-[#6b6b6b] mt-1">Send a WhatsApp message to your number: "Hi, is Elixir Glow Serum in stock?" AI should reply in 3 seconds using your catalog.</p>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">
              Open WhatsApp <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-[#FFF1DA] border border-[#F3E6D3] p-4">
        <div className="text-sm font-bold">Roadmap</div>
        <p className="text-xs leading-5 text-[#5a5a5a] mt-1">Phase 5 adds real Cloud API webhook verification, incoming/outgoing logging and seller identification. Phase 6 adds AI tools `searchProducts/getProduct/checkStock/getBusinessInfo/createOrder`. This mock stores connection locally and is ready for the backend.</p>
      </div>
    </div>
  )
}
