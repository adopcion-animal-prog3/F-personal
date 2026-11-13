import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navigationItems = [
  { label: 'Inicio', path: '/', roles: ['ADMIN', 'ADOPTANTE'] },
  { label: 'Mascotas', path: '/mascotas', roles: ['ADMIN', 'ADOPTANTE'] },
  { label: 'Solicitudes', path: '/solicitudes', roles: ['ADMIN', 'ADOPTANTE'] },
  { label: 'Historial', path: '/historial', roles: ['ADMIN'] },
]

function SidebarNav() {
  const { user } = useAuth()
  const role = user?.rol || 'ADOPTANTE'

  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand-block">
        <span className="brand-mark">F</span>
        <div>
          <p className="brand-label">F-personal</p>
          <strong>{role === 'ADMIN' ? 'Administrador' : 'Adoptante'}</strong>
        </div>
      </div>

      <nav className="nav-list" aria-label="Menú principal">
        {navigationItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}

export default SidebarNav
