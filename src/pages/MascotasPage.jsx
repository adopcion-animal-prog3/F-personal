import MascotaCard from '../components/MascotaCard'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useMascotas from '../hooks/useMascotas'

function MascotasPage() {
  const { data: mascotas, error, status, retry } = useMascotas()
  const hasMascotas = status === 'success' && mascotas.length > 0

  return (
    <div className="page-shell">
      <SectionCard title="Mascotas" eyebrow="Listado">
        {status !== 'success' ? (
          <MascotaResourceState
            status={status}
            error={`No se pudieron cargar las mascotas. ${error}`}
            emptyMessage=""
            onRetry={retry}
          />
        ) : hasMascotas ? (
          <div className="mascotas-grid">
            {mascotas.map((mascota) => (
              <MascotaCard
                key={mascota.id}
                mascota={mascota}
                to={`/mascotas/${mascota.id}`}
              />
            ))}
          </div>
        ) : (
          <MascotaResourceState
            status="empty"
            emptyMessage="Todavía no hay mascotas para mostrar."
          />
        )}
      </SectionCard>
    </div>
  )
}

export default MascotasPage
