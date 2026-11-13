import { describe, expect, it, vi } from 'vitest'
import { authService } from './authService'

const mockResponse = (body, ok = true) => ({
  ok,
  json: async () => body,
  text: async () => JSON.stringify(body),
})

describe('authService', () => {
  it('login returns token and user from the API response', async () => {
    const postSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse({
      token: 'abc123',
      user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' },
    }))

    const result = await authService.login({ email: 'ana@test.com', password: 'secret123' })

    expect(result.token).toBe('abc123')
    expect(result.user.email).toBe('ana@test.com')
    expect(postSpy).toHaveBeenCalled()
  })

  it('register returns a controlled error when the API is not available', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Failed to fetch'))

    await expect(authService.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' })).rejects.toThrow()
  })
})
