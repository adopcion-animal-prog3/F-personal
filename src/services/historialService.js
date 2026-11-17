import { apiClient, requireApiUrl } from './api'

export const historialService = {
  async getByMascotaId(mascotaId) {
    requireApiUrl('historial clínico')
    const registros = await apiClient.get(
      `/api/mascotas/${encodeURIComponent(mascotaId)}/historial`,
    )
    if (!Array.isArray(registros)) {
      throw new Error('La API devolvió un historial con formato inválido.')
    }
    return registros
  },

  async create(mascotaId, registro) {
    requireApiUrl('historial clínico')
    return apiClient.post(
      `/api/mascotas/${encodeURIComponent(mascotaId)}/historial`,
      registro,
    )
  },

  async update(id, registro) {
    requireApiUrl('historial clínico')
    return apiClient.put(`/api/historial/${encodeURIComponent(id)}`, registro)
  },

  async deleteById(id) {
    requireApiUrl('historial clínico')
    return apiClient.delete(`/api/historial/${encodeURIComponent(id)}`)
  },
}
