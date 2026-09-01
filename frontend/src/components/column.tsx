import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { STATUS_LABELS, type Task, type TaskStatus } from "@/types"

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-blue-500",
  in_review: "bg-amber-500",
  done: "bg-emerald-500",
}

interface ColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function Column({ status, tasks, onAddTask, onEditTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "Column", status },
  })

  const taskIds = tasks.map((t) => t.id)

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40 sm:w-80">
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${COLUMN_ACCENTS[status]}`} />
          <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
          <Badge variant="secondary" className="rounded-full px-1.5 text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onAddTask}
          aria-label={`Add task to ${STATUS_LABELS[status]}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-md p-2 transition-colors ${
          isOver ? "bg-accent" : ""
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed py-6 text-xs text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}
