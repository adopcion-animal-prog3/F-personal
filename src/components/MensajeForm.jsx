import { useState } from 'react'
import PropTypes from 'prop-types'
import FeedbackMessage from './FeedbackMessage'
import { MAX_CONTENIDO } from '../utils/mensajeValidation'

function MensajeForm({ onSend, isSending, error }) {
  const [contenido, setContenido] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (await onSend(contenido)) setContenido('')
  }

  return (
    <form className="mensaje-form" onSubmit={handleSubmit} noValidate aria-busy={isSending}>
      {error ? <FeedbackMessage>{error}</FeedbackMessage> : null}
      <label className="field" htmlFor="mensaje-contenido">
        <span>Nuevo mensaje</span>
        <textarea id="mensaje-contenido" value={contenido} maxLength={MAX_CONTENIDO}
          onChange={(event) => setContenido(event.target.value)} rows={3} />
      </label>
      <button className="button button-primary" type="submit" disabled={isSending}>
        {isSending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

MensajeForm.propTypes = {
  onSend: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

export default MensajeForm
