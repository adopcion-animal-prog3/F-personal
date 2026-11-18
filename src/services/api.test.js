import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  API_UNAUTHORIZED_EVENT, ApiError, apiClient, clearAuthToken, setAuthToken,
} from './api'

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => body,
})

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    clearAuthToken()
  })

  it('uses the relative Vite proxy URL and unwraps the backend success envelope', async () => {
    vi.stubEnv('VITE_API_URL', '/')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(JSON.stringify({
      success: true,
      status: 'success',
      data: [{ id: 1 }],
      count: 1,
    })))

    await expect(apiClient.get('/api/mascotas')).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/mascotas',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('formats validation details and preserves HTTP status for API errors', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(JSON.stringify({
      success: false,
      status: 'error',
      message: 'Invalid request data',
      error: { message: 'Invalid request data' },
      errors: [{ field: 'body.email', message: 'email is invalid' }],
    }), 400))

    await expect(apiClient.get('/api/mascotas')).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Invalid request data — body.email: email is invalid',
    })
  })

  it('clears expired bearer tokens and notifies the auth context on 401', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    setAuthToken('expired-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response(JSON.stringify({
        success: false, status: 'error', message: 'Expired', error: { message: 'Expired' },
      }), 401))
      .mockResolvedValueOnce(response(JSON.stringify({ success: true, data: [] })))
    const listener = vi.fn()
    window.addEventListener(API_UNAUTHORIZED_EVENT, listener, { once: true })

    await expect(apiClient.get('/api/solicitudes')).rejects.toMatchObject({ status: 401 })
    await apiClient.get('/api/solicitudes')

    expect(listener).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer expired-token')
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBeUndefined()
    window.removeEventListener(API_UNAUTHORIZED_EVENT, listener)
  })

  it.each([401, 403, 404, 500])('surfaces HTTP %i with its backend message', async (status) => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response(JSON.stringify({
      success: false,
      status: 'error',
      message: `Failure ${status}`,
      error: { message: `Failure ${status}` },
    }), status))

    await expect(apiClient.get('/api/mascotas')).rejects.toMatchObject({
      status,
      message: `Failure ${status}`,
    })
  })

  it('accepts 204 deletes and rejects malformed successful responses explicitly', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(response('', 204))
      .mockResolvedValueOnce(response('<html>bad gateway</html>'))

    await expect(apiClient.delete('/api/mascotas/1')).resolves.toBeNull()
    await expect(apiClient.get('/api/mascotas')).rejects.toThrow(/formato JSON inválido/i)
  })

  it('exposes ApiError as an Error with an HTTP status', () => {
    const error = new ApiError('No autorizado', 403)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.status).toBe(403)
  })
})
