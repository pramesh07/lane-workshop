import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from "@/types"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  defaultStatus?: TaskStatus
  onSubmit: (values: { title: string; description: string; status: TaskStatus }) => Promise<void>
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultStatus = "todo",
  onSubmit,
}: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "")
      setDescription(task?.description ?? "")
      setStatus(task?.status ?? defaultStatus)
    }
  }, [open, task, defaultStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
            <DialogDescription>
              {task ? "Update the task details below." : "Add a new task to the board."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design the login page"
                autoFocus
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details (optional)"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger id="task-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
