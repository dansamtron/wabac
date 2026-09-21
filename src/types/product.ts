export type Product = {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  currency: string
  stock: number
  category: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateProductPayload = {
  name: string
  description: string
  price: number
  currency?: string
  stock: number
  category: string
  images: string[]
  isActive: boolean
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export const PRODUCT_CATEGORIES = [
  "Beauty",
  "Fashion",
  "Food",
  "Home",
  "Electronics",
  "Other",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
