import { describe, expect, it } from 'vitest'
import {
  buildSolicitudInitialValues,
  buildSolicitudPayload,
  validateSolicitud,
} from './solicitudValidation'

describe('validación de solicitudes', () => {
  const mascotas = [{ id: 7 }, { id: '8' }, { id: 9, adoptada: true }]

  it('requiere una mascota válida y conserva el tipo de su ID', () => {
    expect(validateSolicitud(buildSolicitudInitialValues(), mascotas).mascotaId)
      .toMatch(/seleccioná una mascota/i)
    const values = buildSolicitudInitialValues('8')
    expect(validateSolicitud(values, mascotas)).toEqual({})
    expect(buildSolicitudPayload({ ...values, mensaje: '  Hola  ' }, mascotas))
      .toEqual({ mascota_id: 8, mensaje: 'Hola' })
  })

  it('impide solicitar mascotas adoptadas', () => {
    const values = buildSolicitudInitialValues(9)
    expect(validateSolicitud(values, mascotas).mascotaId).toMatch(/no está disponible/i)
    expect(() => buildSolicitudPayload(values, mascotas)).toThrow(/no está disponible/i)
  })
})
