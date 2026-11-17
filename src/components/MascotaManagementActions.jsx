import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import useDeleteMascota from '../hooks/useDeleteMascota'

function MascotaManagementActions({ mascota }) {
  const navigate = useNavigate()
  const { remove, error, isDeleting } = useDeleteMascota(mascota.id)

  const handleDelete = async () => {
    if (!window.confirm(`¿Querés eliminar a ${mascota.nombre}?`)) return
    if (await remove()) navigate('/mascotas', { replace: true })
  }

  return (
    <div className="mascota-management">
      {error ? <p className="form-alert form-alert-error" role="alert">{error}</p> : null}
      <Link className="button button-primary" to={`/mascotas/${mascota.id}/editar`}>
        Editar mascota
      </Link>
      <button className="button button-danger" type="button" onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Eliminando...' : 'Eliminar mascota'}
      </button>
    </div>
  )
}

MascotaManagementActions.propTypes = {
  mascota: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired }).isRequired,
}

export default MascotaManagementActions
