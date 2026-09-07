import { describe, expect, it, vi } from 'vitest'
import { httpClient } from './httpClient'
import { updateTaskStatus } from './taskService'

vi.mock('./httpClient', () => ({
  httpClient: {
    patch: vi.fn(),
  },
}))

describe('taskService', () => {
  it('debe actualizar el estado de una tarea usando PATCH', async () => {
    vi.mocked(httpClient.patch).mockResolvedValue({
      data: {
        id: 1,
        title: 'Tarea de prueba',
        description: null,
        status: 'DONE',
        priority: 'MED',
        projectId: 10,
        assigneeId: 1,
        dueDate: null,
      },
    })

    const result = await updateTaskStatus(1, 'DONE')

    expect(httpClient.patch).toHaveBeenCalledWith(
      '/tasks/1/status',
      {
        status: 'DONE',
      },
    )

    expect(result.status).toBe('DONE')
  })
})