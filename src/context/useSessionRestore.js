import { useEffect } from 'react'
import { authService } from '../services/authService'
import { emptySession } from './sessionStorage'

// Al abrir la app con una sesión guardada, la valida contra la API (/api/auth/me).
function useSessionRestore({ session, setSession, setIsLoading, setError }) {
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
        if (!cancelled) setSession((current) => ({ ...current, user: profile ?? current.user }))
      } catch {
        if (!cancelled) {
          setSession(emptySession)
          setError('La sesión no pudo validarse. Iniciá sesión nuevamente.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [session.token, setError, setIsLoading, setSession])
}

export default useSessionRestore
