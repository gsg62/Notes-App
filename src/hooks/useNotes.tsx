import { useMemo } from "react"
import { NoteData, RawNote, Tag } from "../Types"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidv4 } from "uuid"

const useNotes = () => {
  const [rawNotes, setRawNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notes = useMemo(() => {
    return rawNotes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      }
    })
  }, [rawNotes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setRawNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ]
    })
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setRawNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setRawNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id)
    })
  }

  return {
    notes,
    tags,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    addTag,
    updateTag,
    deleteTag,
  }
}

export default useNotes
