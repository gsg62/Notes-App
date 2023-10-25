import { useEffect, useMemo, useState } from "react"
import { Card, Col, Fade, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import styles from "./NoteList.module.css"
import { Tags } from "./Tags"
import { Note, Tag } from "./Types"

type SimplifiedNote = {
  tags: Tag[]
  title: string
  id: string
}

type NoteListProps = {
  availableTags: Tag[]
  notes: Note[]
}

export function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState("")
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

  const [transitionIn, setTransitionIn] = useState(false)

  useEffect(() => {
    setTransitionIn(true)
  }, [])

  return (
    <Fade in={transitionIn} timeout={600}>
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
              <NoteCard title={note.title} id={note.id} tags={note.tags} />
            </Col>
          ))}
        </Row>
      </Stack>
    </Fade>
  )
}

function NoteCard({ title, id, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          <Tags tags={tags} />
        </Stack>
      </Card.Body>
    </Card>
  )
}
