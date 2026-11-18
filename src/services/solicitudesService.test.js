import { afterEach, describe, expect, it, vi } from 'vitest'
import { solicitudesService } from './solicitudesService'

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
})
const success = (data) => ({ success: true, status: 'success', data })

describe('solicitudesService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('prepara GET, POST sin usuario_id y PUT de estado', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(success([])))
      .mockResolvedValueOnce(response(success({ id: 3 })))
      .mockResolvedValueOnce(response(success({ id: 3 })))
    const solicitud = { mascota_id: 7, mensaje: 'Quiero adoptar' }

    await solicitudesService.getAll()
    await solicitudesService.create(solicitud)
    await solicitudesService.updateStatus(3, 'APROBADA')

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.test/api/solicitudes',
      expect.objectContaining({ method: 'GET' }))
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.example.test/api/solicitudes',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(solicitud) }))
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).not.toHaveProperty('usuario_id')
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'https://api.example.test/api/solicitudes/3',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ estado: 'APROBADA' }) }))
  })

  it('rechaza respuestas de listado inválidas y API sin configurar', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(response(success({ data: [] })))
    await expect(solicitudesService.getAll()).rejects.toThrow(/formato inválido/)

    vi.stubEnv('VITE_API_URL', '')
    fetchMock.mockClear()
    await expect(solicitudesService.getAll()).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
