import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from './Icon'

// Acciones del adoptante sobre una mascota: solicitar adopción y escribirle al publicador.
function MascotaAdopcionActions({ mascota, userId }) {
  const publicadorId = mascota.creado_por
  const puedeContactar = publicadorId != null && String(publicadorId) !== String(userId)

  return (
    <div className="mascota-actions">
      {mascota.adoptada ? (
        <p className="mascota-actions-note">Esta mascota ya fue adoptada. ¡Encontró su hogar! 🏡</p>
      ) : (
        <Link className="button button-primary button-lg" to={`/solicitudes/nueva?mascotaId=${mascota.id}`}>
          <Icon name="heart" /> Solicitar adopción
        </Link>
      )}
      {puedeContactar ? (
        <Link className="button button-secondary button-lg" to={`/mensajes/${publicadorId}?mascotaId=${mascota.id}`}>
          <Icon name="chat" /> Contactar al publicador
        </Link>
      ) : null}
    </div>
  )
}

MascotaAdopcionActions.propTypes = {
  mascota: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    adoptada: PropTypes.bool.isRequired,
    creado_por: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default MascotaAdopcionActions
