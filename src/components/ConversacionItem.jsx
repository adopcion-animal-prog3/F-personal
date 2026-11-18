import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatFechaMensaje } from '../utils/mensajeValidation'

const ROLE_LABELS = { ADMIN: 'Publicador', ADOPTANTE: 'Adoptante' }

function ConversacionItem({ conversacion }) {
  const { usuario, ultimo_mensaje: ultimo, no_leidos: noLeidos } = conversacion

  return (
    <Link className="conversacion-item" to={`/mensajes/${usuario.id}`}>
      <div className="conversacion-heading">
        <strong>{usuario.nombre}</strong>
        <span className="conversacion-rol">{ROLE_LABELS[usuario.rol] ?? usuario.rol}</span>
        {noLeidos > 0 ? (
          <span className="conversacion-badge" aria-label={`${noLeidos} sin leer`}>{noLeidos}</span>
        ) : null}
      </div>
      <p className="conversacion-preview">{ultimo.contenido}</p>
      <small>{formatFechaMensaje(ultimo.created_at)}</small>
    </Link>
  )
}

ConversacionItem.propTypes = {
  conversacion: PropTypes.shape({
    usuario: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      rol: PropTypes.string,
    }).isRequired,
    ultimo_mensaje: PropTypes.shape({
      contenido: PropTypes.string.isRequired,
      created_at: PropTypes.string,
    }).isRequired,
    no_leidos: PropTypes.number.isRequired,
  }).isRequired,
}

export default ConversacionItem
