import { Link } from 'react-router-dom'
import { EmptyIllustration } from '../components/Illustrations'

function NotFoundPage() {
  return (
    <div className="page-shell not-found">
      <section className="panel not-found-card" role="status" aria-live="polite">
        <EmptyIllustration />
        <p className="eyebrow">Error 404</p>
        <h2>Página no encontrada</h2>
        <p>Esta página se escapó como un cachorro travieso. Volvé al inicio para seguir navegando.</p>
        <Link to="/" className="button button-primary">
          Volver al inicio
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
