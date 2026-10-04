export default function ThemeField({
  id, label, value, onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const isHex = value.startsWith("#")
  return (
    <div>
      <label htmlFor={`${id}-value`} className="mb-1 block text-xs text-zinc-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={`${id}-picker`}
          name={`${id}Picker`}
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 cursor-pointer rounded border border-zinc-700 bg-transparent"
          aria-label={`Selector de color: ${label}`}
        />
        <input
          id={`${id}-value`}
          name={id}
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500"
        />
      </div>
    </div>
  )
}
