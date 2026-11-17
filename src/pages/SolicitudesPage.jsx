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

  return (
    <div className="page-shell">
      <SectionCard title="Solicitudes" eyebrow="Adopción">
        {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
        {['ADMIN', 'ADOPTANTE'].includes(user?.rol) ? (
          <Link className="button button-primary page-action" to="/solicitudes/nueva">
            Nueva solicitud
          </Link>
        ) : null}
        {resource.operationError ? <FeedbackMessage>{resource.operationError}</FeedbackMessage> : null}
        {resource.operationSuccess ? (
          <FeedbackMessage tone="success">{resource.operationSuccess}</FeedbackMessage>
        ) : null}
        {resource.status === 'success' && !isEmpty ? (
          <div className="record-list">
            {solicitudes.map((solicitud) => {
              const mascota = mascotas.find((item) => String(item.id) === String(solicitud.mascota_id))
              return (
                <SolicitudCard key={solicitud.id} solicitud={solicitud}
                  mascotaNombre={mascota?.nombre} isAdmin={resource.isAdmin}
                  onUpdateStatus={resource.updateStatus} />
              )
            })}
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
