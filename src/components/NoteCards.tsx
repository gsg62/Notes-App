import { useMemo, useState } from "react"
import { Card, Col, Fade, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import styles from "./NoteCards.module.css"
import { Tags } from "./Tags"
import { Note, Tag } from "../Types"
import useTransition from "../hooks/useTransition"

type NoteCardProps = {
  note: Note
}

type NoteCardsProps = {
  availableTags: Tag[]
  notes: Note[]
}

export function NoteCards({ availableTags, notes }: NoteCardsProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
  const { transitionIn, timeout } = useTransition()

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      )
    })
  }, [title, selectedTags, notes])

  return (
    <Fade in={transitionIn} timeout={timeout}>
      <Stack gap={1}>
        <Form>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tag">
                <Form.Label>Tag</Form.Label>
                <ReactSelect
                  value={selectedTags.map((tag) => {
                    return {
                      label: tag.label,
                      value: tag.id,
                    }
                  })}
                  options={availableTags.map((tag) => {
                    return { label: tag.label, value: tag.id }
                  })}
                  onChange={(tags) => {
                    setSelectedTags(
                      tags.map((tag) => {
                        return { label: tag.label, id: tag.value }
                      })
                    )
                  }}
                  isMulti
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
          {filteredNotes.map((note) => (
            <Col key={note.id}>
              <NoteCard note={note} />
            </Col>
          ))}
        </Row>
      </Stack>
    </Fade>
  )
}

function NoteCard({ note }: NoteCardProps) {
  return (
    <Card
      as={Link}
      to={`/${note.id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5 text-center">{note.title}</span>
          <Tags tags={note.tags} />
        </Stack>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          Last modified: {new Date(note.lastModifiedDate).toUTCString()}
        </small>
      </Card.Footer>
    </Card>
  )
}
