import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page-shell">
      <section className="auth-card not-found-card" aria-live="polite">
        <p className="eyebrow">404</p>
        <h2>Página no encontrada</h2>
        <p>La ruta solicitada aún no existe o no está disponible en esta versión del frontend.</p>
        <Link to="/" className="button button-primary">
          Volver al inicio
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
