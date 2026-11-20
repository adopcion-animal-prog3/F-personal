import { Link, NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Icon from './Icon'
import { Logo } from './Illustrations'

const navigationItems = [
  { label: 'Inicio', path: '/', icon: 'home' },
  { label: 'Adoptar', path: '/mascotas', icon: 'paw' },
  { label: 'Mis solicitudes', path: '/solicitudes', icon: 'list' },
  { label: 'Mensajes', path: '/mensajes', icon: 'chat' },
]

function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="Huellitas, ir al inicio">
          <Logo size={40} />
          <span>
            <strong>Huellitas</strong>
            <small>Adopción responsable</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Menú principal">
          {navigationItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="user-area">
          <span className="user-pill" title={user?.email}>Hola, {user?.nombre?.split(' ')[0] || 'adoptante'}</span>
          <button type="button" className="button button-ghost" onClick={logout}>
            <Icon name="logout" size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
