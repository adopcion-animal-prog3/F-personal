import { Link } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import useRouteFeedback from '../hooks/useRouteFeedback'

function HomePage() {
  const feedback = useRouteFeedback()

  return (
    <div className="page-shell">
      {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
      <section className="hero-panel" aria-label="Inicio">
        <div>
          <p className="eyebrow">Bienvenido</p>
          <h2>Gestión de adopciones</h2>
        </div>
        <p>
          Consultá las mascotas disponibles y encontrá una compañera para sumar a tu familia.
        </p>
        <Link className="button button-primary page-action" to="/mascotas">
          Explorar mascotas
        </Link>
      </section>
    </div>
  )
}

export default HomePage
