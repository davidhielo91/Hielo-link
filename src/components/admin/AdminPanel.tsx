"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { type DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import type { ProfileData } from "@/lib/validation"
import AdminHeader from "@/components/admin/AdminHeader"
import LinksSection from "@/components/admin/LinksSection"
import ProfileSection from "@/components/admin/ProfileSection"
import SecuritySection from "@/components/admin/SecuritySection"
import SocialsSection from "@/components/admin/SocialsSection"
import ThemeSection from "@/components/admin/ThemeSection"
import type { AdminMessage, LinkForm, ProfileField, SocialForm, ThemeFieldKey } from "@/components/admin/types"

const defaultData: ProfileData = {
  name: "", bio: "", avatar: null, calendlyUrl: null,
  theme: {
    bgFrom: "#7c3aed", bgVia: "#ec4899", bgTo: "#fb923c", bgImage: null, bgAnimated: false, fontHeading: "Inter", fontBody: "Inter",
    cardBg: "rgba(255,255,255,0.1)", cardBorder: "rgba(255,255,255,0.2)", cardBgHover: "rgba(255,255,255,0.2)", textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.7)", textMuted: "rgba(255,255,255,0.4)", ringColor: "rgba(255,255,255,0.2)", socialBg: "rgba(255,255,255,0.1)",
    socialColor: "rgba(255,255,255,0.7)", socialHoverBg: "rgba(255,255,255,0.2)", socialHoverColor: "#ffffff",
  },
  links: [], socials: [],
}

export default function AdminPanel() {
  const [data, setData] = useState<ProfileData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<AdminMessage | null>(null)
  const [newLink, setNewLink] = useState<LinkForm>({ title: "", url: "" })
  const [newSocial, setNewSocial] = useState<SocialForm>({ platform: "", url: "" })
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [editingSocial, setEditingSocial] = useState<string | null>(null)
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwMessage, setPwMessage] = useState<AdminMessage | null>(null)
  const [pwSaving, setPwSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
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
  }, [])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/data", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setData((prev) => {
      const oldIndex = prev.links.findIndex((link) => link.id === active.id)
      const newIndex = prev.links.findIndex((link) => link.id === over.id)
      return oldIndex === -1 || newIndex === -1 ? prev : { ...prev, links: arrayMove(prev.links, oldIndex, newIndex) }
    })
  }

  async function changePassword() {
    setPwMessage(null)
    if (!pwCurrent || !pwNew || !pwConfirm) return setPwMessage({ type: "error", text: "Completa todos los campos" })
    if (pwNew !== pwConfirm) return setPwMessage({ type: "error", text: "Las contraseñas nuevas no coinciden" })
    if (pwNew.length < 12) return setPwMessage({ type: "error", text: "La nueva contraseña debe tener al menos 12 caracteres" })
    setPwSaving(true)
    try {
      const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew, confirmPassword: pwConfirm }) })
      if (!res.ok) {
        const response = await res.json()
        setPwMessage({ type: "error", text: response.error || "Error al cambiar" })
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

  function cancelLinkForm() {
    setNewLink({ title: "", url: "" })
    setShowLinkForm(false)
    setEditingLink(null)
  }

  function startEditLink(id: string) {
    const link = data.links.find((item) => item.id === id)
    if (!link) return
    setEditingLink(id)
    setNewLink({ title: link.title, url: link.url })
    setShowLinkForm(true)
  }

  function addLink() {
    if (!newLink.title || !newLink.url) return
    setData((prev) => ({ ...prev, links: editingLink ? prev.links.map((link) => link.id === editingLink ? { ...link, ...newLink } : link) : [...prev.links, { id: `link-${Date.now()}`, ...newLink }] }))
    cancelLinkForm()
  }

  function deleteLink(id: string) {
    if (!window.confirm("¿Eliminar este enlace?")) return
    if (editingLink === id) cancelLinkForm()
    setData((prev) => ({ ...prev, links: prev.links.filter((link) => link.id !== id) }))
  }

  function cancelSocialForm() {
    setNewSocial({ platform: "", url: "" })
    setEditingSocial(null)
  }

  function startEditSocial(platform: string) {
    const social = data.socials.find((item) => item.platform === platform)
    if (!social) return
    setEditingSocial(platform)
    setNewSocial({ platform: social.platform, url: social.url })
  }

  function addSocial() {
    if (!newSocial.platform || !newSocial.url) return
    setData((prev) => ({ ...prev, socials: editingSocial ? prev.socials.map((social) => social.platform === editingSocial ? { ...newSocial } : social) : [...prev.socials, newSocial] }))
    cancelSocialForm()
  }

  function deleteSocial(platform: string) {
    if (!window.confirm(`¿Eliminar ${platform}?`)) return
    if (editingSocial === platform) cancelSocialForm()
    setData((prev) => ({ ...prev, socials: prev.socials.filter((social) => social.platform !== platform) }))
  }

  function setThemeField<K extends ThemeFieldKey>(key: K, value: ProfileData["theme"][K]) {
    setData((prev) => ({ ...prev, theme: { ...prev.theme, [key]: value } }))
  }

  function setProfileField(key: ProfileField, value: string | null) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) return <div className="flex min-h-dvh items-center justify-center"><div className="size-8 animate-spin rounded-full border-2 border-zinc-500 border-t-purple-400" /></div>

  return (
    <div className="min-h-dvh px-4 py-8" style={{ color: "var(--text-primary)" }}>
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <AdminHeader message={message} saving={saving} onSave={save} onLogout={logout} />
        <ProfileSection data={data} onFieldChange={setProfileField} />
        <LinksSection links={data.links} form={newLink} showForm={showLinkForm} editingLink={editingLink} onDragEnd={handleDragEnd} onFormChange={setNewLink} onShowForm={() => setShowLinkForm(true)} onAdd={addLink} onCancel={cancelLinkForm} onEdit={startEditLink} onDelete={deleteLink} />
        <SocialsSection socials={data.socials} form={newSocial} editingSocial={editingSocial} onFormChange={setNewSocial} onAdd={addSocial} onCancel={cancelSocialForm} onEdit={startEditSocial} onDelete={deleteSocial} />
        <ThemeSection theme={data.theme} onPresetChange={(theme) => setData((prev) => ({ ...prev, theme }))} onFieldChange={setThemeField} />
        <SecuritySection currentPassword={pwCurrent} newPassword={pwNew} confirmPassword={pwConfirm} message={pwMessage} saving={pwSaving} onCurrentPasswordChange={setPwCurrent} onNewPasswordChange={setPwNew} onConfirmPasswordChange={setPwConfirm} onSubmit={changePassword} />
        <div className="flex justify-center"><button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3 font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"><Save className="size-5" />{saving ? "Guardando..." : "Guardar Cambios"}</button></div>
      </div>
    </div>
  )
}
