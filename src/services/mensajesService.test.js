import { afterEach, describe, expect, it, vi } from 'vitest'
import { mensajesService } from './mensajesService'

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(body),
})
const success = (data) => ({ success: true, status: 'success', data })

describe('mensajesService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('consulta conversaciones, hilo, leídos y envío con las rutas de la API', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const mensaje = { destinatario_id: 3, mascota_id: null, contenido: 'Hola' }
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(success([])))
      .mockResolvedValueOnce(response(success({ usuario: { id: 3 }, mensajes: [] })))
      .mockResolvedValueOnce(response(success({ actualizados: 0 })))
      .mockResolvedValueOnce(response(success({ id: 1 }), 201))

    await mensajesService.getConversaciones()
    await mensajesService.getConversacion('a/b')
    await mensajesService.marcarLeidos(3)
    await mensajesService.enviar(mensaje)

    const calls = fetchMock.mock.calls.map(([url, options]) => [url, options.method])
    expect(calls).toEqual([
      ['https://api.example.test/api/mensajes/conversaciones', 'GET'],
      ['https://api.example.test/api/mensajes/conversaciones/a%2Fb', 'GET'],
      ['https://api.example.test/api/mensajes/conversaciones/3/leidos', 'PUT'],
      ['https://api.example.test/api/mensajes', 'POST'],
    ])
    expect(JSON.parse(fetchMock.mock.calls[3][1].body)).toEqual(mensaje)
  })

  it('rechaza respuestas con formato inválido', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(success({ mensajes: 'x' })))

    await expect(mensajesService.getConversaciones()).rejects.toThrow(/formato inválido/)
    await expect(mensajesService.getConversacion(3)).rejects.toThrow(/formato inválido/)
  })

  it('no hace peticiones sin URL de API configurada', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(mensajesService.getConversaciones()).rejects.toThrow(/VITE_API_URL/)
    await expect(mensajesService.enviar({})).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
