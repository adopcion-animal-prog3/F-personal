import { Outlet } from 'react-router-dom'
import Icon from './Icon'
import SiteHeader from './SiteHeader'

// Portal profesional (Vue) donde refugios y veterinarias publican mascotas.
const PROFESIONAL_URL = import.meta.env.VITE_PROFESIONAL_URL || '/profesional/'

function AppLayout() {
  return (
    <div className="app-layout">
      <SiteHeader />
      <main className="content-area" id="contenido">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Huellitas · Conectamos mascotas con familias que las esperan 💚</p>
        <a href={PROFESIONAL_URL} className="footer-link">
          <Icon name="building" size={18} />
          ¿Sos refugio o veterinaria? Publicá mascotas en el portal profesional
        </a>
      </footer>
    </div>
  )
}

export default AppLayout
