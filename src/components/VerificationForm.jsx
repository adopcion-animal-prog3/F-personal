import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FeedbackMessage from './FeedbackMessage'
import Icon from './Icon'

const RESEND_SECONDS = 60

// Segundo paso de registro e inicio de sesión: el código de 6 dígitos que llega por correo.
function VerificationForm({ email, onVerify, onResend, onCancel, isSubmitting, error }) {
  const [codigo, setCodigo] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (secondsLeft <= 0) return undefined
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (codigo.length === 6) onVerify(codigo)
  }

  const handleResend = async () => {
    setNotice('')
    if (await onResend()) {
      setSecondsLeft(RESEND_SECONDS)
      setNotice('Te enviamos un código nuevo.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <div className="verification-intro">
        <span className="verification-icon"><Icon name="mail" size={28} /></span>
        <p>Te enviamos un código de 6 números a <strong>{email}</strong>. Revisá tu bandeja de entrada (y el correo no deseado).</p>
      </div>
      {error ? <FeedbackMessage>{error}</FeedbackMessage> : null}
      {notice ? <FeedbackMessage tone="success">{notice}</FeedbackMessage> : null}
      <label className="field" htmlFor="codigo">
        <span>Código de verificación</span>
        <input id="codigo" name="codigo" className="code-input" inputMode="numeric"
          autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo}
          onChange={(event) => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6))} />
      </label>
      <button type="submit" className="button button-primary auth-submit" disabled={isSubmitting || codigo.length !== 6}>
        {isSubmitting ? 'Verificando...' : 'Confirmar código'}
      </button>
      <div className="verification-links">
        <button type="button" className="link-button" onClick={handleResend} disabled={secondsLeft > 0 || isSubmitting}>
          {secondsLeft > 0 ? `Reenviar código en ${secondsLeft} s` : 'Reenviar código'}
        </button>
        <button type="button" className="link-button" onClick={onCancel}>Usar otro correo</button>
      </div>
    </form>
  )
}

VerificationForm.propTypes = {
  email: PropTypes.string.isRequired,
  onVerify: PropTypes.func.isRequired,
  onResend: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  error: PropTypes.string,
}

export default VerificationForm
