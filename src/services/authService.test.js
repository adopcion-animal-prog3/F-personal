import { afterEach, describe, expect, it, vi } from 'vitest'
import { authService } from './authService'
import { clearAuthToken } from './api'

const mockResponse = (body, ok = true) => ({
  ok,
  json: async () => body,
  text: async () => JSON.stringify(body),
})

describe('authService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    clearAuthToken()
  })

  it('login returns token and user from the API response', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const postSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse({
      success: true,
      status: 'success',
      data: {
        token: 'abc123',
        user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' },
      },
    }))

    const result = await authService.login({ email: 'ana@test.com', password: 'secret123' })

    expect(result.token).toBe('abc123')
    expect(result.user.email).toBe('ana@test.com')
    expect(postSpy).toHaveBeenCalledWith(
      'https://api.example.test/api/auth/login',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('register returns a controlled error when the API is not available', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Failed to fetch'))

    await expect(authService.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' })).rejects.toThrow()
  })

  it('accepts the registration response without a token and sends only the backend fields', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse({
      success: true,
      status: 'success',
      data: { id: 2, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' },
    }))

    await expect(authService.register({
      nombre: 'Ana', email: 'ana@test.com', password: 'secret123',
    })).resolves.toEqual({
      token: null,
      user: { id: 2, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' },
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' }),
      }),
    )
  })

  it('sends the session token as a Bearer authorization header', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse({
      success: true,
      status: 'success',
      data: { user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' } },
    }))

    await expect(authService.getCurrentUser('session-token')).resolves.toEqual({
      id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/api/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer session-token' }),
      }),
    )
  })

  it('does not send authentication requests without VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(authService.login({ email: 'ana@test.com', password: 'secret123' }))
      .rejects.toThrow(/VITE_API_URL/)
    await expect(authService.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' }))
      .rejects.toThrow(/VITE_API_URL/)
    await expect(authService.getCurrentUser('session-token')).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
