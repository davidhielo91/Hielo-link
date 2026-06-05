"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { ProfileData } from "@/lib/storage"
import { ExternalLink, Plus, Trash2, Save, LogOut, GripVertical } from "lucide-react"

const defaultData: ProfileData = {
  name: "", bio: "", avatar: null,
  theme: {
    bgFrom: "#7c3aed", bgVia: "#ec4899", bgTo: "#fb923c",
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

type LinkForm = { title: string; url: string; icon: string }

export default function AdminPage() {
  const [data, setData] = useState<ProfileData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)
  const [newLink, setNewLink] = useState<LinkForm>({ title: "", url: "", icon: "" })
  const [newSocial, setNewSocial] = useState({ platform: "", url: "" })
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me")
      if (!authRes.ok) {
        router.push("/admin/login")
        return
      }
      const res = await fetch("/api/data")
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
    } catch {
      setMessage({ type: "error", text: "Error al cargar datos" })
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

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

  function addLink() {
    if (!newLink.title || !newLink.url) return
    const id = `link-${Date.now()}`
    setData((prev) => ({
      ...prev,
      links: [...prev.links, { id, ...newLink }],
    }))
    setNewLink({ title: "", url: "", icon: "" })
    setShowLinkForm(false)
  }

  function deleteLink(id: string) {
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }))
  }

  function addSocial() {
    if (!newSocial.platform || !newSocial.url) return
    setData((prev) => ({
      ...prev,
      socials: [...prev.socials, newSocial],
    }))
    setNewSocial({ platform: "", url: "" })
  }

  function deleteSocial(platform: string) {
    setData((prev) => ({
      ...prev,
      socials: prev.socials.filter((s) => s.platform !== platform),
    }))
  }

  function setThemeField(key: keyof ProfileData["theme"], value: string) {
    setData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }))
  }

  function setProfileField(key: "name" | "bio" | "avatar", value: string) {
    setData((prev) => ({ ...prev, [key]: value || null }))
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-950">
        <div className="size-8 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-zinc-950 px-4 py-8 text-zinc-100">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            {message && (
              <span className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
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
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
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
          <Field label="URL de Avatar" value={data.avatar ?? ""} onChange={(v) => setProfileField("avatar", v)} placeholder="https://..." />
        </Section>

        {/* Links */}
        <Section title="Enlaces">
          <div className="flex flex-col gap-2">
            {data.links.map((link) => (
              <div key={link.id} className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                <GripVertical className="size-4 shrink-0 text-zinc-600" />
                <span className="flex-1 truncate">
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.title}
                </span>
                <span className="hidden truncate text-sm text-zinc-500 sm:block">{link.url}</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-1 text-zinc-500 hover:text-white">
                  <ExternalLink className="size-4" />
                </a>
                <button onClick={() => deleteLink(link.id)} className="shrink-0 p-1 text-zinc-500 hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {showLinkForm ? (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <input
                type="text" placeholder="Título" value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
              />
              <input
                type="url" placeholder="URL" value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
              />
              <input
                type="text" placeholder="Icono (emoji)" value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
                maxLength={2}
              />
              <div className="flex gap-2">
                <button onClick={addLink} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500">
                  Agregar
                </button>
                <button onClick={() => setShowLinkForm(false)} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white">
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
            {data.socials.map((social) => (
              <div key={social.platform} className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
                <span className="text-sm capitalize">{social.platform}</span>
                <button onClick={() => deleteSocial(social.platform)} className="p-0.5 text-zinc-500 hover:text-red-400">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-zinc-500">Plataforma</label>
              <input
                type="text" placeholder="youtube, twitter..." value={newSocial.platform}
                onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex-[2]">
              <label className="mb-1 block text-xs text-zinc-500">URL</label>
              <input
                type="url" placeholder="https://..." value={newSocial.url}
                onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
              />
            </div>
            <button onClick={addSocial} className="flex h-[38px] items-center gap-1 rounded-lg bg-purple-600 px-4 text-sm font-medium transition-colors hover:bg-purple-500">
              <Plus className="size-4" />
              Agregar
            </button>
          </div>
        </Section>

        {/* Theme */}
        <Section title="Tema">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ThemeField label="Fondo Desde" value={data.theme.bgFrom} onChange={(v) => setThemeField("bgFrom", v)} />
            <ThemeField label="Fondo Medio" value={data.theme.bgVia} onChange={(v) => setThemeField("bgVia", v)} />
            <ThemeField label="Fondo Hasta" value={data.theme.bgTo} onChange={(v) => setThemeField("bgTo", v)} />
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-purple-500"
      />
    </div>
  )
}

function ThemeField({
  label, value, onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const isHex = value.startsWith("#")
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus:border-purple-500"
        />
      </div>
    </div>
  )
}
