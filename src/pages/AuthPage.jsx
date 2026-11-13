import { Link, useLocation } from 'react-router-dom'

function AuthPage() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <div className="page-shell auth-shell">
      <section className="auth-card" aria-label={isLogin ? 'Inicio de sesión' : 'Registro de usuario'}>
        <p className="eyebrow">Autenticación</p>
        <h2>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        <p className="auth-copy">
          Este flujo está preparado para la autenticación y la sesión, pendiente de integración
          con la API real.
        </p>
        <div className="auth-actions">
          <Link to={isLogin ? '/registro' : '/login'} className="button button-primary">
            {isLogin ? 'Ir a registro' : 'Ir a login'}
          </Link>
          <Link to="/" className="button button-secondary">
            Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AuthPage
