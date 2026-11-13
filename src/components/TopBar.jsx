import { Link } from 'react-router-dom'

function TopBar({ title }) {
  return (
    <header className="topbar" aria-label="Cabecera de aplicación">
      <div>
        <p className="eyebrow">Panel</p>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        <Link to="/login" className="button button-secondary">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="button button-primary">
          Crear cuenta
        </Link>
      </div>
    </header>
  )
}

export default TopBar
