import { Link, useParams } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import Icon from '../components/Icon'
import MascotaAdopcionActions from '../components/MascotaAdopcionActions'
import MascotaCard from '../components/MascotaCard'
import MascotaResourceState from '../components/MascotaResourceState'
import PageHeader from '../components/PageHeader'
import useAuth from '../hooks/useAuth'
import useMascota from '../hooks/useMascota'
import useRouteFeedback from '../hooks/useRouteFeedback'

function MascotaDetailPage() {
  const { id } = useParams()
  const { data: mascota, error, status, retry } = useMascota(id)
  const { user } = useAuth()
  const feedback = useRouteFeedback()
  const notFound = status === 'success' && !mascota

  return (
    <div className="page-shell">
      <Link className="back-link mascota-back-link" to="/mascotas">
        <Icon name="arrowLeft" size={18} /> Volver al listado
      </Link>
      <PageHeader eyebrow="Conocé a tu futura mascota" title="Detalle de mascota" />
      {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}
      {status === 'success' && mascota ? (
        <div className="detail-layout">
          <MascotaCard mascota={mascota} />
          <aside className="detail-panel">
            <h2>¿Te enamoraste de {mascota.nombre}?</h2>
            <p>Enviá una solicitud de adopción o escribile a quien la publicó para resolver tus dudas.</p>
            <MascotaAdopcionActions mascota={mascota} userId={user?.id} />
          </aside>
        </div>
      ) : (
        <MascotaResourceState
          status={notFound ? 'empty' : status}
          error={`No se pudo cargar la mascota. ${error}`}
          emptyMessage="No se encontró una mascota con ese ID."
          loadingMessage="Cargando detalle de mascota..."
          onRetry={retry}
        />
      )}
    </div>
  )
}

export default MascotaDetailPage
