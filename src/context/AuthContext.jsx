import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { authService } from '../services/authService'
import { API_UNAUTHORIZED_EVENT, clearAuthToken } from '../services/api'
import AuthContext from './AuthContextValue'
import { emptySession, getStoredSession, persistSession, readErrorMessage } from './sessionStorage'
import useSessionRestore from './useSessionRestore'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const [isLoading, setIsLoading] = useState(() => Boolean(session.token))
  const [error, setError] = useState('')
  // Registro e inicio de sesión quedan pendientes hasta validar el código del correo.
  const [pendingVerification, setPendingVerification] = useState(null)

  useEffect(() => persistSession(session), [session])
  useSessionRestore({ session, setSession, setIsLoading, setError })

  useEffect(() => {
    const handleUnauthorized = () => {
      setSession(emptySession)
      setError('La sesión expiró o dejó de ser válida. Iniciá sesión nuevamente.')
    }
    window.addEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(API_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  // Ejecuta una acción de autenticación con estado de carga y mensaje de error uniforme.
  const run = useCallback(async (action) => {
    setError('')
    setIsLoading(true)
    try {
      return await action()
    } catch (authError) {
      setError(readErrorMessage(authError))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startVerification = useCallback((request) => run(async () => {
    const { verificacion } = await request()
    setPendingVerification(verificacion)
    return true
  }), [run])

  const login = useCallback((credentials) => startVerification(() => authService.login(credentials)), [startVerification])
  const register = useCallback((values) => startVerification(() => authService.register(values)), [startVerification])

  const verifyCode = useCallback((codigo) => run(async () => {
    const response = await authService.verify({ email: pendingVerification?.email, codigo })
    setSession({ token: response.token, user: response.user })
    setPendingVerification(null)
    return true
  }), [pendingVerification, run])

  const resendCode = useCallback(() => run(async () => {
    await authService.resendCode(pendingVerification?.email)
    return true
  }), [pendingVerification, run])

  const cancelVerification = useCallback(() => {
    setPendingVerification(null)
    setError('')
  }, [])

  const logout = useCallback(() => {
    setSession(emptySession)
    clearAuthToken()
    setError('')
  }, [])

  const clearError = useCallback(() => setError(''), [])

  const value = useMemo(() => ({
    session,
    user: session.user,
    token: session.token,
    isAuthenticated: Boolean(session.token),
    isLoading,
    error,
    pendingVerification,
    login,
    register,
    verifyCode,
    resendCode,
    cancelVerification,
    logout,
    clearError,
  }), [session, isLoading, error, pendingVerification, login, register, verifyCode, resendCode,
    cancelVerification, logout, clearError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
