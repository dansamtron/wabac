export type Seller = {
  id: string
  businessName: string
  email: string
  phone?: string
  createdAt: string
}

export type AuthUser = Seller

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  businessName: string
  email: string
  password: string
  phone?: string
}

export type AuthResponse = {
  token: string
  seller: Seller
}

export type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
