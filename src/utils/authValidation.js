const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const buildInitialValues = (mode) => ({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  ...(mode === 'login' ? { nombre: '', confirmPassword: '' } : {}),
})

export const validateField = (values, mode) => {
  const errors = {}

  if (mode === 'register' && !values.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.'
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Ingresá un email válido.'
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (values.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  }

  if (mode === 'register') {
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirmá la contraseña.'
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden.'
    }
  }

  return errors
}
