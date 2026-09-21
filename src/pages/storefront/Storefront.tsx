import { Link } from "react-router-dom"

export default function Storefront() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-4 py-10">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">Public Storefront</h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">SEO pages for /store/:seller will be built in Phase 9. For now, sellers manage products in the dashboard.</p>
        <Link to="/dashboard/products" className="mt-4 inline-flex rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">
          Go to products
        </Link>
      </div>
    </div>
  )
}
