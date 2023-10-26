import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
} from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { Fade } from "react-bootstrap"
import removeMarkdown from "markdown-to-text"
import { Tags } from "./Tags"
import { Note, Tag } from "../Types"
import { Link } from "react-router-dom"
import Button from "@mui/material/Button"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { Checkbox, InputLabel, ListItemText, MenuItem } from "@mui/material"

type NoteTableProps = {
  tags: Tag[]
  notes: Note[]
}

export function NoteTable({ notes, tags }: NoteTableProps) {
  // custom filter input for filtering tags
  function tagFilterInput({ item, applyValue }: GridFilterInputValueProps) {
    const [tagFilters, setTagFilters] = useState<string[]>([])
    
    const handleChange = (event: SelectChangeEvent<any>) => {
      setTagFilters(event.target.value)
      applyValue({ ...item, value: event.target.value })
    }

    return (
      <>
        <InputLabel id="tagLabel">Tag</InputLabel>
        <Select
          multiple
          labelId="tagLabel"
          value={tagFilters}
          onChange={handleChange}
          renderValue={(selected) => selected.join(", ")}
          sx={{ height: "100%" }}
        >
          {tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.label}>
              <Checkbox checked={tagFilters.includes(tag.label)} />
              <ListItemText primary={tag.label} />
            </MenuItem>
          ))}
        </Select>
      </>
    )
  }

  // custom input operator for filtering tags
  const tagFilterOperators: GridFilterOperator[] = [
    {
      label: "Contains",
      value: "contains",
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null
        }

        return (params): boolean => {
          return (
            filterItem.value.length === 0 ||
            filterItem.value.every((tag: string) =>
              params.formattedValue.some(
                (noteTag: Tag) => noteTag.label === tag
              )
            )
          )
        }
      },
      InputComponent: tagFilterInput,
      InputComponentProps: { type: "string" },
    },
  ]

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <Link to={`/${row.id}`}>
            <Button variant="text">{row.title}</Button>
          </Link>
        )
      },
    },
    {
      field: "markdown",
      headerName: "Markdown",
      width: 500,
      valueGetter: ({ row }) => {
        return removeMarkdown(row.markdown)
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 300,
      filterOperators: tagFilterOperators,
      renderCell: ({ row }) => {
        return <Tags tags={row.tags} />
      },
    },
  ]

  const [transitionIn, setTransitionIn] = useState(false)

  useEffect(() => {
    setTransitionIn(true)
  }, [])

  return (
    <Fade in={transitionIn} timeout={600}>
      <DataGrid rows={notes} columns={columns} />
    </Fade>
  )
}
