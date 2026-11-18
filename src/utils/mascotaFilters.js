export const ESPECIE_FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'perro', label: 'Perros' },
  { id: 'gato', label: 'Gatos' },
  { id: 'otras', label: 'Otras' },
]

const normalize = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .trim()

const matchesEspecie = (mascota, especie) => {
  const value = normalize(mascota.especie)
  if (especie === 'perro') return value.startsWith('perr')
  if (especie === 'gato') return value.startsWith('gat')
  if (especie === 'otras') return !value.startsWith('perr') && !value.startsWith('gat')
  return true
}

const matchesTexto = (mascota, texto) => {
  const query = normalize(texto)
  if (!query) return true
  return [mascota.nombre, mascota.especie, mascota.raza, mascota.descripcion]
    .some((field) => normalize(field).includes(query))
}

// Filtra por texto libre, especie y disponibilidad; las disponibles aparecen primero.
export const filterMascotas = (mascotas, { texto = '', especie = 'todas', soloDisponibles = false } = {}) =>
  mascotas
    .filter((mascota) => matchesEspecie(mascota, especie))
    .filter((mascota) => matchesTexto(mascota, texto))
    .filter((mascota) => !soloDisponibles || !mascota.adoptada)
    .sort((a, b) => Number(a.adoptada) - Number(b.adoptada))

export const SEXO_LABELS = { M: 'Macho', F: 'Hembra', OTRO: 'Otro' }

export const formatEdad = (edad) => {
  if (edad === null || edad === undefined || edad === '') return 'No informada'
  const value = Number(edad)
  if (value === 0) return 'Menos de 1 año'
  return `${value} ${value === 1 ? 'año' : 'años'}`
}
