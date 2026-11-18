import { useMemo, useState } from 'react'
import FeedbackMessage from '../components/FeedbackMessage'
import MascotaCard from '../components/MascotaCard'
import MascotaFilters from '../components/MascotaFilters'
import MascotaResourceState from '../components/MascotaResourceState'
import PageHeader from '../components/PageHeader'
import useMascotas from '../hooks/useMascotas'
import useRouteFeedback from '../hooks/useRouteFeedback'
import { filterMascotas } from '../utils/mascotaFilters'

const INITIAL_FILTERS = { texto: '', especie: 'todas', soloDisponibles: false }

function MascotasPage() {
  const { data, error, status, retry } = useMascotas()
  const feedback = useRouteFeedback()
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const mascotas = useMemo(() => data ?? [], [data])
  const visibles = useMemo(() => filterMascotas(mascotas, filters), [mascotas, filters])
  const sinPublicaciones = status === 'success' && mascotas.length === 0

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Adoptar" title="Mascotas"
        description="Tocá una mascota para conocerla, pedir su adopción o escribirle a quien la publicó." />
      {feedback ? <FeedbackMessage tone="success">{feedback}</FeedbackMessage> : null}

      {status === 'success' && !sinPublicaciones ? (
        <>
          <MascotaFilters filters={filters} onChange={setFilters} />
          <p className="results-count" role="status">
            {visibles.length === 1 ? '1 mascota encontrada' : `${visibles.length} mascotas encontradas`}
          </p>
          {visibles.length ? (
            <div className="mascotas-grid">
              {visibles.map((mascota) => (
                <MascotaCard key={mascota.id} mascota={mascota} to={`/mascotas/${mascota.id}`} />
              ))}
            </div>
          ) : (
            <MascotaResourceState status="empty" emptyMessage="Ninguna mascota coincide con tu búsqueda. Probá con otros filtros." />
          )}
        </>
      ) : (
        <MascotaResourceState
          status={sinPublicaciones ? 'empty' : status}
          error={`No se pudieron cargar las mascotas. ${error}`}
          emptyMessage="Todavía no hay mascotas publicadas para adopción. ¡Volvé pronto!"
          onRetry={retry}
        />
      )}
    </div>
  )
}

export default MascotasPage
