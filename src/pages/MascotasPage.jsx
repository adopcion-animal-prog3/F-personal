import PropTypes from 'prop-types'
import MascotaCard from '../components/MascotaCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import FeedbackMessage from '../components/FeedbackMessage'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useMascotas from '../hooks/useMascotas'
import useRouteFeedback from '../hooks/useRouteFeedback'

function MascotasList({ mascotas }) {
  return (
    <div className="mascotas-grid">
      {mascotas.map((mascota) => (
        <MascotaCard key={mascota.id} mascota={mascota} to={`/mascotas/${mascota.id}`} />
      ))}
    </div>
  )
}

MascotasList.propTypes = {
  mascotas: PropTypes.arrayOf(PropTypes.object).isRequired,
}

function MascotasPage() {
  const { data: mascotas, error, status, retry } = useMascotas()
  const { user } = useAuth()
  const feedback = useRouteFeedback()
  const isAdmin = user?.rol === 'ADMIN'
  const isEmpty = status === 'success' && mascotas.length === 0

  return (
    <div className="page-shell">
      <SectionCard title="Mascotas" eyebrow="Listado">
        {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
        {isAdmin ? (
          <Link className="button button-primary mascota-create-link" to="/mascotas/nueva">
            Agregar mascota
          </Link>
        ) : null}
        {status === 'success' && !isEmpty ? (
          <MascotasList mascotas={mascotas} />
        ) : (
          <MascotaResourceState
            status={isEmpty ? 'empty' : status}
            error={`No se pudieron cargar las mascotas. ${error}`}
            emptyMessage="Todavía no hay mascotas para mostrar."
            onRetry={retry}
          />
        )}
      </SectionCard>
    </div>
  )
}

export default MascotasPage
