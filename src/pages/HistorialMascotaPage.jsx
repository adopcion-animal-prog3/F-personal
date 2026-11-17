import { Link, useParams } from 'react-router-dom'
import HistorialRecordCard from '../components/HistorialRecordCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useHistorial from '../hooks/useHistorial'

function HistorialMascotaPage() {
  const { mascotaId } = useParams()
  const resource = useHistorial(mascotaId)
  const data = resource.data
  const notFound = resource.status === 'success' && !data?.mascota
  const isEmpty = resource.status === 'success' && data?.mascota && !data.registros.length

  return (
    <div className="page-shell">
      <SectionCard title={data?.mascota ? `Historial de ${data.mascota.nombre}` : 'Historial clínico'}
        eyebrow={`Mascota ${mascotaId}`}>
        {notFound ? (
          <MascotaResourceState status="empty" emptyMessage="No se encontró la mascota." />
        ) : resource.status === 'success' && data?.registros.length ? (
          <div className="record-list">
            {data.registros.map((registro) => (
              <HistorialRecordCard key={registro.id} mascotaId={mascotaId}
                registro={registro} onDeleted={resource.retry} />
            ))}
          </div>
        ) : (
          <MascotaResourceState status={isEmpty ? 'empty' : resource.status}
            error={resource.error} emptyMessage="Esta mascota no tiene registros clínicos."
            loadingMessage="Cargando historial clínico..." onRetry={resource.retry} />
        )}
        {data?.mascota ? (
          <Link className="button button-primary page-action" to={`/historial/${mascotaId}/nuevo`}>
            Agregar registro
          </Link>
        ) : null}
        <Link className="button button-secondary page-action" to="/historial">Volver a mascotas</Link>
      </SectionCard>
    </div>
  )
}

export default HistorialMascotaPage
