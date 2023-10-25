import { Badge, Stack } from "react-bootstrap"
import { Tag } from "../App"

type TagsProps = {
  tags: Tag[]
}

export function Tags({ tags }: TagsProps) {
  return (
    <>
      {tags.length > 0 && (
        <Stack
          gap={1}
          direction="horizontal"
          className="justify-content-center flex-wrap"
        >
          {tags.map((tag) => (
            <Badge className="text-truncate" key={tag.id}>
              {tag.label}
            </Badge>
          ))}
        </Stack>
      )}
    </>
  )
}
