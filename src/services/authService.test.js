import { afterEach, describe, expect, it, vi } from 'vitest'
import { authService } from './authService'
import { clearAuthToken } from './api'

const mockResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
})
const success = (data, status = 200) => mockResponse({ success: true, status: 'success', data }, status)
const verificacion = { email: 'ana@test.com', proposito: 'LOGIN', expira_en_minutos: 10 }
const user = { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' }

describe('authService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    clearAuthToken()
  })

  it('login no entrega sesión: devuelve los datos del código enviado por correo', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(success({ verificacion_requerida: true, verificacion }, 202))

    const result = await authService.login({ email: 'ana@test.com', password: 'secret123' })

    expect(result).toEqual({ verificacion })
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.test/api/auth/login',
      expect.objectContaining({ method: 'POST' }))
  })

  it('verify envía el código y guarda el token para las siguientes peticiones', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(success({ token: 'abc123', user }))
      .mockResolvedValueOnce(success({ user }))

    await expect(authService.verify({ email: 'ana@test.com', codigo: '123456' }))
      .resolves.toEqual({ token: 'abc123', user })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'ana@test.com', codigo: '123456' })

    await authService.getCurrentUser('abc123')
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe('Bearer abc123')
  })

  it('el registro devuelve la verificación pendiente y envía solo los campos del backend', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const pendiente = { ...verificacion, proposito: 'REGISTRO' }
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue(success({ ...user, verificacion_requerida: true, verificacion: pendiente }, 201))

    await expect(authService.register({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' }))
      .resolves.toEqual({ verificacion: pendiente })
    expect(fetchMock.mock.calls[0][1].body)
      .toBe(JSON.stringify({ nombre: 'Ana', email: 'ana@test.com', password: 'secret123' }))
  })

  it('traduce los errores de la API a mensajes claros', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const fail = (status) => fetchMock.mockResolvedValueOnce(mockResponse({ success: false, message: 'x' }, status))

    fail(401)
    await expect(authService.login({ email: 'a@b.co', password: 'x' })).rejects.toThrow(/correo o la contraseña/)
    fail(403)
    await expect(authService.login({ email: 'a@b.co', password: 'x' })).rejects.toThrow(/portal profesional/)
    fail(409)
    await expect(authService.register({ nombre: 'A', email: 'a@b.co', password: 'x' })).rejects.toThrow(/Ya existe/)
    fail(400)
    await expect(authService.verify({ email: 'a@b.co', codigo: '000000' })).rejects.toThrow(/código no es correcto/)
    fail(429)
    await expect(authService.resendCode('a@b.co')).rejects.toThrow(/Esperá un minuto/)
  })

  it('rechaza respuestas incompletas de la API', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.test')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(success({ token: 'abc' }))

    await expect(authService.login({ email: 'a@b.co', password: 'x' })).rejects.toThrow(/verificar/)
    await expect(authService.verify({ email: 'a@b.co', codigo: '123456' })).rejects.toThrow(/sesión válida/)
    await expect(authService.getCurrentUser('t')).rejects.toThrow(/usuario válido/)
  })

  it('no envía pedidos de autenticación sin VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(authService.login({ email: 'ana@test.com', password: 'secret123' })).rejects.toThrow(/VITE_API_URL/)
    await expect(authService.verify({ email: 'ana@test.com', codigo: '123456' })).rejects.toThrow(/VITE_API_URL/)
    await expect(authService.resendCode('ana@test.com')).rejects.toThrow(/VITE_API_URL/)
    await expect(authService.getCurrentUser('session-token')).rejects.toThrow(/VITE_API_URL/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
