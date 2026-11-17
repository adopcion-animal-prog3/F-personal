import { afterEach, describe, expect, it, vi } from 'vitest'
import { historialService } from './historialService'

const response = (body) => ({
  ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body),
})
const success = (data) => ({ success: true, status: 'success', data })

describe('historialService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('usa las rutas previstas de lectura, alta, edición y eliminación', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(success([])))
      .mockResolvedValueOnce(response(success({ id: 9 })))
      .mockResolvedValueOnce(response(success({ id: 9 })))
      .mockResolvedValueOnce(response(success({ message: 'deleted', data: { id: 9 } })))
    const registro = { fecha_registro: null, descripcion: 'Control', veterinario: null }

    await historialService.getByMascotaId('a/b')
    await historialService.create('a/b', registro)
    await historialService.update(9, registro)
    await historialService.deleteById(9)

    expect(fetchMock.mock.calls.map(([url, options]) => [url, options.method])).toEqual([
      ['https://api.example.test/api/mascotas/a%2Fb/historial', 'GET'],
      ['https://api.example.test/api/mascotas/a%2Fb/historial', 'POST'],
      ['https://api.example.test/api/historial/9', 'PUT'],
      ['https://api.example.test/api/historial/9', 'DELETE'],
    ])
    expect(fetchMock.mock.calls[1][1].body).toBe(JSON.stringify(registro))
    expect(fetchMock.mock.calls[2][1].body).toBe(JSON.stringify(registro))
  })

  it('rechaza un historial con formato incorrecto y una API no configurada', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(success(null)))
    await expect(historialService.getByMascotaId(7)).rejects.toThrow(/formato inválido/)

    vi.stubEnv('VITE_API_URL', '')
    fetchMock.mockClear()
    await expect(historialService.getByMascotaId(7)).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
