import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Mascotas', path: '/mascotas' },
  { label: 'Solicitudes', path: '/solicitudes' },
  { label: 'Historial', path: '/historial' },
]

function SidebarNav() {
  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand-block">
        <span className="brand-mark">F</span>
        <div>
          <p className="brand-label">F-personal</p>
          <strong>Adopción</strong>
        </div>
      </div>

      <nav className="nav-list" aria-label="Menú principal">
        {navigationItems.map((item) => (
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
