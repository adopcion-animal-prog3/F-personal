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
      edad: 'La edad debe ser un entero entre 0 y 2147483647.',
      sexo: 'El sexo debe ser M, F u OTRO.',
    })
  })

  it('valida los límites y el tipo entero definidos por la API', () => {
    expect(validateMascota({ nombre: 'Mora', especie: 'Perro', edad: '2.5', sexo: '' }).edad)
      .toMatch(/entero/i)
    expect(validateMascota({
      nombre: 'n'.repeat(151), especie: 'e'.repeat(101), raza: 'r'.repeat(121),
      edad: '2147483648', sexo: '',
    })).toEqual({
      nombre: 'El nombre no puede superar 150 caracteres.',
      especie: 'La especie no puede superar 100 caracteres.',
      raza: 'La raza no puede superar 120 caracteres.',
      edad: 'La edad debe ser un entero entre 0 y 2147483647.',
    })
  })

  it('normaliza la edad y omite valores opcionales vacíos con null', () => {
    const values = buildMascotaInitialValues({ nombre: 'Mora', edad: 0 })
    expect(values.edad).toBe('0')
    expect(buildMascotaPayload({ ...values, especie: 'Perro', raza: '', sexo: '', descripcion: '' }))
      .toEqual({
        nombre: 'Mora', especie: 'Perro', raza: null, edad: 0, sexo: null,
        descripcion: null, adoptada: false,
      })
  })

  it('conserva el estado adoptada al editar y lo incluye en el payload', () => {
    const values = buildMascotaInitialValues({ adoptada: true })
    expect(values.adoptada).toBe(true)
    expect(buildMascotaPayload({ ...values, nombre: 'Mora', especie: 'Perro' }).adoptada).toBe(true)
  })
})
