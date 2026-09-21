import { createContext, useContext, useState, type ReactNode } from "react"
import type { Business } from "../types/business"

type BusinessContextValue = {
  business: Business | null
  setBusiness: (b: Business | null) => void
}

const BusinessContext = createContext<BusinessContextValue | null>(null)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null)
  return <BusinessContext.Provider value={{ business, setBusiness }}>{children}</BusinessContext.Provider>
}

export function useBusiness() {
  const ctx = useContext(BusinessContext)
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider")
  return ctx
}
