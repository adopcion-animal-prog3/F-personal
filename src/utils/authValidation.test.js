import { describe, expect, it } from 'vitest'
import { validateField } from './authValidation'

describe('validación de autenticación', () => {
  it('aplica los mínimos del backend al registro y permite contraseñas legacy al login', () => {
    const registration = {
      nombre: 'Ana',
      email: ' ana@test.com ',
      password: 'short7',
      confirmPassword: 'short7',
    }

    expect(validateField(registration, 'register').password)
      .toBe('La contraseña debe tener al menos 8 caracteres.')
    expect(validateField({ ...registration, password: 'short7x', confirmPassword: 'short7x' }, 'login'))
      .toEqual({})
  })

  it('valida límites de usuario, email y longitud bcrypt en bytes', () => {
    expect(validateField({
      nombre: 'n'.repeat(151),
      email: `${'a'.repeat(250)}@test.com`,
      password: 'a'.repeat(73),
      confirmPassword: 'a'.repeat(73),
    }, 'register')).toEqual({
      nombre: 'El nombre no puede superar 150 caracteres.',
      email: 'El email no puede superar 255 caracteres.',
      password: 'La contraseña no puede superar 72 bytes.',
    })
  })
})
