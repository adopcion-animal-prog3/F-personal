import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FeedbackMessage from './FeedbackMessage'

const fields = [
  { name: 'nombre', label: 'Nombre', required: true, maxLength: 150 },
  { name: 'especie', label: 'Especie', required: true, maxLength: 100 },
  { name: 'raza', label: 'Raza', maxLength: 120 },
]

function TextField({ name, label, value, error, required, maxLength, onChange }) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}{required ? ' *' : ''}</span>
      <input id={name} name={name} value={value} required={required} maxLength={maxLength}
        aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => onChange(name, event.target.value)} />
      {error ? <small id={`${name}-error`}>{error}</small> : null}
    </label>
  )
}

TextField.propTypes = {
  name: PropTypes.string.isRequired, label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired, error: PropTypes.string,
  required: PropTypes.bool, maxLength: PropTypes.number, onChange: PropTypes.func.isRequired,
}

function MascotaForm({ values, errors, onChange, onSubmit, cancelTo, isSubmitting, submitError }) {
  return (
    <form className="auth-form mascota-form" onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
      {submitError ? <FeedbackMessage>{submitError}</FeedbackMessage> : null}
      {fields.map((field) => (
        <TextField key={field.name} {...field} value={values[field.name]}
          error={errors[field.name]} onChange={onChange} />
      ))}
      <label className="field" htmlFor="edad">
        <span>Edad</span>
        <input id="edad" name="edad" type="number" min="0" max="2147483647" step="1" value={values.edad}
          aria-invalid={Boolean(errors.edad)} aria-describedby={errors.edad ? 'edad-error' : undefined}
          onChange={(event) => onChange('edad', event.target.value)} />
        {errors.edad ? <small id="edad-error">{errors.edad}</small> : null}
      </label>
      <label className="field" htmlFor="sexo">
        <span>Sexo</span>
        <select id="sexo" name="sexo" value={values.sexo}
          aria-invalid={Boolean(errors.sexo)} aria-describedby={errors.sexo ? 'sexo-error' : undefined}
          onChange={(event) => onChange('sexo', event.target.value)}>
          <option value="">Sin especificar</option>
          <option value="M">M</option><option value="F">F</option><option value="OTRO">OTRO</option>
        </select>
        {errors.sexo ? <small id="sexo-error">{errors.sexo}</small> : null}
      </label>
      <label className="field" htmlFor="descripcion">
        <span>Descripción</span>
        <textarea id="descripcion" name="descripcion" value={values.descripcion}
          onChange={(event) => onChange('descripcion', event.target.value)} />
      </label>
      <label className="field field-checkbox" htmlFor="adoptada">
        <input id="adoptada" name="adoptada" type="checkbox" checked={values.adoptada}
          onChange={(event) => onChange('adoptada', event.target.checked)} />
        <span>La mascota ya fue adoptada</span>
      </label>
      <div className="mascota-form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar mascota'}
        </button>
        <Link className="button button-secondary" to={cancelTo}>Cancelar</Link>
      </div>
    </form>
  )
}

MascotaForm.propTypes = {
  values: PropTypes.object.isRequired, errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired,
  cancelTo: PropTypes.string.isRequired, isSubmitting: PropTypes.bool.isRequired,
  submitError: PropTypes.string.isRequired,
}

export default MascotaForm
