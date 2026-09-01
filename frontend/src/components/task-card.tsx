import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Task } from "@/types"

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  overlay?: boolean
}

export function TaskCard({ task, onEdit, onDelete, overlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", status: task.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      className={`group cursor-grab gap-3 py-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      } ${overlay ? "rotate-2 shadow-lg" : ""}`}
    >
      <CardHeader className="px-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug break-words">{task.title}</p>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onEdit}
              aria-label="Edit task"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onDelete}
              aria-label="Delete task"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="px-3">
          <p className="text-muted-foreground line-clamp-3 text-xs break-words">
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
