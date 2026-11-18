import { useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { buildInitialValues, validateField } from '../utils/authValidation'
import FeedbackMessage from './FeedbackMessage'

function AuthForm({ mode = 'login', onSubmit, onClearError, isSubmitting, submitError }) {
  const initialValues = useMemo(() => buildInitialValues(mode), [mode])
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const submitLock = useRef(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    if (onClearError) onClearError()
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting || submitLock.current) return
    const nextErrors = validateField(values, mode)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const sanitizedValues = {
      ...(mode === 'register' ? { nombre: values.nombre.trim() } : {}),
      email: values.email.trim(),
      password: values.password,
    }

    submitLock.current = true
    try {
      await onSubmit(sanitizedValues)
    } finally {
      submitLock.current = false
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {submitError ? <FeedbackMessage>{submitError}</FeedbackMessage> : null}

      {mode === 'register' ? (
        <label className="field" htmlFor="nombre">
          <span>Nombre</span>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={values.nombre}
            maxLength={150}
            onChange={handleChange}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? 'nombre-error' : undefined}
            placeholder="Tu nombre"
          />
          {errors.nombre ? <small id="nombre-error">{errors.nombre}</small> : null}
        </label>
      ) : null}

      <label className="field" htmlFor="email">
        <span>Correo electrónico</span>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          maxLength={255}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="correo@ejemplo.com"
        />
        {errors.email ? <small id="email-error">{errors.email}</small> : null}
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
          aria-describedby={errors.password ? 'password-error' : undefined}
          placeholder="••••••••"
        />
        {errors.password ? <small id="password-error">{errors.password}</small> : null}
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
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            placeholder="Repetí la contraseña"
          />
          {errors.confirmPassword ? <small id="confirmPassword-error">{errors.confirmPassword}</small> : null}
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
  onClearError: PropTypes.func,
  isSubmitting: PropTypes.bool,
  submitError: PropTypes.string,
}

export default AuthForm
