import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function TopBar({ title }) {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="topbar" aria-label="Cabecera de aplicación">
      <div>
        <p className="eyebrow">Panel</p>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        {isAuthenticated ? (
          <>
            <span className="user-pill">{user?.nombre || user?.email || 'Usuario'}</span>
            <button type="button" className="button button-secondary" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="button button-secondary">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="button button-primary">
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default TopBar
