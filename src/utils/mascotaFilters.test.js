import { describe, expect, it } from 'vitest'
import { filterMascotas, formatEdad } from './mascotaFilters'

const mascotas = [
  { id: 1, nombre: 'Luna', especie: 'Perro', raza: 'Labrador', descripcion: 'Juguetona', adoptada: true },
  { id: 2, nombre: 'Michi', especie: 'Gato', raza: null, descripcion: 'Tranquila', adoptada: false },
  { id: 3, nombre: 'Copito', especie: 'Conejo', raza: 'Mini Lop', descripcion: null, adoptada: false },
  { id: 4, nombre: 'Toby', especie: 'perra', raza: 'Mestiza', descripcion: 'Le encanta correr', adoptada: false },
]
const ids = (list) => list.map((item) => item.id)

describe('filterMascotas', () => {
  it('sin filtros muestra todas, primero las disponibles', () => {
    expect(ids(filterMascotas(mascotas))).toEqual([2, 3, 4, 1])
  })

  it('filtra por especie: perros, gatos y otras', () => {
    expect(ids(filterMascotas(mascotas, { especie: 'perro' }))).toEqual([4, 1])
    expect(ids(filterMascotas(mascotas, { especie: 'gato' }))).toEqual([2])
    expect(ids(filterMascotas(mascotas, { especie: 'otras' }))).toEqual([3])
  })

  it('busca sin importar mayúsculas ni acentos en nombre, raza y descripción', () => {
    expect(ids(filterMascotas(mascotas, { texto: 'LÚNA' }))).toEqual([1])
    expect(ids(filterMascotas(mascotas, { texto: 'mini' }))).toEqual([3])
    expect(ids(filterMascotas(mascotas, { texto: 'correr' }))).toEqual([4])
  })

  it('puede ocultar las mascotas ya adoptadas', () => {
    expect(ids(filterMascotas(mascotas, { soloDisponibles: true }))).toEqual([2, 3, 4])
  })
})

describe('formatEdad', () => {
  it('muestra la edad en palabras', () => {
    expect(formatEdad(null)).toBe('No informada')
    expect(formatEdad(0)).toBe('Menos de 1 año')
    expect(formatEdad(1)).toBe('1 año')
    expect(formatEdad(4)).toBe('4 años')
  })
})
