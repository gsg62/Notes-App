import { NoteForm } from "./NoteForm"
import { useNoteContext } from "../layout/NoteLayout"
import { NoteData, Tag } from "../Types"

type NewNoteProps = {
  onSubmit: (id: string, data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export function EditNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
  const note = useNoteContext()

  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  )
}
