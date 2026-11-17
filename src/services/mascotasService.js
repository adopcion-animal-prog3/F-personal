import { ApiError, apiClient } from './api'

const requireApiUrl = () => {
  if (!import.meta.env.VITE_API_URL?.trim()) {
    throw new Error('La URL de la API no está configurada. Definí VITE_API_URL para gestionar mascotas.')
  }
}

const validateMascota = (mascota) => {
  if (!mascota || typeof mascota !== 'object' || Array.isArray(mascota)) {
    throw new Error('La API devolvió un detalle de mascota con formato inválido.')
  }

  return mascota
}

export const mascotasService = {
  async getAll() {
    requireApiUrl()
    const mascotas = await apiClient.get('/api/mascotas')

    if (!Array.isArray(mascotas)) {
      throw new Error('La API devolvió un listado de mascotas con formato inválido.')
    }

    return mascotas
  },

  async getById(id) {
    requireApiUrl()

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

  async create(mascota) {
    requireApiUrl()
    return apiClient.post('/api/mascotas', mascota)
  },

  async update(id, mascota) {
    requireApiUrl()
    return apiClient.put(`/api/mascotas/${encodeURIComponent(id)}`, mascota)
  },

  async deleteById(id) {
    requireApiUrl()
    return apiClient.delete(`/api/mascotas/${encodeURIComponent(id)}`)
  },
}
