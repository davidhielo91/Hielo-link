import { Plus } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Section from "@/components/admin/Section"
import SortableLinkItem from "@/components/admin/SortableLinkItem"
import type { ProfileData } from "@/lib/validation"
import type { LinkForm } from "@/components/admin/types"

type LinksSectionProps = {
  links: ProfileData["links"]
  form: LinkForm
  showForm: boolean
  editingLink: string | null
  onDragEnd: (event: DragEndEvent) => void
  onFormChange: (form: LinkForm) => void
  onShowForm: () => void
  onAdd: () => void
  onCancel: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function LinksSection({ links, form, showForm, editingLink, onDragEnd, onFormChange, onShowForm, onAdd, onCancel, onEdit, onDelete }: LinksSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  return (
    <Section title="Enlaces">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {links.map((link) => <SortableLinkItem key={link.id} link={link} isEditing={editingLink === link.id} onEdit={onEdit} onDelete={onDelete} />)}
          </div>
        </SortableContext>
      </DndContext>
      {showForm ? (
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {editingLink && <p className="text-xs text-purple-400">Editando enlace</p>}
          <label htmlFor="link-title" className="sr-only">Título del enlace</label>
          <input id="link-title" name="linkTitle" type="text" autoComplete="off" placeholder="Título" value={form.title} onChange={(e) => onFormChange({ ...form, title: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
          <label htmlFor="link-url" className="sr-only">URL del enlace</label>
          <input id="link-url" name="linkUrl" type="url" autoComplete="url" placeholder="URL" value={form.url} onChange={(e) => onFormChange({ ...form, url: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus:border-purple-500" />
          <div className="flex gap-2">
            <button onClick={onAdd} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500">{editingLink ? "Actualizar" : "Agregar"}</button>
            <button onClick={onCancel} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={onShowForm} className="mt-3 flex items-center gap-2 text-sm text-purple-400 transition-colors hover:text-purple-300"><Plus className="size-4" />Agregar enlace</button>
      )}
    </Section>
  )
}
