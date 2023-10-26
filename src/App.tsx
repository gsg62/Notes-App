import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./components/NewNote"
import { NoteLayout } from "./layout/NoteLayout"
import { Note } from "./components/Note"
import { EditNote } from "./components/EditNote"
import { Notes } from "./components/Notes"
import useNotes from "./hooks/useNotes"

function App() {
  const {
    notes,
    tags,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    addTag,
    updateTag,
    deleteTag,
  } = useNotes()



  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <Notes
              notes={notes}
              tags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notes} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
