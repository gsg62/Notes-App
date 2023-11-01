import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import { NoteCards } from "./NoteCards"
import { useState } from "react"
import { NoteTable } from "./NoteTable"
import { Note, Tag } from "../Types"
import { EditTagsModal } from "./EditTagsModal"

type NoteProps = {
  tags: Tag[]
  notes: Note[]
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

export function Notes({ notes, tags, onDeleteTag, onUpdateTag }: NoteProps) {
  const [editTagsModalOpen, setEditTagsModalOpen] = useState(false)
  const [showAsTable, setShowAsTable] = useState(false)

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={4} direction="horizontal">
            <Form.Switch
              label="Show as table"
              onChange={() => setShowAsTable(!showAsTable)}
            ></Form.Switch>
            <Link to={"/new"}>
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagsModalOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>
      {showAsTable ? (
        <NoteTable notes={notes} tags={tags} />
      ) : (
        <NoteCards notes={notes} availableTags={tags} />
      )}
      <EditTagsModal
        availableTags={tags}
        show={editTagsModalOpen}
        handleClose={() => setEditTagsModalOpen(false)}
        onUpdate={onUpdateTag}
        onDelete={onDeleteTag}
      />
    </>
  )
}
