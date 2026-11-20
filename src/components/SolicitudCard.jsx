import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SolicitudEstadoBadge from './SolicitudEstadoBadge'

function SolicitudCard({ solicitud, mascota }) {
  const publicadorId = mascota?.creado_por

  return (
    <article className="record-card">
      <header className="record-card-heading">
        <h3>Solicitud #{solicitud.id}</h3>
        <SolicitudEstadoBadge estado={solicitud.estado} />
      </header>
      <dl className="record-fields">
        <div><dt>Mascota</dt><dd>{mascota?.nombre || `ID ${solicitud.mascota_id}`}</dd></div>
        <div className="record-description"><dt>Mensaje</dt><dd>{solicitud.mensaje || 'Sin mensaje'}</dd></div>
      </dl>
      {publicadorId != null ? (
        <Link className="button button-secondary"
          to={`/mensajes/${publicadorId}?mascotaId=${solicitud.mascota_id}`}>
          Escribir al publicador
        </Link>
      ) : null}
    </article>
  )
}

SolicitudCard.propTypes = {
  solicitud: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mascota_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    estado: PropTypes.oneOf(['PENDIENTE', 'APROBADA', 'RECHAZADA']).isRequired,
    mensaje: PropTypes.string,
  }).isRequired,
  mascota: PropTypes.shape({
    nombre: PropTypes.string,
    creado_por: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

export default SolicitudCard
