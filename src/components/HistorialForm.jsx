import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

function HistorialForm({ values, errors, onChange, onSubmit, cancelTo, isSubmitting, submitError }) {
  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {submitError ? <p className="form-alert form-alert-error" role="alert">{submitError}</p> : null}
      <label className="field" htmlFor="fecha_registro">
        <span>Fecha de registro</span>
        <input id="fecha_registro" type="date" value={values.fecha_registro}
          onChange={(event) => onChange('fecha_registro', event.target.value)} />
      </label>
      <label className="field" htmlFor="descripcion">
        <span>Descripción *</span>
        <textarea id="descripcion" value={values.descripcion}
          aria-invalid={Boolean(errors.descripcion)}
          onChange={(event) => onChange('descripcion', event.target.value)} />
        {errors.descripcion ? <small>{errors.descripcion}</small> : null}
      </label>
      <label className="field" htmlFor="veterinario">
        <span>Veterinario</span>
        <input id="veterinario" value={values.veterinario}
          onChange={(event) => onChange('veterinario', event.target.value)} />
      </label>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar registro'}
        </button>
        <Link className="button button-secondary" to={cancelTo}>Cancelar</Link>
      </div>
    </form>
  )
}

HistorialForm.propTypes = {
  values: PropTypes.shape({
    fecha_registro: PropTypes.string, descripcion: PropTypes.string, veterinario: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, cancelTo: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired, submitError: PropTypes.string.isRequired,
}

export default HistorialForm
