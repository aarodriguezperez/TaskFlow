export interface AuthResponse {
  token: string
}

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
}

export interface NewProject {
  name: string
  description?: string
}

export const TOKEN_KEY = 'taskflow-token'

// TASK

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type TaskPriority = 'LOW' | 'MED' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  projectId: number
  assigneeId: number | null
  dueDate: string | null
}

export interface NewTask {
  title: string
  description?: string
  priority: TaskPriority
  assigneeId?: number | null
  dueDate?: string | null
}

export interface UpdateTask {
  title: string
  description: string | null
  priority: TaskPriority
  assigneeId: number | null
  dueDate: string | null
}