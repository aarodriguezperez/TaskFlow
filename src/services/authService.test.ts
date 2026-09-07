import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { login } from './authService'

vi.mock('axios')

describe('authService', () => {
  it('debe devolver el token cuando el login es correcto', async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        token: 'fake-jwt-token',
      },
    })

    const token = await login('admin', '1234')

    expect(token).toBe('fake-jwt-token')

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      {
        username: 'admin',
        password: '1234',
      },
    )
  })
})