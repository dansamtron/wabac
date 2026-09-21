import { useState } from "react"
import { useAuth } from "../../context/AuthContext"

export default function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    businessName: user?.businessName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "",
    description: "",
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Business settings</h1>
        <p className="text-sm text-[#6b6b6b]">Phase 2 business profile. WhatsApp connection comes in Phase 5.</p>
      </div>

      {saved && <div className="rounded-xl bg-[#E6F7F1] border border-[#0B9C74]/20 px-3 py-2.5 text-sm font-medium text-[#0B9C74]">Settings saved locally. Backend sync will be added.</div>}

      <form onSubmit={handleSave} className="rounded-2xl bg-white border border-[#F3E6D3] p-6 space-y-4">
        <label className="block">
          <span className="text-xs font-bold">Business name</span>
          <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-bold">Email</span>
          <input value={form.email} readOnly className="mt-1 w-full rounded-xl border border-[#F3E6D3] bg-[#FFFBF5] px-3 py-2.5 text-sm text-[#6b6b6b]" />
        </label>
        <label className="block">
          <span className="text-xs font-bold">Phone</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-bold">Location</span>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-bold">Description</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What do you sell?" className="mt-1 w-full rounded-xl border border-[#F3E6D3] px-3 py-2.5 text-sm focus:border-[#0B9C74] outline-none resize-none" />
        </label>
        <button type="submit" className="rounded-full bg-[#0B9C74] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">Save settings</button>
      </form>
    </div>
  )
}
