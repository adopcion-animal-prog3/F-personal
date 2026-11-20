import { useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { HeroIllustration, Logo } from '../components/Illustrations'
import VerificationForm from '../components/VerificationForm'
import useAuth from '../hooks/useAuth'

const PROFESIONAL_URL = import.meta.env.VITE_PROFESIONAL_URL || '/profesional/'

const COPY = {
  login: { title: 'Bienvenido de nuevo', text: 'Ingresá con tu correo y contraseña. Te enviaremos un código para confirmar que sos vos.' },
  register: { title: 'Creá tu cuenta', text: 'Es gratis. Con tu cuenta podés solicitar adopciones y hablar con los refugios.' },
  verify: { title: 'Revisá tu correo', text: 'Último paso: escribí el código que te enviamos.' },
}

function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()
  const isLogin = location.pathname === '/login'
  const { clearError, cancelVerification } = auth

  useEffect(() => {
    clearError()
    cancelVerification()
  }, [clearError, cancelVerification, location.pathname])

  if (auth.isAuthenticated) return <Navigate to="/" replace />

  const step = auth.pendingVerification ? 'verify' : isLogin ? 'login' : 'register'
  const submit = (values) => (isLogin ? auth.login(values) : auth.register(values))
  const verify = async (codigo) => {
    if (await auth.verifyCode(codigo)) navigate('/', { state: { feedback: '¡Listo! Ya podés empezar a buscar a tu nueva mascota.' } })
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-aside-brand"><Logo size={48} /><strong>Huellitas</strong></div>
        <HeroIllustration />
        <p>Miles de mascotas esperan una familia. Una de ellas puede ser la tuya.</p>
      </aside>

      <section className="auth-card" aria-label={step === 'verify' ? 'Verificación por correo' : isLogin ? 'Inicio de sesión' : 'Registro de usuario'}>
        <p className="eyebrow">{step === 'verify' ? 'Verificación' : isLogin ? 'Iniciar sesión' : 'Registro'}</p>
        <h2>{COPY[step].title}</h2>
        <p className="auth-copy">{COPY[step].text}</p>

        {step === 'verify' ? (
          <VerificationForm email={auth.pendingVerification.email} onVerify={verify} onResend={auth.resendCode}
            onCancel={cancelVerification} isSubmitting={auth.isLoading} error={auth.error} />
        ) : (
          <>
            <AuthForm mode={isLogin ? 'login' : 'register'} onSubmit={submit} onClearError={clearError}
              isSubmitting={auth.isLoading} submitError={auth.error} />
            <div className="auth-footer">
              <span>{isLogin ? '¿Todavía no tenés cuenta?' : '¿Ya tenés cuenta?'}</span>
              <Link to={isLogin ? '/registro' : '/login'}>{isLogin ? 'Crear cuenta gratis' : 'Iniciar sesión'}</Link>
            </div>
          </>
        )}
        <p className="auth-portal-note">
          ¿Sos refugio o veterinaria? <a href={PROFESIONAL_URL}>Ingresá al portal profesional</a>.
        </p>
      </section>
    </div>
  )
}

export default AuthPage
