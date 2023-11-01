export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string  
  createdDate: Date
  lastModifiedDate: Date
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
  lastModifiedDate: Date
}

export type Tag = {
  id: string
  label: string
}