import PropTypes from 'prop-types'

function MascotaBadge({ adoptada }) {
  const label = adoptada ? 'Adoptada' : 'Disponible'
  const style = adoptada ? 'mascota-badge-adoptada' : 'mascota-badge-disponible'

  return <span className={`mascota-badge ${style}`}>{label}</span>
}

MascotaBadge.propTypes = {
  adoptada: PropTypes.bool.isRequired,
}

export default MascotaBadge
