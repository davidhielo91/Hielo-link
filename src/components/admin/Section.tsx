export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "color-mix(in srgb, var(--card-bg) 60%, transparent)",
      }}
    >
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h2>
      {children}
    </section>
  )
}
