import PropTypes from 'prop-types'

function SolicitudEstadoBadge({ estado }) {
  return <span className={`solicitud-status status-${estado.toLowerCase()}`}>{estado}</span>
}

SolicitudEstadoBadge.propTypes = {
  estado: PropTypes.oneOf(['PENDIENTE', 'APROBADA', 'RECHAZADA']).isRequired,
}

export default SolicitudEstadoBadge
