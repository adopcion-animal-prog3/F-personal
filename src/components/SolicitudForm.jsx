import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function SolicitudForm({
  mascotas, values, errors, onChange, onSubmit, cancelTo, isSubmitting, submitError,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {submitError ? <p className="form-alert form-alert-error" role="alert">{submitError}</p> : null}
      <label className="field" htmlFor="mascotaId">
        <span>Mascota *</span>
        <select id="mascotaId" value={values.mascotaId} aria-invalid={Boolean(errors.mascotaId)}
          onChange={(event) => onChange('mascotaId', event.target.value)}>
          <option value="">Seleccioná una mascota</option>
          {mascotas.map((mascota) => (
            <option key={mascota.id} value={String(mascota.id)}>
              {mascota.nombre} ({mascota.especie})
            </option>
          ))}
        </select>
        {errors.mascotaId ? <small>{errors.mascotaId}</small> : null}
      </label>
      <label className="field" htmlFor="mensaje">
        <span>Mensaje</span>
        <textarea id="mensaje" value={values.mensaje}
          onChange={(event) => onChange('mensaje', event.target.value)} />
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting || !mascotas.length}>
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
