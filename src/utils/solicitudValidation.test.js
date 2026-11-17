import { describe, expect, it } from 'vitest'
import {
  buildSolicitudInitialValues,
  buildSolicitudPayload,
  validateSolicitud,
} from './solicitudValidation'

describe('validación de solicitudes', () => {
  const mascotas = [{ id: 7 }, { id: '8' }]

  it('requiere una mascota válida y conserva el tipo de su ID', () => {
    expect(validateSolicitud(buildSolicitudInitialValues(), mascotas).mascotaId)
      .toMatch(/seleccioná una mascota/i)
    const values = buildSolicitudInitialValues('8')
    expect(validateSolicitud(values, mascotas)).toEqual({})
    expect(buildSolicitudPayload({ ...values, mensaje: '  Hola  ' }, mascotas))
      .toEqual({ mascota_id: '8', mensaje: 'Hola' })
  })
})
