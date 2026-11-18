import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import FeedbackMessage from '../components/FeedbackMessage'
import useAuth from '../hooks/useAuth'

function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, login, register, error, clearError, isLoading } = useAuth()
  const isLogin = location.pathname === '/login'
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    clearError()
  }, [clearError, location.pathname])

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      const action = isLogin ? login : register
      const success = await action(values)

      if (success && isLogin) {
        navigate('/', {
          state: { feedback: 'Sesión iniciada correctamente.' },
        })
      } else if (success) {
        navigate('/login', {
          replace: true,
          state: { feedback: 'Registro completado. Iniciá sesión para continuar.' },
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell auth-shell">
      <section className="auth-card" aria-label={isLogin ? 'Inicio de sesión' : 'Registro de usuario'}>
        <p className="eyebrow">{isLogin ? 'Iniciar sesión' : 'Registro'}</p>
        <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crear una cuenta'}</h2>
        <p className="auth-copy">
          {isLogin
            ? 'Ingresá tus datos para continuar con tu sesión.'
            : 'Completá los datos para registrarte en la plataforma.'}
        </p>

        {location.state?.feedback ? (
          <FeedbackMessage tone="success">{location.state.feedback}</FeedbackMessage>
        ) : null}

        <AuthForm
          mode={isLogin ? 'login' : 'register'}
          onSubmit={handleSubmit}
          onClearError={clearError}
          isSubmitting={submitting || isLoading}
          submitError={error}
        />

        <div className="auth-footer">
          <span>{isLogin ? 'Todavía no tenés cuenta?' : 'Ya tenés cuenta?'}</span>
          <Link to={isLogin ? '/registro' : '/login'}>
            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AuthPage
