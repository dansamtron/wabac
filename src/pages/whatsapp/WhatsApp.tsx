import { useEffect, useState } from "react"
import { MessageCircle, Check, Shield, ExternalLink, Phone, Unplug, Copy, Send, Webhook, Inbox, User, Clock, Trash2, Play, MessageSquare } from "lucide-react"
import { useBusiness } from "../../context/BusinessContext"
import { whatsappService } from "../../services/whatsappService"
import type { WhatsAppMessage, WhatsAppConfig } from "../../types/whatsapp"

export default function WhatsApp() {
  const { business, connectWhatsApp, disconnectWhatsApp } = useBusiness()
  const [phone, setPhone] = useState(business?.whatsappPhone || "")
  const [connecting, setConnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<"overview" | "webhook" | "inbox" | "simulator">("overview")
  const [config, setConfig] = useState<WhatsAppConfig | null>(null)
  const [verifyToken, setVerifyToken] = useState("")
  const [challenge, setChallenge] = useState("12345")
  const [verifyResult, setVerifyResult] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [conversations, setConversations] = useState<{ customerPhone: string; lastMessage: WhatsAppMessage; count: number }[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [simFrom, setSimFrom] = useState("+2348031112222")
  const [simBody, setSimBody] = useState("Hi, is Elixir Glow Serum in stock?")
  const [simBusinessPhone, setSimBusinessPhone] = useState("")
  const [simLoading, setSimLoading] = useState(false)

  const isConnected = business?.whatsappConnected

  useEffect(() => {
    setPhone(business?.whatsappPhone || "")
    whatsappService.getConfig().then(setConfig)
  }, [business])

  const loadMessages = async () => {
    const msgs = await whatsappService.listMessages()
    setMessages(msgs)
    const convs = await whatsappService.getConversations()
    setConversations(convs)
    if (convs.length > 0 && !selectedCustomer) setSelectedCustomer(convs[0].customerPhone)
  }

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    if (config) {
      setSimBusinessPhone(config.businessPhone)
      setVerifyToken(config.verifyToken)
    }
  }, [config])

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) return
    setConnecting(true)
    await connectWhatsApp(phone)
    const cfg = await whatsappService.connect({ businessPhone: phone, verifyToken: "verify_" + phone.slice(-4), accessToken: "token_" + phone.slice(-4) })
    setConfig(cfg)
    setConnecting(false)
    setTab("webhook")
  }

  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp? AI will stop replying.")) return
    await disconnectWhatsApp()
    await whatsappService.disconnect()
    setConfig(null)
    setMessages([])
    setConversations([])
  }

  const copyWebhook = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/api/whatsapp/webhook`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyResult(null)
    setVerifyError(null)
    try {
      const res = await whatsappService.verifyWebhook({ mode: "subscribe", verifyToken, challenge })
      setVerifyResult(res)
      const cfg = await whatsappService.getConfig()
      setConfig(cfg)
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Verify failed")
    }
  }

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSimLoading(true)
    try {
      await whatsappService.handleIncoming({ from: simFrom, body: simBody, businessPhone: simBusinessPhone || config?.businessPhone })
      await loadMessages()
      setTab("inbox")
      setSelectedCustomer(simFrom)
    } finally {
      setSimLoading(false)
    }
  }

  const handleClear = async () => {
    if (!confirm("Clear all logged messages for this seller?")) return
    whatsappService.clearAll()
    loadMessages()
  }

  const filteredMessages = selectedCustomer ? messages.filter((m) => m.customerPhone === selectedCustomer) : []

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">WhatsApp Business</h1>
        <p className="text-sm text-[#6b6b6b]">Phase 5 — Webhook verification, incoming and outgoing messages, seller identification, message logging. Deterministic replies before AI.</p>
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
              {config?.webhookVerified && <span className="inline-flex items-center gap-1 rounded-full bg-[#1a1a1a] px-2 py-0.5 text-xs font-bold text-white"><Shield className="h-3 w-3" /> Verified</span>}
            </div>
            <div className="text-sm text-[#6b6b6b] leading-5">
              {isConnected
                ? `AI replies on ${business?.whatsappPhone}. Verified ${business?.whatsappVerifiedAt ? new Date(business.whatsappVerifiedAt).toLocaleString() : ""}.`
                : "AI will reply inside WhatsApp after you connect. Webhook verification isolates sellers by phoneNumberId."}
            </div>
            {isConnected && <div className="mt-1 inline-flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0B9C74]/20 px-3 py-1 text-xs font-bold"><Phone className="h-3 w-3" /> {business?.whatsappPhone}</span>
              {config && <span className="inline-flex rounded-full bg-white border border-[#F3E6D3] px-3 py-1 text-xs font-mono">pnid {config.phoneNumberId}</span>}
            </div>}
          </div>
        </div>
        {isConnected ? (
          <button onClick={handleDisconnect} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-4 py-2 text-sm font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700">
            <Unplug className="h-4 w-4" /> Disconnect
          </button>
        ) : (
          <div className="rounded-xl bg-[#FFF1DA] border border-[#F3E6D3] px-3 py-2 text-xs font-bold">Mock local — stores per sellerId</div>
        )}
      </div>

      {!isConnected ? (
        <form onSubmit={handleConnect} className="rounded-2xl bg-white border border-[#F3E6D3] p-6 space-y-4">
          <div className="text-sm font-bold flex items-center gap-2"><Phone className="h-4 w-4 text-[#0B9C74]" /> Connect WhatsApp Business</div>
          <p className="text-xs text-[#6b6b6b] leading-5">Each seller has independent Cloud API credentials. We store <span className="font-mono font-bold">phoneNumberId, verifyToken, accessToken</span> per sellerId. In production this is OAuth onboarding.</p>
          <label className="block">
            <span className="text-xs font-bold">WhatsApp Business phone *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2348010000001" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" required />
          </label>
          <button type="submit" disabled={connecting} className="rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-60">
            {connecting ? "Connecting..." : "Connect WhatsApp"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-auto pb-1">
            {[
              { id: "overview", label: "Overview", icon: Shield },
              { id: "webhook", label: "Webhook", icon: Webhook },
              { id: "inbox", label: "Inbox", icon: Inbox },
              { id: "simulator", label: "Simulator", icon: Play },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id as never)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border whitespace-nowrap ${tab === t.id ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white border-[#F3E6D3] hover:bg-[#FFF1DA]"}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <button onClick={loadMessages} className="ml-auto rounded-full bg-white border border-[#F3E6D3] px-3 py-2 text-xs font-bold hover:bg-[#FFF1DA]">Refresh</button>
          </div>

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-6">
                <div className="text-sm font-bold">Seller identification</div>
                <p className="text-xs text-[#6b6b6b] leading-5 mt-1">Webhook payload contains <span className="font-mono">phone_number_id</span> or business phone. We map it to <span className="font-mono">sellerId</span> before any product lookup. Seller A never sees Seller B messages.</p>
                <div className="mt-3 grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3"><div className="font-bold">Business phone</div><div className="font-mono">{config?.businessPhone}</div></div>
                  <div className="rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3"><div className="font-bold">Phone number ID</div><div className="font-mono">{config?.phoneNumberId}</div></div>
                  <div className="rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3"><div className="font-bold">Verify token</div><div className="font-mono">{config?.verifyToken}</div></div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-6">
                <div className="text-sm font-bold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-[#0B9C74]" /> Deterministic bot (before AI)</div>
                <p className="text-xs text-[#6b6b6b] mt-1">Phase 5 uses rule-based replies that call the same tenant-scoped tools AI will use: <span className="font-mono">searchProducts, getProduct, checkStock, getBusinessInfo</span>. No hallucination.</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 list-disc pl-5 text-[#5a5a5a]">
                  <li><span className="font-bold">greeting</span> → "Hello! Welcome to [store]..."</li>
                  <li><span className="font-bold">price / how much</span> → lookup product by keyword, reply with price and stock</li>
                  <li><span className="font-bold">stock / available</span> → checkStock</li>
                  <li><span className="font-bold">show / need / search</span> → searchProducts → top 3</li>
                  <li><span className="font-bold">order / buy</span> → ask for product and quantity</li>
                  <li><span className="font-bold">delivery / pay</span> → getBusinessInfo</li>
                </ul>
              </div>
            </div>
          )}

          {tab === "webhook" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold flex items-center gap-2"><Webhook className="h-4 w-4 text-[#0B9C74]" /> Webhook verification</div>
                  <button onClick={copyWebhook} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-3 py-1.5 text-xs font-bold hover:bg-[#FFF1DA]">
                    <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy webhook URL"}
                  </button>
                </div>
                <div className="mt-3 rounded-xl bg-[#1a1a1a] text-white p-3 font-mono text-xs break-all">{config?.webhookUrl || `${window.location.origin}/api/whatsapp/webhook`}</div>
                <div className="mt-2 text-xs text-[#6b6b6b]">WhatsApp Cloud API calls <span className="font-mono">GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=12345</span>. We compare token per sellerId and return challenge.</div>

                <form onSubmit={handleVerify} className="mt-4 grid sm:grid-cols-3 gap-3">
                  <label>
                    <span className="text-xs font-bold">hub.mode</span>
                    <input value="subscribe" readOnly className="mt-1 w-full rounded-xl border border-[#F3E6D3] bg-[#FFFBF5] px-3 py-2 text-xs font-mono" />
                  </label>
                  <label>
                    <span className="text-xs font-bold">hub.verify_token</span>
                    <input value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} placeholder={config?.verifyToken} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2 text-xs font-mono focus:border-[#0B9C74] outline-none" />
                  </label>
                  <label>
                    <span className="text-xs font-bold">hub.challenge</span>
                    <input value={challenge} onChange={(e) => setChallenge(e.target.value)} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2 text-xs font-mono focus:border-[#0B9C74] outline-none" />
                  </label>
                  <button type="submit" className="sm:col-span-3 rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">Verify webhook</button>
                </form>
                {verifyResult && <div className="mt-3 rounded-xl bg-[#E6F7F1] border border-[#0B9C74]/20 px-3 py-2 text-sm font-mono">✓ Challenge returned: {verifyResult} — verifiedAt {config?.verifiedAt ? new Date(config.verifiedAt).toLocaleString() : ""}</div>}
                {verifyError && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{verifyError}</div>}
                {config?.webhookVerified && <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1 text-xs font-bold text-white"><Check className="h-3 w-3" /> Webhook verified for this seller</div>}
              </div>

              <div className="rounded-2xl bg-[#FFF1DA] border border-[#F3E6D3] p-4">
                <div className="text-sm font-bold">Backend reference (Express)</div>
                <pre className="mt-2 rounded-xl bg-[#1a1a1a] text-white p-3 text-xs overflow-auto">{`app.get("/api/whatsapp/webhook", (req, res) => {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
  const seller = identifySellerByToken(token); // per sellerId
  if (mode === "subscribe" && token === seller.verifyToken) {
    seller.webhookVerified = true;
    return res.send(challenge);
  }
  return res.sendStatus(403);
});`}</pre>
              </div>
            </div>
          )}

          {tab === "inbox" && (
            <div className="grid lg:grid-cols-[280px_1fr] gap-4">
              <div className="rounded-2xl bg-white border border-[#F3E6D3] p-3">
                <div className="flex items-center justify-between px-1">
                  <div className="text-sm font-bold flex items-center gap-2"><Inbox className="h-4 w-4 text-[#0B9C74]" /> Conversations</div>
                  <span className="text-xs bg-[#1a1a1a] text-white rounded-full px-2 py-0.5 font-bold">{conversations.length}</span>
                </div>
                <div className="mt-3 space-y-2 max-h-[420px] overflow-auto">
                  {conversations.length === 0 ? (
                    <div className="text-xs text-[#6b6b6b] p-3 text-center">No messages yet. Use Simulator to send a customer message.</div>
                  ) : (
                    conversations.map((c) => (
                      <button key={c.customerPhone} onClick={() => setSelectedCustomer(c.customerPhone)} className={`w-full text-left rounded-xl border p-3 flex gap-3 items-center ${selectedCustomer === c.customerPhone ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-[#FFFBF5] border-[#F3E6D3] hover:bg-[#FFF1DA]"}`}>
                        <span className="h-8 w-8 rounded-full bg-white border border-[#F3E6D3] grid place-items-center shrink-0 text-[#1a1a1a]"><User className="h-4 w-4" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate">{c.customerPhone}</div>
                          <div className={`text-xs truncate ${selectedCustomer === c.customerPhone ? "text-white/70" : "text-[#6b6b6b]"}`}>{c.lastMessage.body.slice(0, 44)}</div>
                        </div>
                        <span className="text-xs font-bold shrink-0">{c.count}</span>
                      </button>
                    ))
                  )}
                </div>
                <button onClick={handleClear} className="mt-3 w-full inline-flex justify-center items-center gap-2 rounded-full bg-white border border-[#F3E6D3] px-3 py-2 text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /> Clear logs</button>
              </div>

              <div className="rounded-2xl bg-white border border-[#F3E6D3] flex flex-col min-h-[420px]">
                <div className="px-4 py-3 border-b border-[#F3E6D3] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#0B9C74]" /> {selectedCustomer || "Select conversation"}</div>
                    <div className="text-xs text-[#6b6b6b]">Message logging • inbound and outbound tenant-scoped by sellerId</div>
                  </div>
                  <span className="text-xs rounded-full bg-[#E6F7F1] border border-[#0B9C74]/20 px-2 py-1 font-bold text-[#0B9C74]">{filteredMessages.length} messages</span>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto bg-[#FFFBF5]">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center text-xs text-[#6b6b6b] py-10">No messages for this customer. Simulate a message to see deterministic reply.</div>
                  ) : (
                    filteredMessages.map((m) => (
                      <div key={m.id} className={`max-w-[78%] rounded-2xl p-3 text-sm leading-5 shadow-sm ${m.direction === "inbound" ? "bg-white border border-[#F3E6D3] ml-0" : "bg-[#1a1a1a] text-white ml-auto"}`}>
                        <div className="text-xs font-bold opacity-60 flex items-center gap-1">
                          {m.direction === "inbound" ? <User className="h-3 w-3" /> : <Send className="h-3 w-3" />}
                          {m.direction === "inbound" ? "Customer" : "Cognicart"} • {new Date(m.timestamp).toLocaleTimeString()}
                          {m.deterministic && <span className="ml-1 rounded-full bg-[#E6F7F1] px-1.5 py-0.5 text-[10px] font-bold text-[#0B9C74]">deterministic</span>}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap">{m.body}</div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] opacity-60"><Clock className="h-3 w-3" /> {m.status} • {m.businessPhone} → {m.customerPhone}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-3 py-2 border-t border-[#F3E6D3] flex items-center gap-2 text-xs text-[#6b6b6b]">
                  <Shield className="h-3 w-3" /> Every webhook is seller-identified before tool calls. Logs are per sellerId.
                </div>
              </div>
            </div>
          )}

          {tab === "simulator" && (
            <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
              <form onSubmit={handleSimulate} className="rounded-2xl bg-white border border-[#F3E6D3] p-6 space-y-4">
                <div className="text-sm font-bold flex items-center gap-2"><Play className="h-4 w-4 text-[#E85D26]" /> Simulate incoming WhatsApp</div>
                <p className="text-xs text-[#6b6b6b] leading-5">Customer sends to <span className="font-mono font-bold">{config?.businessPhone}</span>. We identify seller by <span className="font-mono">businessPhone → sellerId</span>, log inbound, return deterministic outbound and log it.</p>
                <label>
                  <span className="text-xs font-bold">Business phone (to)</span>
                  <input value={simBusinessPhone} onChange={(e) => setSimBusinessPhone(e.target.value)} placeholder={config?.businessPhone || ""} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm font-mono focus:border-[#0B9C74] outline-none" />
                </label>
                <label>
                  <span className="text-xs font-bold">Customer phone (from)</span>
                  <input value={simFrom} onChange={(e) => setSimFrom(e.target.value)} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
                </label>
                <label>
                  <span className="text-xs font-bold">Message body</span>
                  <textarea value={simBody} onChange={(e) => setSimBody(e.target.value)} rows={3} placeholder='Hi, is Elixir Glow Serum in stock?' className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none resize-none" />
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["Hi", "show me serums", "price of Cozy Knit Hoodie", "is Market Tote available?", "delivery info", "I want to order"].map((ex) => (
                    <button key={ex} type="button" onClick={() => setSimBody(ex)} className="rounded-full bg-[#FFF1DA] border border-[#F3E6D3] px-3 py-1 font-bold hover:bg-white">{ex}</button>
                  ))}
                </div>
                <button type="submit" disabled={simLoading} className="w-full rounded-full bg-[#0B9C74] px-6 py-3 text-sm font-bold text-white hover:bg-[#0a8a66] disabled:opacity-60 flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> {simLoading ? "Sending..." : "Send as customer"}
                </button>
                <div className="rounded-xl bg-[#FFFBF5] border border-[#F3E6D3] p-3 text-xs leading-5 text-[#6b6b6b]">
                  Success: customer can send a WhatsApp message and receive a response from the platform — deterministic before AI. Inbox will show both legs.
                </div>
              </form>

              <div className="rounded-2xl bg-[#1a1a1a] text-white p-6">
                <div className="text-sm font-bold">Flow</div>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-white/80 list-decimal pl-5">
                  <li>WhatsApp Cloud API → <span className="font-mono">POST /api/whatsapp/webhook</span></li>
                  <li>Webhook handler: <span className="font-bold text-white">identifySeller(businessPhone)</span></li>
                  <li>Log <span className="font-mono">inbound</span> • sellerId scoped</li>
                  <li>Deterministic reply via tenant tools: <span className="font-mono">searchProducts, checkStock, getBusinessInfo</span></li>
                  <li>Log <span className="font-mono">outbound</span> and send via Cloud API</li>
                </ol>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1a1a1a] hover:bg-[#FFF1DA]">
                  Open WhatsApp <ExternalLink className="h-4 w-4" />
                </a>
                <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-5 text-white/70">
                  Next: Phase 6 adds OpenAI tools. Deterministic handler will be replaced by AI that decides when to call those same tools.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-[#FFF1DA] border border-[#F3E6D3] p-4">
        <div className="text-sm font-bold">Phase 5 success</div>
        <p className="text-xs leading-5 text-[#5a5a5a] mt-1">A customer can send a WhatsApp message and receive a response from the platform — verified, seller-identified and logged. Use Simulator then check Inbox.</p>
      </div>
    </div>
  )
}
