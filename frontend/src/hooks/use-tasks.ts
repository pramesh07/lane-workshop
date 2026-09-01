import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { api } from "@/lib/api"
import type { Task, TaskCreateInput, TaskStatus, TaskUpdateInput } from "@/types"

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setTasks(await api.listTasks())
    } catch (err) {
      setError(errorMessage(err, "Failed to load tasks"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const createTask = useCallback(async (input: TaskCreateInput) => {
    try {
      const task = await api.createTask(input)
      setTasks((prev) => [...prev, task])
      toast.success("Task created")
      return task
    } catch (err) {
      toast.error(errorMessage(err, "Failed to create task"))
      throw err
    }
  }, [])

  const updateTask = useCallback(async (id: string, input: TaskUpdateInput) => {
    try {
      const task = await api.updateTask(id, input)
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)))
      toast.success("Task updated")
      return task
    } catch (err) {
      toast.error(errorMessage(err, "Failed to update task"))
      throw err
    }
  }, [])

  const deleteTask = useCallback(
    async (id: string) => {
      const snapshot = tasks
      setTasks((prev) => prev.filter((t) => t.id !== id))
      try {
        await api.deleteTask(id)
        toast.success("Task deleted")
      } catch (err) {
        setTasks(snapshot)
        toast.error(errorMessage(err, "Failed to delete task"))
      }
    },
    [tasks],
  )

  /** Optimistically reposition a task in local state while a drag is in progress. */
  const reorderLocal = useCallback((id: string, status: TaskStatus, index: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id)
      if (!task) return prev

      const rest = prev.filter((t) => t.id !== id)
      const columnTasks = rest.filter((t) => t.status === status)
      const otherTasks = rest.filter((t) => t.status !== status)

      const moved = { ...task, status }
      const clampedIndex = Math.max(0, Math.min(index, columnTasks.length))
      columnTasks.splice(clampedIndex, 0, moved)

      return [...otherTasks, ...columnTasks]
    })
  }, [])

  const persistMove = useCallback(
    async (id: string, status: TaskStatus, position: number) => {
      try {
        const task = await api.moveTask(id, status, position)
        setTasks((prev) => prev.map((t) => (t.id === id ? task : t)))
      } catch (err) {
        toast.error(errorMessage(err, "Failed to move task"))
        await loadTasks()
      }
    },
    [loadTasks],
  )

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    reorderLocal,
    persistMove,
    reload: loadTasks,
  }
}
