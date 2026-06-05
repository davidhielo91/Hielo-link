type ProfileData = {
  name: string
  bio: string
  avatar: string | null
}

export default function Profile({ name, bio, avatar }: ProfileData) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col items-center gap-4">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="size-24 rounded-full object-cover"
          style={{ boxShadow: "0 0 0 4px var(--ring-color)" }}
        />
      ) : (
        <div
          className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-2xl font-bold text-white"
          style={{ boxShadow: "0 0 0 4px var(--ring-color)" }}
        >
          {initials}
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {name}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {bio}
        </p>
      </div>
    </div>
  )
}
