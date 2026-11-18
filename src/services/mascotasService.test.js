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

  it('prepara las operaciones de alta, edición y eliminación HTTP', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(success({ id: 2 })))
      .mockResolvedValueOnce(response(success({ id: 2 })))
      .mockResolvedValueOnce(response(null, 204))
    const payload = { nombre: 'Luna', especie: 'Gato', edad: null }

    await mascotasService.create(payload)
    await mascotasService.update('a/b', payload)
    await mascotasService.deleteById('a/b')

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'https://api.example.test/api/mascotas',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }))
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://api.example.test/api/mascotas/a%2Fb',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(payload) }))
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'https://api.example.test/api/mascotas/a%2Fb',
      expect.objectContaining({ method: 'DELETE' }))
  })

  it('no envía operaciones de escritura sin URL configurada', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(mascotasService.create({ nombre: 'Mora' })).rejects.toThrow(/VITE_API_URL/)
    await expect(mascotasService.update(1, { nombre: 'Mora' })).rejects.toThrow(/VITE_API_URL/)
    await expect(mascotasService.deleteById(1)).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
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
