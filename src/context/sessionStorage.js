import { clearAuthToken, setAuthToken } from '../services/api'

const STORAGE_KEY = 'f-personal-auth-session'
export const emptySession = { token: '', user: null }

export const getStoredSession = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed?.token) return emptySession
    setAuthToken(parsed.token)
    return { token: parsed.token, user: parsed.user ?? null }
  } catch {
    return emptySession
  }
}

export const persistSession = (session) => {
  try {
    if (!session?.token) {
      window.localStorage.removeItem(STORAGE_KEY)
      clearAuthToken()
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Sin almacenamiento disponible la sesión dura solo mientras la pestaña esté abierta.
  }
}

export const readErrorMessage = (error) => error?.message || 'No se pudo completar la operación.'
