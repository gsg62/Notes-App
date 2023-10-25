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
import { Note, Tag } from "./Types"
import { Link } from "react-router-dom"
import Button from "@mui/material/Button"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { Checkbox, ListItemText, MenuItem } from "@mui/material"

type NoteTableProps = {
  tags: Tag[]
  notes: Note[]
}

export function NoteTable({ notes, tags }: NoteTableProps) {
  const [tagFilters, setTagFilters] = useState<string[]>([])

  // create filter react select check box component for filtering tags
  function tagFilterInput(props: GridFilterInputValueProps) {
    console.log("file: NoteTable.tsx:28 ~ props:", props)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: SelectChangeEvent<any>) => {
      console.log("file: NoteTable.tsx:22 ~ event:", event)
      setTagFilters(event.target.value)
    }

    return (
      <Select
        multiple
        value={tagFilters}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        // MenuProps={MenuProps}
        sx={{ height: "100%" }}
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.label}>
            <Checkbox checked={tagFilters.includes(tag.label)} />
            <ListItemText primary={tag.label} />
          </MenuItem>
        ))}
      </Select>
    )
  }

  const tagFilterOperators: GridFilterOperator[] = [
    {
      label: "Contains",
      value: "contains",
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        console.log("file: NoteTable.tsx:21 ~ filterItem:", filterItem)
        // return null
        // if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        //   return null;
        // }

        return (params): boolean => {
          console.log("file: NoteTable.tsx:66 ~ filterParams:", params)
          // return true
          return (
            tagFilters.length === 0 ||
            tagFilters.every((tag) =>
              params.formattedValue.some(
                (noteTag: Tag) => noteTag.label === tag
              )
            )
          )
        }
      },
      InputComponent: tagFilterInput,
      // InputComponentProps: { type: 'number' },
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
