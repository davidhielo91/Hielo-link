import type { LucideProps } from "lucide-react"
import { getLinkIcon } from "@/lib/link-icons"

/** Renders the Lucide icon for a stored link icon id, or nothing when there is none. */
export default function LinkIcon({ id, ...props }: { id?: string } & LucideProps) {
  const option = getLinkIcon(id)
  if (!option) return null
  const Icon = option.icon
  return <Icon aria-hidden="true" {...props} />
}
