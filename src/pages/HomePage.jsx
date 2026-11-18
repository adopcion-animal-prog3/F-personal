import { Link } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import Icon from '../components/Icon'
import { HeroIllustration } from '../components/Illustrations'
import useAuth from '../hooks/useAuth'
import useRouteFeedback from '../hooks/useRouteFeedback'

const steps = [
  { icon: 'search', title: 'Buscá', text: 'Mirá las mascotas que publican refugios y veterinarias. Filtrá por perro, gato u otras.' },
  { icon: 'heart', title: 'Solicitá', text: 'Elegí a tu compañero y enviá una solicitud de adopción con un mensaje.' },
  { icon: 'chat', title: 'Conversá', text: 'Hablá con quien la publicó para conocerla y coordinar el encuentro.' },
]

function HomePage() {
  const feedback = useRouteFeedback()
  const { user } = useAuth()

  return (
    <div className="page-shell">
      {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Bienvenido{user?.nombre ? `, ${user.nombre.split(' ')[0]}` : ''}</p>
          <h1 id="hero-title">Encontrá a tu próximo mejor amigo</h1>
          <p className="hero-text">
            En Huellitas, refugios y veterinarias publican mascotas que buscan un hogar.
            Adoptar es simple, seguro y gratuito.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-lg" to="/mascotas">
              <Icon name="paw" /> Explorar mascotas
            </Link>
            <Link className="button button-secondary button-lg" to="/mensajes">
              <Icon name="chat" /> Ver mis mensajes
            </Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="steps" aria-labelledby="steps-title">
        <h2 id="steps-title">¿Cómo adoptar? Solo 3 pasos</h2>
        <ol className="steps-grid">
          {steps.map((step, index) => (
            <li key={step.title} className="step-card">
              <span className="step-icon"><Icon name={step.icon} size={26} /></span>
              <span className="step-number">Paso {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

export default HomePage
