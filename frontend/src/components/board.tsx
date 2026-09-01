import { useMemo, useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Column } from "@/components/column"
import { DeleteTaskDialog } from "@/components/delete-task-dialog"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { useTasks } from "@/hooks/use-tasks"
import { TASK_STATUSES, type Task, type TaskStatus } from "@/types"

export function Board() {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderLocal,
    persistMove,
    reload,
  } = useTasks()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [dialogDefaultStatus, setDialogDefaultStatus] = useState<TaskStatus>("todo")
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const tasksByStatus = useMemo(() => {
    const grouped = Object.fromEntries(TASK_STATUSES.map((s) => [s, [] as Task[]])) as Record<
      TaskStatus,
      Task[]
    >
    for (const task of tasks) {
      grouped[task.status].push(task)
    }
    for (const status of TASK_STATUSES) {
      grouped[status].sort((a, b) => a.position - b.position)
    }
    return grouped
  }, [tasks])

  function openCreateDialog(status: TaskStatus) {
    setEditingTask(null)
    setDialogDefaultStatus(status)
    setDialogOpen(true)
  }

  function openEditDialog(task: Task) {
    setEditingTask(task)
    setDialogDefaultStatus(task.status)
    setDialogOpen(true)
  }

  async function handleDialogSubmit(values: {
    title: string
    description: string
    status: TaskStatus
  }) {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title: values.title,
        description: values.description || null,
        status: values.status,
      })
    } else {
      await createTask({
        title: values.title,
        description: values.description || null,
        status: values.status,
      })
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const activeTaskItem = tasks.find((t) => t.id === activeId)
    if (!activeTaskItem) return

    const overIsColumn = over.data.current?.type === "Column"
    const overStatus: TaskStatus = overIsColumn
      ? (overId as TaskStatus)
      : (tasks.find((t) => t.id === overId)?.status ?? activeTaskItem.status)

    const destColumnTasks = tasksByStatus[overStatus]

    if (overIsColumn) {
      if (activeTaskItem.status !== overStatus) {
        reorderLocal(activeId, overStatus, destColumnTasks.length)
      }
      return
    }

    const overIndex = destColumnTasks.findIndex((t) => t.id === overId)
    if (overIndex === -1) return

    const currentIndex = destColumnTasks.findIndex((t) => t.id === activeId)
    if (activeTaskItem.status === overStatus && currentIndex === overIndex) return

    reorderLocal(activeId, overStatus, overIndex)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) {
      reload()
      return
    }

    const activeId = active.id as string
    const task = tasks.find((t) => t.id === activeId)
    if (!task) return

    const columnTasks = tasksByStatus[task.status]
    const index = columnTasks.findIndex((t) => t.id === activeId)
    if (index === -1) return

    const prevTask = columnTasks[index - 1]
    const nextTask = columnTasks[index + 1]

    let position: number
    if (!prevTask && !nextTask) position = 1
    else if (!prevTask) position = nextTask.position - 1
    else if (!nextTask) position = prevTask.position + 1
    else position = (prevTask.position + nextTask.position) / 2

    if (position !== task.position) {
      persistMove(activeId, task.status, position)
    }
  }

  function handleDragCancel(_event: DragCancelEvent) {
    setActiveTask(null)
    reload()
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" onClick={reload}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold">TODO Board</h1>
          <p className="text-muted-foreground text-xs">
            {tasks.length} task{tasks.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={() => openCreateDialog("todo")}>
          <Plus className="size-4" /> New tasks
        </Button>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-4 sm:px-6">
        {loading ? (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Loading tasks…
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex h-full items-start gap-4">
              {TASK_STATUSES.map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onAddTask={() => openCreateDialog(status)}
                  onEditTask={openEditDialog}
                  onDeleteTask={setDeletingTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && (
                <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} overlay />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={dialogDefaultStatus}
        onSubmit={handleDialogSubmit}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        onConfirm={() => {
          if (deletingTask) deleteTask(deletingTask.id)
          setDeletingTask(null)
        }}
      />
    </div>
  )
}
