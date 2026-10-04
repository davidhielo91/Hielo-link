import { Pencil, Plus, Trash2 } from "lucide-react"
import Section from "@/components/admin/Section"
import type { ProfileData } from "@/lib/validation"
import { getIcon, platforms as socialPlatforms } from "@/lib/socials"
import type { SocialForm } from "@/components/admin/types"

type SocialsSectionProps = {
  socials: ProfileData["socials"]
  form: SocialForm
  editingSocial: string | null
  onFormChange: (form: SocialForm) => void
  onAdd: () => void
  onCancel: () => void
  onEdit: (platform: string) => void
  onDelete: (platform: string) => void
}

export default function SocialsSection({ socials, form, editingSocial, onFormChange, onAdd, onCancel, onEdit, onDelete }: SocialsSectionProps) {
  return (
    <Section title="Redes Sociales">
      <div className="flex flex-wrap gap-2">
        {socials.map((social) => {
          const Icon = getIcon(social.platform)
          return (
            <div key={social.platform} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${editingSocial === social.platform ? "border-purple-500 bg-purple-500/10" : "border-zinc-800 bg-zinc-900"}`}>
              {Icon ? <Icon className="size-4 text-zinc-400" /> : <span className="size-4 rounded-full bg-zinc-700" />}
              <span className="text-sm capitalize">{social.platform}</span>
              <button onClick={() => onEdit(social.platform)} aria-label={`Editar ${social.platform}`} className="p-0.5 text-zinc-500 hover:text-purple-400"><Pencil className="size-3.5" /></button>
              <button onClick={() => onDelete(social.platform)} aria-label={`Eliminar ${social.platform}`} className="p-0.5 text-zinc-500 hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {editingSocial && <p className="text-xs text-purple-400">Editando red social</p>}
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1">
            <label htmlFor="social-platform" className="mb-1 block text-xs text-zinc-500">Plataforma</label>
            <select id="social-platform" name="socialPlatform" autoComplete="off" value={form.platform} onChange={(e) => onFormChange({ ...form, platform: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500">
              <option value="" className="bg-zinc-800">Seleccionar...</option>
              {socialPlatforms.map((platform) => <option key={platform.id} value={platform.id} className="bg-zinc-800">{platform.label}</option>)}
            </select>
          </div>
          <div className="flex-[2]">
            <label htmlFor="social-url" className="mb-1 block text-xs text-zinc-500">URL</label>
            <input id="social-url" name="socialUrl" type="url" autoComplete="url" placeholder="https://..." value={form.url} onChange={(e) => onFormChange({ ...form, url: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
          </div>
          <button onClick={onAdd} className="flex h-[38px] items-center gap-1 rounded-lg bg-purple-600 px-4 text-sm font-medium transition-colors hover:bg-purple-500"><Plus className="size-4" />{editingSocial ? "Actualizar" : "Agregar"}</button>
          {editingSocial && <button onClick={onCancel} className="flex h-[38px] items-center gap-1 rounded-lg border border-zinc-700 px-4 text-sm text-zinc-400 transition-colors hover:text-white">Cancelar</button>}
        </div>
      </div>
    </Section>
  )
}
