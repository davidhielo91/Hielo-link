import { redirect } from "next/navigation"
import { Suspense } from "react"
import AdminPanel from "@/components/admin/AdminPanel"
import { verifySession } from "@/lib/auth"

async function AuthenticatedAdminPanel() {
  if (!(await verifySession())) {
    redirect("/admin/login")
  }

  return <AdminPanel />
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AuthenticatedAdminPanel />
    </Suspense>
  )
}
