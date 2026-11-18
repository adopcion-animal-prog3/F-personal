import { Link } from 'react-router-dom'
import MascotaCard from '../components/MascotaCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useMascotas from '../hooks/useMascotas'

function HistorialPage() {
  const { data: mascotas, error, status, retry } = useMascotas()
  const isEmpty = status === 'success' && mascotas.length === 0

  return (
    <div className="page-shell">
      <SectionCard title="Historial clínico" eyebrow="Seleccioná una mascota">
        {status === 'success' && !isEmpty ? (
          <div className="mascotas-grid">
            {mascotas.map((mascota) => (
              <MascotaCard key={mascota.id} mascota={mascota} to={`/historial/${mascota.id}`} />
            ))}
          </div>
        ) : (
          <MascotaResourceState status={isEmpty ? 'empty' : status}
            error={`No se pudieron cargar las mascotas. ${error}`}
            emptyMessage="Todavía no hay mascotas para consultar." onRetry={retry} />
        )}
        <Link className="button button-secondary page-action" to="/mascotas">Volver a mascotas</Link>
      </SectionCard>
    </div>
  )
}

export default HistorialPage
