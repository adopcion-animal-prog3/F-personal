import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FeedbackMessage from './FeedbackMessage'

function SolicitudForm({
  mascotas, values, errors, onChange, onSubmit, cancelTo, isSubmitting, submitError,
}) {
  const mascotasDisponibles = mascotas.filter((mascota) => !mascota.adoptada)

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
      {submitError ? <FeedbackMessage>{submitError}</FeedbackMessage> : null}
      <label className="field" htmlFor="mascotaId">
        <span>Mascota *</span>
        <select id="mascotaId" value={values.mascotaId} aria-invalid={Boolean(errors.mascotaId)}
          aria-describedby={errors.mascotaId ? 'mascotaId-error' : undefined}
          onChange={(event) => onChange('mascotaId', event.target.value)}>
          <option value="">Seleccioná una mascota</option>
          {mascotasDisponibles.map((mascota) => (
            <option key={mascota.id} value={String(mascota.id)}>
              {mascota.nombre} ({mascota.especie})
            </option>
          ))}
        </select>
        {errors.mascotaId ? <small id="mascotaId-error">{errors.mascotaId}</small> : null}
        {!mascotasDisponibles.length ? <small>No hay mascotas disponibles para adoptar.</small> : null}
      </label>
      <label className="field" htmlFor="mensaje">
        <span>Mensaje</span>
        <textarea id="mensaje" value={values.mensaje}
          onChange={(event) => onChange('mensaje', event.target.value)} />
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting || !mascotasDisponibles.length}>
          {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
        </button>
        <Link className="button button-secondary" to={cancelTo}>Cancelar</Link>
      </div>
    </form>
  )
}

SolicitudForm.propTypes = {
  mascotas: PropTypes.arrayOf(PropTypes.object).isRequired,
  values: PropTypes.shape({ mascotaId: PropTypes.string, mensaje: PropTypes.string }).isRequired,
  errors: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, cancelTo: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired, submitError: PropTypes.string.isRequired,
}

export default SolicitudForm
