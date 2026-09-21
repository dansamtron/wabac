import api from "./api"
import type { AuthResponse, LoginPayload, RegisterPayload, Seller } from "../types/auth"

// Local mock fallback when backend is not reachable
const MOCK_KEY = "cognicart_mock_sellers"
const TOKEN_KEY = "cognicart_token"
const SELLER_KEY = "cognicart_seller"

function getMockSellers(): Array<Seller & { password: string }> {
  try {
    return JSON.parse(localStorage.getItem(MOCK_KEY) || "[]")
  } catch {
    return []
  }
}

function saveMockSellers(sellers: Array<Seller & { password: string }>) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(sellers))
}

function mockToken() {
  return "mock_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function ensureAdminSeed() {
  const sellers = getMockSellers()
  let mutated = false
  // Ensure platform admin exists
  const adminEmail = "admin@cognicart.ng"
  if (!sellers.find((s) => s.email.toLowerCase() === adminEmail)) {
    sellers.push({
      id: "seller_admin",
      businessName: "Cognicart Platform",
      email: adminEmail,
      phone: "+2348000000000",
      password: "Admin123!",
      role: "admin",
      isActive: true,
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    } as Seller & { password: string })
    mutated = true
  }
  // Ensure owner exists
  const ownerEmail = "owner@cognicart.ng"
  if (!sellers.find((s) => s.email.toLowerCase() === ownerEmail)) {
    sellers.push({
      id: "seller_owner",
      businessName: "Cognicart Owner",
      email: ownerEmail,
      phone: "+2348000000001",
      password: "Owner123!",
      role: "platform_owner",
      isActive: true,
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    } as Seller & { password: string })
    mutated = true
  }
  if (mutated) saveMockSellers(sellers)
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", payload)
      return data
    } catch {
      // Mock fallback
      ensureAdminSeed()
      const sellers = getMockSellers()
      if (sellers.find((s) => s.email.toLowerCase() === payload.email.toLowerCase())) {
        throw new Error("Email already registered")
      }
      const isAdminEmail = payload.email.toLowerCase() === "admin@cognicart.ng" || payload.email.toLowerCase() === "owner@cognicart.ng"
      const seller: Seller & { password: string } = {
        id: "seller_" + Date.now().toString(36),
        businessName: payload.businessName,
        email: payload.email.toLowerCase(),
        phone: payload.phone,
        password: payload.password,
        role: isAdminEmail ? "admin" : "seller",
        isActive: true,
        createdAt: new Date().toISOString(),
      }
      sellers.push(seller)
      saveMockSellers(sellers)
      const token = mockToken()
      const { password: _pw, ...rest } = seller
      return { token, seller: rest }
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload)
      return data
    } catch {
      ensureAdminSeed()
      const sellers = getMockSellers()
      const found = sellers.find((s) => s.email.toLowerCase() === payload.email.toLowerCase() && s.password === payload.password)
      if (!found) throw new Error("Invalid email or password")
      if (found.isActive === false) throw new Error("Account suspended. Contact platform support.")
      const token = mockToken()
      const { password: _pw, ...rest } = found
      // Ensure role defaults to seller if missing
      if (!rest.role) rest.role = rest.email.includes("admin") || rest.email.includes("owner") ? "admin" : "seller"
      return { token, seller: rest }
    }
  },

  async me(token?: string): Promise<Seller | null> {
    const t = token || localStorage.getItem(TOKEN_KEY)
    if (!t) return null
    try {
      const { data } = await api.get<Seller>("/auth/me")
      return data
    } catch {
      const raw = localStorage.getItem(SELLER_KEY)
      if (raw) {
        try {
          return JSON.parse(raw) as Seller
        } catch {
          return null
        }
      }
      return null
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SELLER_KEY)
  },

  persist(token: string, seller: Seller) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(SELLER_KEY, JSON.stringify(seller))
  },

  getStoredSeller(): Seller | null {
    const raw = localStorage.getItem(SELLER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
}
