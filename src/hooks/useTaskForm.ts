import { useState } from 'react'
import type { FormEvent } from 'react'
import { createTask } from '../services/taskService'
import type { TaskPriority } from '../types'

interface UseTaskFormOptions {
  projectId: number | null
  onSuccess?: () => void
}

export function useTaskForm({
  projectId,
  onSuccess,
}: UseTaskFormOptions) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MED')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid =
    projectId !== null &&
    title.trim().length > 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!valid || submitting || projectId === null) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createTask(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || null,
      })

      setTitle('')
      setDescription('')
      setPriority('MED')
      setDueDate('')

      onSuccess?.()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al crear la tarea'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    submitting,
    error,
    valid,
    handleSubmit,
  }
}