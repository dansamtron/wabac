export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

export function isNigerianPhone(v: string) {
  const d = v.replace(/\D/g, "")
  return d.length >= 10 && d.length <= 15
}

export function isStrongPassword(v: string) {
  return v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v)
}

export function sanitize(str: string, max = 500) {
  return str.trim().slice(0, max).replace(/[<>]/g, "")
}

export function validateBusinessName(v: string) {
  const s = sanitize(v, 80)
  if (s.length < 2) throw new Error("Business name must be at least 2 characters")
  return s
}

export function validateProductPayload(p: { name: string; description: string; price: number; stock: number; images: string[] }) {
  const name = sanitize(p.name, 80)
  if (name.length < 2) throw new Error("Product name too short")
  const desc = sanitize(p.description, 2000)
  if (desc.length < 10) throw new Error("Description too short (10+ chars)")
  if (!Number.isFinite(p.price) || p.price < 100 || p.price > 5000000) throw new Error("Price must be ₦100 - ₦5,000,000")
  if (!Number.isInteger(p.stock) || p.stock < 0 || p.stock > 100000) throw new Error("Stock must be 0 - 100,000")
  if (!Array.isArray(p.images) || p.images.length === 0) throw new Error("At least one image required")
  if (p.images.length > 5) throw new Error("Max 5 images")
  return { name, description: desc, price: Math.round(p.price), stock: p.stock, images: p.images }
}

export function validateCustomer(p: { name: string; phone: string; address?: string }) {
  const name = sanitize(p.name, 80)
  if (name.length < 2) throw new Error("Customer name too short")
  if (!isNigerianPhone(p.phone)) throw new Error("Invalid phone number")
  const address = p.address ? sanitize(p.address, 200) : ""
  if (address && address.length < 8) throw new Error("Address too short")
  return { name, phone: p.phone.trim(), address }
}

export function validateOrderItems(items: Array<{ productId: string; quantity: number }>) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("No items")
  if (items.length > 20) throw new Error("Max 20 items per order")
  for (const it of items) {
    if (!it.productId || typeof it.productId !== "string") throw new Error("Invalid productId")
    if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 100) throw new Error("Quantity must be 1-100")
  }
  return items
}

export function clampRequestSize(json: string, limitKb = 500) {
  const sizeKb = new Blob([json]).size / 1024
  if (sizeKb > limitKb) throw new Error(`Payload too large (${Math.round(sizeKb)}KB > ${limitKb}KB)`)
}
