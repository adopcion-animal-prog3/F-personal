import { apiClient, requireApiUrl } from './api'

export const solicitudesService = {
  async getAll() {
    requireApiUrl('solicitudes')
    const solicitudes = await apiClient.get('/api/solicitudes')
    if (!Array.isArray(solicitudes)) {
      throw new Error('La API devolvió un listado de solicitudes con formato inválido.')
    }
    return solicitudes
  },

  async create(solicitud) {
    requireApiUrl('solicitudes')
    return apiClient.post('/api/solicitudes', solicitud)
  },

  async updateStatus(id, estado) {
    requireApiUrl('solicitudes')
    return apiClient.put(`/api/solicitudes/${encodeURIComponent(id)}`, { estado })
  },
}
