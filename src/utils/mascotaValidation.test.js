import { describe, expect, it } from 'vitest'
import {
  buildMascotaInitialValues,
  buildMascotaPayload,
  validateMascota,
} from './mascotaValidation'

describe('validación de mascotas', () => {
  it('acepta los datos obligatorios y edad cero o nula', () => {
    expect(validateMascota({ nombre: ' Mora ', especie: 'Perro', edad: '0', sexo: 'F' })).toEqual({})
    expect(validateMascota({ nombre: 'Mora', especie: 'Perro', edad: '', sexo: '' })).toEqual({})
  })

  it('rechaza nombre/especie vacíos, edad negativa y sexo ajeno al contrato', () => {
    expect(validateMascota({ nombre: ' ', especie: '', edad: '-1', sexo: 'X' })).toEqual({
      nombre: 'El nombre es obligatorio.',
      especie: 'La especie es obligatoria.',
      edad: 'La edad debe ser nula o mayor o igual a cero.',
      sexo: 'El sexo debe ser M, F u OTRO.',
    })
  })

  it('normaliza la edad y omite valores opcionales vacíos con null', () => {
    const values = buildMascotaInitialValues({ nombre: 'Mora', edad: 0 })
    expect(values.edad).toBe('0')
    expect(buildMascotaPayload({ ...values, especie: 'Perro', raza: '', sexo: '', descripcion: '' }))
      .toEqual({ nombre: 'Mora', especie: 'Perro', raza: null, edad: 0, sexo: null, descripcion: null })
  })
})
