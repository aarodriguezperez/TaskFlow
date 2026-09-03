import { useCallback, useEffect, useState } from 'react'
import { getTasks } from '../services/taskService'
import type { Task } from '../types'

export function useTasks(projectId: number | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    if (projectId === null) {
      setTasks([])
      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)

    getTasks(projectId)
      .then((data) => {
        if (!cancelled) {
          setTasks(data)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Error al cargar las tareas'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [projectId, reloadKey])

  return {
    tasks,
    loading,
    error,
    refetch,
  }
}