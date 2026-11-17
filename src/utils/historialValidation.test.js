import { describe, expect, it } from 'vitest'
import {
  buildHistorialInitialValues,
  buildHistorialPayload,
  validateHistorial,
} from './historialValidation'

describe('validación de historial clínico', () => {
  it('requiere descripción y normaliza campos opcionales', () => {
    const initial = buildHistorialInitialValues({ fecha_registro: '2026-02-01T10:00:00Z' })
    expect(initial.fecha_registro).toBe('2026-02-01')
    expect(validateHistorial({ ...initial, descripcion: '  ' }).descripcion)
      .toMatch(/obligatoria/i)
    expect(validateHistorial({ ...initial, descripcion: ' Control ' })).toEqual({})
    expect(validateHistorial({
      ...initial, descripcion: 'Control', veterinario: 'v'.repeat(201),
    }).veterinario).toMatch(/200 caracteres/i)
    expect(buildHistorialPayload({ ...initial, descripcion: ' Control ', veterinario: '' }))
      .toEqual({ fecha_registro: '2026-02-01', descripcion: 'Control', veterinario: null })
  })
})
