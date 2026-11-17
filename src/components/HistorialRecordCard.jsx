import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import useDeleteHistorial from '../hooks/useDeleteHistorial'

function HistorialRecordCard({ mascotaId, registro, onDeleted }) {
  const { remove, error, isDeleting } = useDeleteHistorial(registro.id)

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este registro clínico?')) return
    if (await remove()) onDeleted()
  }

  return (
    <article className="record-card">
      <h3>{registro.fecha_registro || 'Fecha no informada'}</h3>
      <p>{registro.descripcion}</p>
      <p><strong>Veterinario:</strong> {registro.veterinario || 'No informado'}</p>
      {error ? <p className="form-alert form-alert-error" role="alert">{error}</p> : null}
      <div className="record-actions">
        <Link className="button button-secondary" to={`/historial/${mascotaId}/${registro.id}/editar`}>
          Editar
        </Link>
        <button className="button button-danger" type="button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </article>
  )
}

HistorialRecordCard.propTypes = {
  mascotaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  registro: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fecha_registro: PropTypes.string, descripcion: PropTypes.string.isRequired,
    veterinario: PropTypes.string,
  }).isRequired,
  onDeleted: PropTypes.func.isRequired,
}

export default HistorialRecordCard
