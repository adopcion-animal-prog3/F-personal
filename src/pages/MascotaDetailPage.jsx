import { Link, useParams } from 'react-router-dom'
import MascotaBadge from '../components/MascotaBadge'
import MascotaCard from '../components/MascotaCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useMascota from '../hooks/useMascota'

function MascotaDetailPage() {
  const { id } = useParams()
  const { data: mascota, error, status, retry } = useMascota(id)

  return (
    <div className="page-shell">
      <SectionCard title="Detalle de mascota" eyebrow={`ID ${id}`}>
        {status === 'loading' || status === 'error' ? (
          <MascotaResourceState
            status={status}
            error={`No se pudo cargar la mascota. ${error}`}
            emptyMessage=""
            loadingMessage="Cargando detalle de mascota..."
            onRetry={retry}
          />
        ) : mascota ? (
          <div className="mascota-detail">
            <div className="mascota-detail-heading">
              <h3>{mascota.nombre}</h3>
              <MascotaBadge adoptada={mascota.adoptada} />
            </div>
            <MascotaCard mascota={mascota} showHeading={false} />
          </div>
        ) : (
          <MascotaResourceState
            status="empty"
            emptyMessage="No se encontró una mascota con ese ID."
          />
        )}
        <Link className="button button-secondary mascota-back-link" to="/mascotas">
          Volver al listado
        </Link>
      </SectionCard>
    </div>
  )
}

export default MascotaDetailPage
