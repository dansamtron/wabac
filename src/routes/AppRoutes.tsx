import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Future routes: */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/marketplace" element={<Storefront />} /> */}
    </Routes>
  )
}
