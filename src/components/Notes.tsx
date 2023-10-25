import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import { NoteList } from "./NoteList"
import { useState } from "react"
import { NoteTable } from "./NoteTable"
import { Note, Tag } from "./Types"

type NoteProps = {
  tags: Tag[]
  notes: Note[]
  onDeleteTag: (id: string) => void
  onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
  show: boolean
  availableTags: Tag[]
  handleClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, label: string) => void
}

export function Notes({ notes, tags, onDeleteTag, onUpdateTag }: NoteProps) {
  const [editTagsModalOpen, setEditTagsModalOpen] = useState(false)
  const [showAsTable, setShowAsTable] = useState(false)

  const handleChange = () => {
    setShowAsTable(!showAsTable)
  }

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
              onChange={() => handleChange()}
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
        <NoteList notes={notes} availableTags={tags} />
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

function EditTagsModal({
  availableTags,
  show,
  handleClose,
  onUpdate,
  onDelete,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdate(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={() => onDelete(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
