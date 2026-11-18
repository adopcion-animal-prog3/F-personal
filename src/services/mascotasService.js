import { ApiError, apiClient, requireApiUrl } from './api'

const validateMascota = (mascota) => {
  if (!mascota || typeof mascota !== 'object' || Array.isArray(mascota)) {
    throw new Error('La API devolvió un detalle de mascota con formato inválido.')
  }

  return mascota
}

export const mascotasService = {
  async getAll() {
    requireApiUrl('mascotas')
    const mascotas = await apiClient.get('/api/mascotas')

    if (!Array.isArray(mascotas)) {
      throw new Error('La API devolvió un listado de mascotas con formato inválido.')
    }

    return mascotas
  },

  async getById(id) {
    requireApiUrl('mascotas')

    try {
      const mascota = await apiClient.get(`/api/mascotas/${encodeURIComponent(id)}`)
      return validateMascota(mascota)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }

      throw error
    }
  },
}
