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
  const [assigneeId, setAssigneeId] = useState<number | null>(null)

  const validTitle = title.trim().length >= 3

  const validDueDate =
    dueDate === '' || !Number.isNaN(Date.parse(dueDate))

  const valid =
    projectId !== null &&
    validTitle &&
    validDueDate

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (title.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres.')
      return
    }

    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      setError('La fecha límite no es válida.')
      return
    }

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
        assigneeId,
        dueDate: dueDate || null,
      })

      setTitle('')
      setDescription('')
      setPriority('MED')
      setAssigneeId(null)
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
    assigneeId,
    setAssigneeId,
    dueDate,
    setDueDate,
    submitting,
    error,
    valid,
    handleSubmit,
  }
}