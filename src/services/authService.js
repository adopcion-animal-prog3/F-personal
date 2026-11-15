import { apiClient, setAuthToken } from './api'

const normalizePayload = (payload = {}) => {
  const user = payload.user ?? payload.usuario ?? payload.data?.user ?? payload.data ?? null
  const token = payload.token ?? payload.access_token ?? payload.accessToken ?? payload.jwt ?? null

  return { user, token }
}

export const authService = {
  async login(credentials) {
    const payload = await apiClient.post('/api/auth/login', credentials)
    const normalized = normalizePayload(payload)

    if (normalized.token) {
      setAuthToken(normalized.token)
    }

    return normalized
  },

  async register(credentials) {
    const payload = await apiClient.post('/api/auth/register', credentials)
    const normalized = normalizePayload(payload)

    if (normalized.token) {
      setAuthToken(normalized.token)
    }

    return normalized
  },

  async getCurrentUser(token) {
    setAuthToken(token)
    const payload = await apiClient.get('/api/auth/me')
    return payload?.user ?? payload?.usuario ?? payload ?? null
  },
}
