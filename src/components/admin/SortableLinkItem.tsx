"use client"

import { type CSSProperties } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, ExternalLink, Trash2 } from "lucide-react"

export default function SortableLinkItem({
  link, isEditing, onEdit, onDelete,
}: {
  link: { id: string; title: string; url: string }
  isEditing: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
        isEditing ? "border-purple-500 bg-purple-500/10" : "border-zinc-800 bg-zinc-900"
      } ${isDragging ? "z-10 shadow-xl" : ""}`}
    >
      <button {...attributes} {...listeners} aria-label={`Reordenar ${link.title}`} className="shrink-0 cursor-grab active:cursor-grabbing">
        <GripVertical className="size-4 text-zinc-600" />
      </button>
      <span className="flex-1 truncate">{link.title}</span>
      <span className="hidden truncate text-sm text-zinc-500 sm:block">{link.url}</span>
      <button onClick={() => onEdit(link.id)} aria-label={`Editar ${link.title}`} className="shrink-0 p-1 text-zinc-500 hover:text-purple-400">
        <Pencil className="size-4" />
      </button>
      <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${link.title} en una pestaña nueva`} className="shrink-0 p-1 text-zinc-500 hover:text-white">
        <ExternalLink className="size-4" />
      </a>
      <button onClick={() => onDelete(link.id)} aria-label={`Eliminar ${link.title}`} className="shrink-0 p-1 text-zinc-500 hover:text-red-400">
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
