import { afterEach, describe, expect, it, vi } from 'vitest'
import { mascotasService } from './mascotasService'

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
})

describe('mascotasService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('consulta el listado previsto en la API', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response([]))

    await expect(mascotasService.getAll()).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/mascotas',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('consulta el detalle con el ID codificado en la ruta', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ id: 'a/b' }))

    await mascotasService.getById('a/b')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/mascotas/a%2Fb',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('devuelve null ante un 404 y propaga otros errores', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ detail: 'No existe' }, 404))
    await expect(mascotasService.getById(404)).resolves.toBeNull()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({ detail: 'Error interno' }, 500))
    await expect(mascotasService.getById(1)).rejects.toThrow('Error interno')
  })

  it('no intenta peticiones si falta la URL de API', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(mascotasService.getAll()).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
