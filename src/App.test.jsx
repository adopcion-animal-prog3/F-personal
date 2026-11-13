import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' },
        }),
        text: async () => JSON.stringify({
          user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' },
        }),
      }),
    )
  })

  it('renders the dashboard shell for an authenticated user', async () => {
    window.localStorage.setItem(
      'f-personal-auth-session',
      JSON.stringify({ token: 'mock-token', user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' } }),
    )
    window.history.pushState({}, '', '/')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: /menú principal/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /panel principal/i })).toBeInTheDocument()
    })
  })

  it('renders the not found route when an invalid path is used', async () => {
    window.localStorage.setItem(
      'f-personal-auth-session',
      JSON.stringify({ token: 'mock-token', user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADMIN' } }),
    )
    window.history.pushState({}, '', '/ruta-inexistente')

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument()
    })
  })
})
