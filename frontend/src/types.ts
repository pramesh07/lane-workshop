export const TASK_STATUSES = ["todo", "in_progress", "in_review", "done"] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  position: number
  created_at: string
  updated_at: string
}

export interface TaskCreateInput {
  title: string
  description?: string | null
  status?: TaskStatus
}

export interface TaskUpdateInput {
  title?: string
  description?: string | null
  status?: TaskStatus
  position?: number
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
}
