import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { clearAuthToken, setAuthToken } from '../services/api'

const STORAGE_KEY = 'f-personal-auth-session'
const emptySession = { token: '', user: null }

const AuthContext = createContext(null)

const getStoredSession = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return emptySession
    }

    const parsed = JSON.parse(raw)

    if (!parsed?.token) {
      return emptySession
    }

    setAuthToken(parsed.token)

    return {
      token: parsed.token,
      user: parsed.user ?? null,
    }
  } catch {
    return emptySession
  }
}

const persistSession = (session) => {
  if (!session?.token) {
    window.localStorage.removeItem(STORAGE_KEY)
    clearAuthToken()
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const readErrorMessage = (error) => {
  if (error?.message) {
    return error.message
  }

  return 'No se pudo completar la operación.'
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const [isLoading, setIsLoading] = useState(Boolean(getStoredSession().token))
  const [error, setError] = useState('')

  useEffect(() => {
    persistSession(session)
  }, [session])

  useEffect(() => {
    let cancelled = false

    const restoreSession = async () => {
      if (!session.token) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const profile = await authService.getCurrentUser(session.token)

        if (!cancelled) {
          setSession((current) => ({
            ...current,
            user: profile ?? current.user,
          }))
        }
      } catch {
        if (!cancelled) {
          setSession(emptySession)
          setError('La sesión no pudo validarse. Iniciá sesión nuevamente.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [session.token])

  const login = async (credentials) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.login(credentials)

      if (!response?.token) {
        throw new Error('La API no devolvió un token válido.')
      }

      const nextSession = {
        token: response.token,
        user: response.user ?? session.user,
      }

      setSession(nextSession)
      return true
    } catch (authError) {
      setError(readErrorMessage(authError))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.register(credentials)

      if (!response || (!response.token && !response.user)) {
        return true
      }

      const nextSession = {
        token: response.token ?? '',
        user: response.user ?? null,
      }

      if (nextSession.token) {
        setSession(nextSession)
      }

      return true
    } catch (authError) {
      setError(readErrorMessage(authError))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setSession(emptySession)
    clearAuthToken()
    setError('')
  }

  const clearError = () => {
    setError('')
  }

  const value = useMemo(
    () => ({
      session,
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token),
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [session, isLoading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
