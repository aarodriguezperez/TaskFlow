import { httpClient } from './httpClient'
import type { NewTask, Task, TaskStatus, UpdateTask,
} from '../types'


export async function getTasks(
  projectId: number
): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>(
    `/projects/${projectId}/tasks`
  )

  return data
}

export async function createTask(
  projectId: number,
  body: NewTask
): Promise<Task> {
  const { data } = await httpClient.post<Task>(
    `/projects/${projectId}/tasks`,
    body
  )

  return data
}

export async function deleteTask(
  taskId: number
): Promise<void> {
  await httpClient.delete(`/tasks/${taskId}`)
}

export async function updateTask(
  taskId: number,
  body: UpdateTask
): Promise<Task> {
  const { data } = await httpClient.put<Task>(
    `/tasks/${taskId}`,
    body
  )

  return data
}

export async function updateTaskStatus(
  taskId: number,
  status: TaskStatus
): Promise<Task> {
  const { data } = await httpClient.patch<Task>(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  )

  return data
}