export default function ThemeField({
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
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
        />
      </div>
    </div>
  )
}
