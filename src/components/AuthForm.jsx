import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { buildInitialValues, validateField } from '../utils/authValidation'

function AuthForm({ mode = 'login', onSubmit, isSubmitting, submitError }) {
  const initialValues = useMemo(() => buildInitialValues(mode), [mode])
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateField(values, mode)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const sanitizedValues = {
      ...(mode === 'register' ? { nombre: values.nombre.trim() } : {}),
      email: values.email.trim(),
      password: values.password,
      ...(mode === 'register' ? { confirmPassword: values.confirmPassword } : {}),
    }

    onSubmit(sanitizedValues)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {submitError ? <p className="form-alert form-alert-error">{submitError}</p> : null}

      {mode === 'register' ? (
        <label className="field" htmlFor="nombre">
          <span>Nombre</span>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={values.nombre}
            onChange={handleChange}
            aria-invalid={Boolean(errors.nombre)}
            placeholder="Tu nombre"
          />
          {errors.nombre ? <small>{errors.nombre}</small> : null}
        </label>
      ) : null}

      <label className="field" htmlFor="email">
        <span>Correo electrónico</span>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          placeholder="correo@ejemplo.com"
        />
        {errors.email ? <small>{errors.email}</small> : null}
      </label>

      <label className="field" htmlFor="password">
        <span>Contraseña</span>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
          placeholder="••••••••"
        />
        {errors.password ? <small>{errors.password}</small> : null}
      </label>

      {mode === 'register' ? (
        <label className="field" htmlFor="confirmPassword">
          <span>Confirmar contraseña</span>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            aria-invalid={Boolean(errors.confirmPassword)}
            placeholder="Repetí la contraseña"
          />
          {errors.confirmPassword ? <small>{errors.confirmPassword}</small> : null}
        </label>
      ) : null}

      <button type="submit" className="button button-primary auth-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </button>
    </form>
  )
}

AuthForm.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.string,
}

export default AuthForm
