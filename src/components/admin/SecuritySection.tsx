import Section from "@/components/admin/Section"
import type { AdminMessage } from "@/components/admin/types"

type SecuritySectionProps = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  message: AdminMessage | null
  saving: boolean
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: () => void
}

export default function SecuritySection({ currentPassword, newPassword, confirmPassword, message, saving, onCurrentPasswordChange, onNewPasswordChange, onConfirmPasswordChange, onSubmit }: SecuritySectionProps) {
  return (
    <Section title="Seguridad">
      <div className="flex flex-col gap-3">
        {message && <p aria-live="polite" className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>{message.text}</p>}
        <label htmlFor="current-password" className="sr-only">Contraseña actual</label>
        <input id="current-password" name="currentPassword" type="password" autoComplete="current-password" placeholder="Contraseña actual" value={currentPassword} onChange={(e) => onCurrentPasswordChange(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
        <label htmlFor="new-password" className="sr-only">Nueva contraseña</label>
        <input id="new-password" name="newPassword" type="password" autoComplete="new-password" placeholder="Nueva contraseña (mínimo 6 caracteres)" value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
        <label htmlFor="confirm-password" className="sr-only">Confirmar nueva contraseña</label>
        <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirmar nueva contraseña" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
        <button onClick={onSubmit} disabled={saving} className="self-start rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50">{saving ? "Cambiando..." : "Cambiar contraseña"}</button>
      </div>
    </Section>
  )
}
