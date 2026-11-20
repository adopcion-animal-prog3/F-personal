import { apiClient, requireApiUrl } from './api'

const conversacionPath = (usuarioId) => `/api/mensajes/conversaciones/${encodeURIComponent(usuarioId)}`

const requireArray = (value, message) => {
  if (!Array.isArray(value)) throw new Error(message)
  return value
}

export const mensajesService = {
  async getConversaciones() {
    requireApiUrl('mensajes')
    const conversaciones = await apiClient.get('/api/mensajes/conversaciones')
    return requireArray(conversaciones, 'La API devolvió las conversaciones con formato inválido.')
  },

  async getConversacion(usuarioId) {
    requireApiUrl('mensajes')
    const conversacion = await apiClient.get(conversacionPath(usuarioId))
    requireArray(conversacion?.mensajes, 'La API devolvió la conversación con formato inválido.')
    return conversacion
  },

  async marcarLeidos(usuarioId) {
    requireApiUrl('mensajes')
    return apiClient.put(`${conversacionPath(usuarioId)}/leidos`)
  },

  async enviar(mensaje) {
    requireApiUrl('mensajes')
    return apiClient.post('/api/mensajes', mensaje)
  },
}
