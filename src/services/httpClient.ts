import axios from 'axios'
import { getApiBaseUrl } from '../config/apiUrl'
import { TOKEN_KEY } from '../types'

export const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)

      const loginUrl = `${import.meta.env.BASE_URL}login`
      window.location.href = loginUrl
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return 'Sesión expirada o usuario no autorizado.'
    }
    const status = err.response?.status ?? 'network'
    return `Error HTTP ${status}: ${err.message}`
  }
  return err instanceof Error ? err.message : 'Error desconocido'
}