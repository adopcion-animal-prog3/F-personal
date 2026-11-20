import PropTypes from 'prop-types'
import { formatFechaMensaje } from '../utils/mensajeValidation'

function MensajeHilo({ mensajes, userId }) {
  if (!mensajes.length) {
    return <p className="resource-state" role="status">Todavía no hay mensajes. Escribí el primero.</p>
  }

  return (
    <ol className="mensaje-hilo" aria-label="Mensajes de la conversación">
      {mensajes.map((mensaje) => {
        const propio = String(mensaje.remitente_id) === String(userId)
        return (
          <li key={mensaje.id} className={`mensaje ${propio ? 'mensaje-propio' : 'mensaje-recibido'}`}>
            <p>{mensaje.contenido}</p>
            <small>{propio ? 'Vos' : 'Recibido'} · {formatFechaMensaje(mensaje.created_at)}</small>
          </li>
        )
      })}
    </ol>
  )
}

MensajeHilo.propTypes = {
  mensajes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    remitente_id: PropTypes.number.isRequired,
    contenido: PropTypes.string.isRequired,
    created_at: PropTypes.string,
  })).isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default MensajeHilo
