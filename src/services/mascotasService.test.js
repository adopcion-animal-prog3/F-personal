import { afterEach, describe, expect, it, vi } from 'vitest'
import { mascotasService } from './mascotasService'

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
})
const success = (data) => ({ success: true, status: 'success', data })

describe('mascotasService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('consulta el listado previsto en la API', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(success([])))

    await expect(mascotasService.getAll()).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/mascotas',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('consulta el detalle con el ID codificado en la ruta', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(success({ id: 'a/b' })))

    await mascotasService.getById('a/b')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/mascotas/a%2Fb',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('no expone operaciones de escritura: publicar es exclusivo del portal profesional', () => {
    expect(mascotasService).not.toHaveProperty('create')
    expect(mascotasService).not.toHaveProperty('update')
    expect(mascotasService).not.toHaveProperty('deleteById')
  })

  it('devuelve null ante un 404 y propaga otros errores', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({
      success: false, status: 'error', message: 'No existe', error: { message: 'No existe' },
    }, 404))
    await expect(mascotasService.getById(404)).resolves.toBeNull()

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({
      success: false, status: 'error', message: 'Error interno',
      error: { message: 'Error interno' },
    }, 500))
    await expect(mascotasService.getById(1)).rejects.toThrow('Error interno')
  })

  it('no intenta peticiones si falta la URL de API', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(mascotasService.getAll()).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
