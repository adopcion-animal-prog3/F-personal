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
  const email = values.email.trim()
  const passwordBytes = new TextEncoder().encode(values.password).length

  if (mode === 'register') {
    const nombre = values.nombre.trim()
    if (!nombre) errors.nombre = 'El nombre es obligatorio.'
    else if (nombre.length > 150) errors.nombre = 'El nombre no puede superar 150 caracteres.'
  }

  if (!email) {
    errors.email = 'El email es obligatorio.'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Ingresá un email válido.'
  } else if (email.length > 255) {
    errors.email = 'El email no puede superar 255 caracteres.'
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (mode === 'register' && values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.'
  } else if (passwordBytes > 72) {
    errors.password = 'La contraseña no puede superar 72 bytes.'
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
