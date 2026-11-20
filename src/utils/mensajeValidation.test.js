import { describe, expect, it } from 'vitest'
import { buildMensajePayload, formatFechaMensaje, validateMensaje } from './mensajeValidation'

describe('mensajeValidation', () => {
  it('exige contenido no vacío y con longitud máxima', () => {
    expect(validateMensaje('   ')).toMatch(/escribí un mensaje/i)
    expect(validateMensaje('a'.repeat(2001))).toMatch(/2000 caracteres/)
    expect(validateMensaje(' Hola ')).toBe('')
  })

  it('arma el payload con ids numéricos y contenido recortado', () => {
    expect(buildMensajePayload({ destinatarioId: '3', mascotaId: '7', contenido: ' Hola ' }))
      .toEqual({ destinatario_id: 3, mascota_id: 7, contenido: 'Hola' })
    expect(buildMensajePayload({ destinatarioId: 3, mascotaId: null, contenido: 'Hola' }).mascota_id)
      .toBeNull()
  })

  it('rechaza un destinatario inválido', () => {
    expect(() => buildMensajePayload({ destinatarioId: 'x', contenido: 'Hola' })).toThrow(/destinatario/)
  })

  it('formatea fechas válidas y descarta las inválidas', () => {
    expect(formatFechaMensaje('2026-11-18T10:00:00Z')).not.toBe('')
    expect(formatFechaMensaje('no-es-fecha')).toBe('')
  })
})
