export default function Field({
  id, label, name, value, onChange, placeholder, type = "text", autoComplete = "off",
}: {
  id: string
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: "text" | "url"
  autoComplete?: string
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-sm text-zinc-400">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 transition-colors focus:border-purple-500"
      />
    </div>
  )
}
