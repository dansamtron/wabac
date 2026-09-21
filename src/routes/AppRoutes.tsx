import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import Dashboard from "../pages/dashboard/Dashboard"
import Products from "../pages/products/Products"
import CreateProduct from "../pages/products/CreateProduct"
import EditProduct from "../pages/products/EditProduct"
import Orders from "../pages/orders/Orders"
import Customers from "../pages/customers/Customers"
import Settings from "../pages/dashboard/Settings"
import WhatsAppPage from "../pages/whatsapp/WhatsApp"
import Storefront from "../pages/storefront/Storefront"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { ProtectedRoute } from "./ProtectedRoute"

function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">404</h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">Page not found.</p>
        <a href="/" className="mt-4 inline-flex rounded-full bg-[#0B9C74] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0a8a66]">Go home</a>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/store" element={<Storefront />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/products" element={<Products />} />
        <Route path="/dashboard/products/new" element={<CreateProduct />} />
        <Route path="/dashboard/products/:id/edit" element={<EditProduct />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/customers" element={<Customers />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/whatsapp" element={<WhatsAppPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
