"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { ProfileData } from "@/lib/validation"
import Image from "next/image"
import { Plus, Trash2, Save, LogOut, Pencil } from "lucide-react"
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable"
import { presets } from "@/lib/presets"
import { fontNames } from "@/lib/fonts"
import { platforms as socialPlatforms, getIcon } from "@/lib/socials"
import AvatarUpload from "@/components/AvatarUpload"
import Section from "@/components/admin/Section"
import Field from "@/components/admin/Field"
import ThemeField from "@/components/admin/ThemeField"
import SortableLinkItem from "@/components/admin/SortableLinkItem"

const defaultData: ProfileData = {
  name: "", bio: "", avatar: null, calendlyUrl: null,
  theme: {
    bgFrom: "#7c3aed", bgVia: "#ec4899", bgTo: "#fb923c", bgImage: null, bgAnimated: false, fontHeading: "Inter", fontBody: "Inter",
    cardBg: "rgba(255,255,255,0.1)", cardBorder: "rgba(255,255,255,0.2)",
    cardBgHover: "rgba(255,255,255,0.2)", textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.7)", textMuted: "rgba(255,255,255,0.4)",
    ringColor: "rgba(255,255,255,0.2)", socialBg: "rgba(255,255,255,0.1)",
    socialColor: "rgba(255,255,255,0.7)", socialHoverBg: "rgba(255,255,255,0.2)",
    socialHoverColor: "#ffffff",
  },
  links: [],
  socials: [],
}

type LinkForm = { title: string; url: string }

export default function AdminPage() {
  const [data, setData] = useState<ProfileData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [newLink, setNewLink] = useState<LinkForm>({ title: "", url: "" })
  const [newSocial, setNewSocial] = useState({ platform: "", url: "" })
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [editingSocial, setEditingSocial] = useState<string | null>(null)
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwMessage, setPwMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [pwSaving, setPwSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const authRes = await fetch("/api/auth/me")
        if (!authRes.ok) {
          router.push("/admin/login")
          return
        }
        const res = await fetch("/api/data")
        if (!res.ok) throw new Error()
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setMessage({ type: "error", text: "Error al cargar datos" })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [router])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setMessage({ type: "ok", text: "Guardado correctamente" })
    } catch {
      setMessage({ type: "error", text: "Error al guardar" })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setData((prev) => {
      const oldIndex = prev.links.findIndex((l) => l.id === active.id)
      const newIndex = prev.links.findIndex((l) => l.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return { ...prev, links: arrayMove(prev.links, oldIndex, newIndex) }
    })
  }

  async function changePassword() {
    setPwMessage(null)
    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwMessage({ type: "error", text: "Completa todos los campos" })
      return
    }
    if (pwNew !== pwConfirm) {
      setPwMessage({ type: "error", text: "Las contraseñas nuevas no coinciden" })
      return
    }
    if (pwNew.length < 6) {
      setPwMessage({ type: "error", text: "Mínimo 6 caracteres" })
      return
    }
    setPwSaving(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
      })
      if (!res.ok) {
        const data = await res.json()
        setPwMessage({ type: "error", text: data.error || "Error al cambiar" })
        return
      }
      setPwMessage({ type: "ok", text: "Contraseña cambiada correctamente" })
      setPwCurrent("")
      setPwNew("")
      setPwConfirm("")
    } catch {
      setPwMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setPwSaving(false)
    }
  }

  function startEditLink(id: string) {
    const link = data.links.find((l) => l.id === id)
    if (!link) return
    setEditingLink(id)
    setNewLink({ title: link.title, url: link.url })
    setShowLinkForm(true)
  }

  function addLink() {
    if (!newLink.title || !newLink.url) return

    if (editingLink) {
      setData((prev) => ({
        ...prev,
        links: prev.links.map((l) =>
          l.id === editingLink ? { ...l, ...newLink } : l
        ),
      }))
    } else {
      const id = `link-${Date.now()}`
      setData((prev) => ({
        ...prev,
        links: [...prev.links, { id, ...newLink }],
      }))
    }

    cancelLinkForm()
  }

  function cancelLinkForm() {
    setNewLink({ title: "", url: "" })
    setShowLinkForm(false)
    setEditingLink(null)
  }

  function deleteLink(id: string) {
    if (!window.confirm("¿Eliminar este enlace?")) return
    if (editingLink === id) cancelLinkForm()
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }))
  }

  function startEditSocial(platform: string) {
    const social = data.socials.find((s) => s.platform === platform)
    if (!social) return
    setEditingSocial(platform)
    setNewSocial({ platform: social.platform, url: social.url })
  }

  function addSocial() {
    if (!newSocial.platform || !newSocial.url) return

    if (editingSocial) {
      setData((prev) => ({
        ...prev,
        socials: prev.socials.map((s) =>
          s.platform === editingSocial ? { ...newSocial } : s
        ),
      }))
    } else {
      setData((prev) => ({
        ...prev,
        socials: [...prev.socials, newSocial],
      }))
    }

    cancelSocialForm()
  }

  function cancelSocialForm() {
    setNewSocial({ platform: "", url: "" })
    setEditingSocial(null)
  }

  function deleteSocial(platform: string) {
    if (!window.confirm(`¿Eliminar ${platform}?`)) return
    if (editingSocial === platform) cancelSocialForm()
    setData((prev) => ({
      ...prev,
      socials: prev.socials.filter((s) => s.platform !== platform),
    }))
  }

  function setThemeField(key: keyof ProfileData["theme"], value: string) {
    setData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value as never },
    }))
  }

  function setProfileField(key: "name" | "bio" | "avatar" | "calendlyUrl", value: string | null) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-zinc-500 border-t-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh px-4 py-8" style={{ color: "var(--text-primary)" }}>
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex flex-wrap items-center gap-3">
            {message && (
              <span role="status" aria-live="polite" className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                {message.text}
              </span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--text-muted)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)" }}
            >
              <LogOut className="size-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Profile */}
        <Section title="Perfil">
          <Field label="Nombre" value={data.name} onChange={(v) => setProfileField("name", v)} />
          <Field label="Bio" value={data.bio} onChange={(v) => setProfileField("bio", v)} />
          <AvatarUpload value={data.avatar} onChange={(v) => setProfileField("avatar", v)} />
          <Field label="Link de agenda (Calendly / Cal.com)" value={data.calendlyUrl ?? ""} onChange={(v) => setProfileField("calendlyUrl", v || null)} placeholder="https://calendly.com/tuusuario" />
        </Section>

        {/* Links */}
        <Section title="Enlaces">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {data.links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    isEditing={editingLink === link.id}
                    onEdit={startEditLink}
                    onDelete={deleteLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {showLinkForm ? (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              {editingLink && (
                <p className="text-xs text-purple-400">Editando enlace</p>
              )}
              <input
                type="text" placeholder="Título" value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
              />
              <input
                type="url" placeholder="URL" value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
              />

              <div className="flex gap-2">
                <button onClick={addLink} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500">
                  {editingLink ? "Actualizar" : "Agregar"}
                </button>
                <button onClick={cancelLinkForm} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowLinkForm(true)} className="mt-3 flex items-center gap-2 text-sm text-purple-400 transition-colors hover:text-purple-300">
              <Plus className="size-4" />
              Agregar enlace
            </button>
          )}
        </Section>

        {/* Socials */}
        <Section title="Redes Sociales">
          <div className="flex flex-wrap gap-2">
            {data.socials.map((social) => {
              const Icon = getIcon(social.platform)
              return (
              <div
                key={social.platform}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                  editingSocial === social.platform
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {Icon ? <Icon className="size-4 text-zinc-400" /> : <span className="size-4 rounded-full bg-zinc-700" />}
                <span className="text-sm capitalize">{social.platform}</span>
                <button onClick={() => startEditSocial(social.platform)} className="p-0.5 text-zinc-500 hover:text-purple-400">
                  <Pencil className="size-3.5" />
                </button>
                <button onClick={() => deleteSocial(social.platform)} className="p-0.5 text-zinc-500 hover:text-red-400">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              )
            })}
          </div>
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            {editingSocial && (
              <p className="text-xs text-purple-400">Editando red social</p>
            )}
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-zinc-500">Plataforma</label>
                <select
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
                >
                  <option value="" className="bg-zinc-800">Seleccionar...</option>
                  {socialPlatforms.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-800">{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="mb-1 block text-xs text-zinc-500">URL</label>
                <input
                  type="url" placeholder="https://..." value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
                />
              </div>
              <button onClick={addSocial} className="flex h-[38px] items-center gap-1 rounded-lg bg-purple-600 px-4 text-sm font-medium transition-colors hover:bg-purple-500">
                <Plus className="size-4" />
                {editingSocial ? "Actualizar" : "Agregar"}
              </button>
              {editingSocial && (
                <button onClick={cancelSocialForm} className="flex h-[38px] items-center gap-1 rounded-lg border border-zinc-700 px-4 text-sm text-zinc-400 transition-colors hover:text-white">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* Theme Presets */}
        <Section title="Temas Rápidos">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setData((prev) => ({ ...prev, theme: preset.theme }))}
                className="group relative overflow-hidden rounded-xl border border-zinc-700 p-3 text-left transition-all hover:border-purple-500"
              >
                <div
                  className="mb-2 h-10 w-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${preset.theme.bgFrom}, ${preset.theme.bgVia}, ${preset.theme.bgTo})`,
                  }}
                />
                <p className="text-xs font-medium text-zinc-300 group-hover:text-white">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* Theme */}
        <Section title="Tema">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ThemeField label="Fondo Desde" value={data.theme.bgFrom} onChange={(v) => setThemeField("bgFrom", v)} />
            <ThemeField label="Fondo Medio" value={data.theme.bgVia} onChange={(v) => setThemeField("bgVia", v)} />
            <ThemeField label="Fondo Hasta" value={data.theme.bgTo} onChange={(v) => setThemeField("bgTo", v)} />
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Imagen de Fondo</label>
              <input
                type="text" placeholder="https://..." value={data.theme.bgImage ?? ""}
                onChange={(e) => setThemeField("bgImage", e.target.value || "")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
              />
              {data.theme.bgImage && (
                <Image
                  src={data.theme.bgImage}
                  alt="preview"
                  width={672}
                  height={64}
                  className="mt-2 h-16 w-full rounded-lg object-cover"
                  unoptimized
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={data.theme.bgAnimated}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, bgAnimated: e.target.checked },
                    }))
                  }
                  disabled={!!data.theme.bgImage}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-disabled:opacity-40" />
              </label>
              <span className="text-xs text-zinc-500">
                Fondo animado
                {data.theme.bgImage && <span className="ml-1 text-zinc-600">(no compatible con imagen)</span>}
              </span>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Tipografía (Títulos)</label>
              <select
                value={data.theme.fontHeading}
                onChange={(e) => setThemeField("fontHeading", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
              >
                {fontNames.map((name) => (
                  <option key={name} value={name} className="bg-zinc-800">{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Tipografía (Cuerpo)</label>
              <select
                value={data.theme.fontBody}
                onChange={(e) => setThemeField("fontBody", e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
              >
                {fontNames.map((name) => (
                  <option key={name} value={name} className="bg-zinc-800">{name}</option>
                ))}
              </select>
            </div>
            <ThemeField label="Texto Principal" value={data.theme.textPrimary} onChange={(v) => setThemeField("textPrimary", v)} />
            <ThemeField label="Texto Secundario" value={data.theme.textSecondary} onChange={(v) => setThemeField("textSecondary", v)} />
            <ThemeField label="Texto Tenue" value={data.theme.textMuted} onChange={(v) => setThemeField("textMuted", v)} />
            <ThemeField label="Fondo Tarjeta" value={data.theme.cardBg} onChange={(v) => setThemeField("cardBg", v)} />
            <ThemeField label="Borde Tarjeta" value={data.theme.cardBorder} onChange={(v) => setThemeField("cardBorder", v)} />
            <ThemeField label="Fondo Tarjeta Hover" value={data.theme.cardBgHover} onChange={(v) => setThemeField("cardBgHover", v)} />
            <ThemeField label="Anillo Avatar" value={data.theme.ringColor} onChange={(v) => setThemeField("ringColor", v)} />
            <ThemeField label="Fondo Social" value={data.theme.socialBg} onChange={(v) => setThemeField("socialBg", v)} />
            <ThemeField label="Color Social" value={data.theme.socialColor} onChange={(v) => setThemeField("socialColor", v)} />
            <ThemeField label="Fondo Social Hover" value={data.theme.socialHoverBg} onChange={(v) => setThemeField("socialHoverBg", v)} />
            <ThemeField label="Color Social Hover" value={data.theme.socialHoverColor} onChange={(v) => setThemeField("socialHoverColor", v)} />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl">
            <p className="mb-2 text-xs text-zinc-500">Vista previa del fondo:</p>
            <div
              className="h-20 w-full rounded-xl"
              style={{ background: `linear-gradient(135deg, ${data.theme.bgFrom}, ${data.theme.bgVia}, ${data.theme.bgTo})` }}
            />
          </div>
        </Section>

        {/* Security */}
        <Section title="Seguridad">
          <div className="flex flex-col gap-3">
            {pwMessage && (
              <p className={`text-sm ${pwMessage.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                {pwMessage.text}
              </p>
            )}
            <input
              type="password" placeholder="Contraseña actual" value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
            />
            <input
              type="password" placeholder="Nueva contraseña" value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
            />
            <input
              type="password" placeholder="Confirmar nueva contraseña" value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
            />
            <button
              onClick={changePassword}
              disabled={pwSaving}
              className="self-start rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
            >
              {pwSaving ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </div>
        </Section>

        {/* Bottom Save */}
        <div className="flex justify-center">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3 font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            <Save className="size-5" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}


