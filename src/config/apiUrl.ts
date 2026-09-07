const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL no está definida')
}

export function getApiBaseUrl(): string {
  return API_URL.replace(/\/$/, '')
}