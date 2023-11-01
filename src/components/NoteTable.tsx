import {
  DataGrid,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
} from "@mui/x-data-grid"
import {
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Button,
} from "@mui/material"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { useState } from "react"
import { Fade } from "react-bootstrap"
import { Link } from "react-router-dom"
import removeMarkdown from "markdown-to-text"
import { Tags } from "./Tags"
import { Note, Tag } from "../Types"
import useTransition from "../hooks/useTransition"

type NoteTableProps = {
  tags: Tag[]
  notes: Note[]
}

export function NoteTable({ notes, tags }: NoteTableProps) {
  const { transitionIn, timeout } = useTransition()

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
  const tagFilterOps: GridFilterOperator[] = [
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
      width: 350,
      valueGetter: ({ row }) => {
        return removeMarkdown(row.markdown)
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 200,
      filterOperators: tagFilterOps,
      renderCell: ({ row }) => {
        return <Tags tags={row.tags} />
      },
    },
    {
      field: "createdDate",
      headerName: "Created",
      type: "date",
      width: 250,
      valueGetter: ({ value }) => {
        return new Date(value)
      },
      valueFormatter({ value }) {
        return value.toUTCString()
      },
    },
    {
      field: "lastModifiedDate",
      headerName: "Last Modified",
      type: "date",
      width: 250,
      valueGetter: ({ value }) => {
        return new Date(value)
      },
      valueFormatter({ value }) {
        return value.toUTCString()
      },
    },
  ]

  return (
    <Fade in={transitionIn} timeout={timeout}>
      <DataGrid rows={notes} columns={columns} />
    </Fade>
  )
}
