import { Link } from 'react-router-dom'
import SolicitudCard from '../components/SolicitudCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import FeedbackMessage from '../components/FeedbackMessage'
import useAuth from '../hooks/useAuth'
import useSolicitudes from '../hooks/useSolicitudes'
import useRouteFeedback from '../hooks/useRouteFeedback'

function SolicitudesPage() {
  const { user } = useAuth()
  const feedback = useRouteFeedback()
  const resource = useSolicitudes(user)
  const solicitudes = resource.data?.solicitudes || []
  const mascotas = resource.data?.mascotas || []
  const isEmpty = resource.status === 'success' && solicitudes.length === 0
  const findMascota = (id) => mascotas.find((item) => String(item.id) === String(id))

  return (
    <div className="page-shell">
      <SectionCard title="Mis solicitudes" eyebrow="Adopción"
        description="Acá ves en qué estado está cada pedido de adopción que enviaste.">
        {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
        <Link className="button button-primary page-action" to="/solicitudes/nueva">
          Nueva solicitud
        </Link>
        {resource.status === 'success' && !isEmpty ? (
          <div className="record-list">
            {solicitudes.map((solicitud) => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud}
                mascota={findMascota(solicitud.mascota_id)} />
            ))}
          </div>
        ) : (
          <MascotaResourceState status={isEmpty ? 'empty' : resource.status}
            error={resource.error} emptyMessage="No tenés solicitudes para mostrar."
            loadingMessage="Cargando solicitudes..." onRetry={resource.retry} />
        )}
      </SectionCard>
    </div>
  )
}

export default SolicitudesPage
