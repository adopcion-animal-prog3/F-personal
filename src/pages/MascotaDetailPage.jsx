import { Link, useParams } from 'react-router-dom'
import MascotaCard from '../components/MascotaCard'
import MascotaManagementActions from '../components/MascotaManagementActions'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useAuth from '../hooks/useAuth'
import useMascota from '../hooks/useMascota'

function MascotaDetailPage() {
  const { id } = useParams()
  const { data: mascota, error, status, retry } = useMascota(id)
  const { user } = useAuth()
  const notFound = status === 'success' && !mascota

  return (
    <div className="page-shell">
      <SectionCard title="Detalle de mascota" eyebrow={`ID ${id}`}>
        {status === 'success' && mascota ? (
          <MascotaCard mascota={mascota} />
        ) : (
          <MascotaResourceState
            status={notFound ? 'empty' : status}
            error={`No se pudo cargar la mascota. ${error}`}
            emptyMessage="No se encontró una mascota con ese ID."
            loadingMessage="Cargando detalle de mascota..."
            onRetry={retry}
          />
        )}
        {user?.rol === 'ADMIN' && mascota ? <MascotaManagementActions mascota={mascota} /> : null}
        <Link className="button button-secondary mascota-back-link" to="/mascotas">
          Volver al listado
        </Link>
      </SectionCard>
    </div>
  )
}

export default MascotaDetailPage
