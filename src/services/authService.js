import { ApiError, apiClient, requireApiUrl, setAuthToken } from './api'

const WRONG_PORTAL_MESSAGE = 'Esta es una cuenta profesional. Ingresá desde el portal profesional para publicar mascotas.'
const ERROR_MESSAGES = {
  401: 'El correo o la contraseña no son correctos.',
  409: 'Ya existe una cuenta con ese correo. Probá iniciar sesión.',
  429: 'Hiciste muchos intentos. Esperá un minuto y pedí un código nuevo.',
}

// Traduce los errores conocidos de la API a mensajes claros para cualquier persona.
const friendlyRequest = async (request, overrides = {}) => {
  try {
    return await request()
  } catch (error) {
    const messages = { ...ERROR_MESSAGES, ...overrides }
    if (error instanceof ApiError && messages[error.status]) throw new Error(messages[error.status])
    throw error
  }
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

const requireVerification = (payload) => {
  if (payload?.verificacion_requerida !== true || !payload.verificacion?.email) {
    throw new Error('La API no indicó cómo verificar tu correo.')
  }
  return payload.verificacion
}

export const authService = {
  // Paso 1: la API valida la contraseña y envía un código al correo.
  async login(credentials) {
    requireApiUrl('autenticación')
    const payload = await friendlyRequest(
      () => apiClient.post('/api/auth/login', credentials),
      { 403: WRONG_PORTAL_MESSAGE },
    )
    return { verificacion: requireVerification(payload) }
  },

  async register(credentials) {
    requireApiUrl('autenticación')
    const payload = await friendlyRequest(() => apiClient.post('/api/auth/register', credentials))
    return { verificacion: requireVerification(payload) }
  },

  // Paso 2: con el código del correo la API entrega la sesión.
  async verify({ email, codigo }) {
    requireApiUrl('autenticación')
    const payload = await friendlyRequest(
      () => apiClient.post('/api/auth/verify', { email, codigo }),
      { 400: 'El código no es correcto o ya venció. Revisalo o pedí uno nuevo.' },
    )
    if (typeof payload?.token !== 'string' || !payload.token || !isValidUser(payload.user)) {
      throw new Error('La API no devolvió una sesión válida.')
    }
    setAuthToken(payload.token)
    return { token: payload.token, user: payload.user }
  },

  async resendCode(email) {
    requireApiUrl('autenticación')
    return friendlyRequest(() => apiClient.post('/api/auth/resend-code', { email }))
  },

  async getCurrentUser(token) {
    requireApiUrl('autenticación')
    setAuthToken(token)
    const payload = await apiClient.get('/api/auth/me')
    const user = payload?.user ?? payload

    if (!isValidUser(user)) {
      throw new Error('La API no devolvió un usuario válido para la sesión.')
    }

    return user
  },
}
