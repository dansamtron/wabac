import { Outlet } from "react-router-dom"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Outlet />
    </div>
  )
}
