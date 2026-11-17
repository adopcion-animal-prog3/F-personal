import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import SolicitudEstadoBadge from './SolicitudEstadoBadge'
import { SOLICITUD_ESTADOS } from '../utils/solicitudValidation'

function SolicitudCard({ solicitud, mascotaNombre, isAdmin, onUpdateStatus }) {
  const [estado, setEstado] = useState(solicitud.estado)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => setEstado(solicitud.estado), [solicitud.estado])

  const handleUpdate = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    await onUpdateStatus(solicitud.id, estado)
    setEstado(solicitud.estado)
    setIsSaving(false)
  }

  return (
    <article className="record-card">
      <header className="record-card-heading">
        <h3>Solicitud #{solicitud.id}</h3>
        <SolicitudEstadoBadge estado={solicitud.estado} />
      </header>
      <dl className="record-fields">
        <div><dt>Mascota</dt><dd>{mascotaNombre || `ID ${solicitud.mascota_id}`}</dd></div>
        {isAdmin ? <div><dt>Solicitante</dt><dd>Usuario #{solicitud.usuario_id}</dd></div> : null}
        <div className="record-description"><dt>Mensaje</dt><dd>{solicitud.mensaje || 'Sin mensaje'}</dd></div>
      </dl>
      {isAdmin ? (
        <form className="record-actions" onSubmit={handleUpdate}>
          <label className="field" htmlFor={`estado-${solicitud.id}`}>Estado</label>
          <select id={`estado-${solicitud.id}`} value={estado} disabled={isSaving}
            onChange={(event) => setEstado(event.target.value)}>
            {SOLICITUD_ESTADOS.map((option) => <option key={option}>{option}</option>)}
          </select>
          <button className="button button-primary" type="submit" disabled={isSaving || estado === solicitud.estado}>
            {isSaving ? 'Actualizando...' : 'Actualizar estado'}
          </button>
        </form>
      ) : null}
    </article>
  )
}

SolicitudCard.propTypes = {
  solicitud: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    usuario_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mascota_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    estado: PropTypes.oneOf(['PENDIENTE', 'APROBADA', 'RECHAZADA']).isRequired,
    mensaje: PropTypes.string,
  }).isRequired,
  mascotaNombre: PropTypes.string, isAdmin: PropTypes.bool.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
}

export default SolicitudCard
