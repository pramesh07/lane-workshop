import type { Task, TaskCreateInput, TaskStatus, TaskUpdateInput } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Request failed with status ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const api = {
  listTasks: () => request<Task[]>("/api/tasks"),

  createTask: (input: TaskCreateInput) =>
    request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateTask: (id: string, input: TaskUpdateInput) =>
    request<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  moveTask: (id: string, status: TaskStatus, position: number) =>
    request<Task>(`/api/tasks/${id}/move`, {
      method: "PATCH",
      body: JSON.stringify({ status, position }),
    }),

  deleteTask: (id: string) =>
    request<void>(`/api/tasks/${id}`, { method: "DELETE" }),
}
