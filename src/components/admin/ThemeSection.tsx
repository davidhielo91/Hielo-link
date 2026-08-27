import Image from "next/image"
import { presets } from "@/lib/presets"
import { fontNames } from "@/lib/fonts"
import Section from "@/components/admin/Section"
import ThemeField from "@/components/admin/ThemeField"
import type { ProfileData } from "@/lib/validation"
import type { ThemeFieldKey } from "@/components/admin/types"

type ThemeSectionProps = {
  theme: ProfileData["theme"]
  onPresetChange: (theme: ProfileData["theme"]) => void
  onFieldChange: <K extends ThemeFieldKey>(key: K, value: ProfileData["theme"][K]) => void
}

export default function ThemeSection({ theme, onPresetChange, onFieldChange }: ThemeSectionProps) {
  return (
    <>
      <Section title="Temas Rápidos">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {presets.map((preset) => <button key={preset.name} onClick={() => onPresetChange(preset.theme)} className="group relative overflow-hidden rounded-xl border border-zinc-700 p-3 text-left transition-all hover:border-purple-500"><div className="mb-2 h-10 w-full rounded-lg" style={{ background: `linear-gradient(135deg, ${preset.theme.bgFrom}, ${preset.theme.bgVia}, ${preset.theme.bgTo})` }} /><p className="text-xs font-medium text-zinc-300 group-hover:text-white">{preset.name}</p></button>)}
        </div>
      </Section>
      <Section title="Tema">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ThemeField id="bg-from" label="Fondo Desde" value={theme.bgFrom} onChange={(value) => onFieldChange("bgFrom", value)} />
          <ThemeField id="bg-via" label="Fondo Medio" value={theme.bgVia} onChange={(value) => onFieldChange("bgVia", value)} />
          <ThemeField id="bg-to" label="Fondo Hasta" value={theme.bgTo} onChange={(value) => onFieldChange("bgTo", value)} />
          <div>
            <label htmlFor="background-image" className="mb-1 block text-xs text-zinc-500">Imagen de Fondo</label>
            <input id="background-image" name="backgroundImage" type="url" autoComplete="url" placeholder="https://..." value={theme.bgImage ?? ""} onChange={(e) => onFieldChange("bgImage", e.target.value || null)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
            {theme.bgImage && <><Image src={theme.bgImage} alt="preview" width={672} height={64} className="mt-2 h-16 w-full rounded-lg object-cover" unoptimized onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} /><button type="button" onClick={() => onFieldChange("bgImage", null)} className="mt-2 text-xs text-red-400 transition-colors hover:text-red-300">Eliminar imagen</button></>}
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" name="backgroundAnimated" aria-label="Fondo animado" checked={theme.bgAnimated} onChange={(e) => onFieldChange("bgAnimated", e.target.checked)} disabled={!!theme.bgImage} className="peer sr-only" /><div className="h-5 w-9 rounded-full bg-zinc-700 after:absolute after:start-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-disabled:opacity-40 peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500/50" /></label>
            <span className="text-xs text-zinc-500">Fondo animado{theme.bgImage && <span className="ml-1 text-zinc-600">(no compatible con imagen)</span>}</span>
          </div>
          <div><label htmlFor="font-heading" className="mb-1 block text-xs text-zinc-500">Tipografía (Títulos)</label><select id="font-heading" name="fontHeading" autoComplete="off" value={theme.fontHeading} onChange={(e) => onFieldChange("fontHeading", e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500">{fontNames.map((name) => <option key={name} value={name} className="bg-zinc-800">{name}</option>)}</select></div>
          <div><label htmlFor="font-body" className="mb-1 block text-xs text-zinc-500">Tipografía (Cuerpo)</label><select id="font-body" name="fontBody" autoComplete="off" value={theme.fontBody} onChange={(e) => onFieldChange("fontBody", e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500">{fontNames.map((name) => <option key={name} value={name} className="bg-zinc-800">{name}</option>)}</select></div>
          <ThemeField id="text-primary" label="Texto Principal" value={theme.textPrimary} onChange={(value) => onFieldChange("textPrimary", value)} />
          <ThemeField id="text-secondary" label="Texto Secundario" value={theme.textSecondary} onChange={(value) => onFieldChange("textSecondary", value)} />
          <ThemeField id="text-muted" label="Texto Tenue" value={theme.textMuted} onChange={(value) => onFieldChange("textMuted", value)} />
          <ThemeField id="card-bg" label="Fondo Tarjeta" value={theme.cardBg} onChange={(value) => onFieldChange("cardBg", value)} />
          <ThemeField id="card-border" label="Borde Tarjeta" value={theme.cardBorder} onChange={(value) => onFieldChange("cardBorder", value)} />
          <ThemeField id="card-bg-hover" label="Fondo Tarjeta Hover" value={theme.cardBgHover} onChange={(value) => onFieldChange("cardBgHover", value)} />
          <ThemeField id="ring-color" label="Anillo Avatar" value={theme.ringColor} onChange={(value) => onFieldChange("ringColor", value)} />
          <ThemeField id="social-bg" label="Fondo Social" value={theme.socialBg} onChange={(value) => onFieldChange("socialBg", value)} />
          <ThemeField id="social-color" label="Color Social" value={theme.socialColor} onChange={(value) => onFieldChange("socialColor", value)} />
          <ThemeField id="social-hover-bg" label="Fondo Social Hover" value={theme.socialHoverBg} onChange={(value) => onFieldChange("socialHoverBg", value)} />
          <ThemeField id="social-hover-color" label="Color Social Hover" value={theme.socialHoverColor} onChange={(value) => onFieldChange("socialHoverColor", value)} />
        </div>
        <div className="mt-4 overflow-hidden rounded-xl"><p className="mb-2 text-xs text-zinc-500">Vista previa del fondo:</p><div className="h-20 w-full rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgVia}, ${theme.bgTo})` }} /></div>
      </Section>
    </>
  )
}
