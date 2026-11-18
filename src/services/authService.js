import { apiClient, requireApiUrl, setAuthToken } from './api'

const normalizePayload = (payload = {}) => {
  const response = payload ?? {}
  const user = response.user ?? response.usuario ?? response.data?.user ?? response.data
    ?? (response.id != null ? response : null)
  const token = response.token ?? response.access_token ?? response.accessToken ?? response.jwt ?? null

  return { user, token }
}

const isValidUser = (user) => (
  user
  && Number.isSafeInteger(user.id)
  && user.id > 0
  && typeof user.nombre === 'string'
  && Boolean(user.nombre.trim())
  && typeof user.email === 'string'
  && Boolean(user.email.trim())
  && ['ADMIN', 'ADOPTANTE'].includes(user.rol)
)

export const authService = {
  async login(credentials) {
    requireApiUrl('autenticación')
    const payload = await apiClient.post('/api/auth/login', credentials)
    const normalized = normalizePayload(payload)

    if (typeof normalized.token !== 'string' || !normalized.token || !isValidUser(normalized.user)) {
      throw new Error('La API no devolvió una sesión válida.')
    }

    setAuthToken(normalized.token)
    return normalized
  },

  async register(credentials) {
    requireApiUrl('autenticación')
    const payload = await apiClient.post('/api/auth/register', credentials)
    const normalized = normalizePayload(payload)

    if (!isValidUser(normalized.user)) {
      throw new Error('La API no devolvió un usuario válido.')
    }

    if (typeof normalized.token === 'string' && normalized.token) {
      setAuthToken(normalized.token)
    }

    return normalized
  },

  async getCurrentUser(token) {
    requireApiUrl('autenticación')
    setAuthToken(token)
    const payload = await apiClient.get('/api/auth/me')
    const user = payload?.user ?? payload?.usuario ?? payload?.data?.user ?? payload?.data ?? payload

    if (!isValidUser(user)) {
      throw new Error('La API no devolvió un usuario válido para la sesión.')
    }

    return user
  },
}
