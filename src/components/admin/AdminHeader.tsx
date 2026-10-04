import { LogOut, Save } from "lucide-react"
import type { AdminMessage } from "@/components/admin/types"

type AdminHeaderProps = {
  message: AdminMessage | null
  saving: boolean
  onSave: () => void
  onLogout: () => void
}

export default function AdminHeader({ message, saving, onSave, onLogout }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="flex flex-wrap items-center gap-3">
        {message && (
          <span role="status" aria-live="polite" className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {message.text}
          </span>
        )}
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50">
          <Save className="size-4" />
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors"
          style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--text-muted)" }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)" }}
        >
          <LogOut className="size-4" />
          Salir
        </button>
      </div>
    </div>
  )
}
