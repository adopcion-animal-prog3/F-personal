import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(async () => ({ token: 'token-123', user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' } })),
    register: vi.fn(async () => ({ token: 'token-456', user: { id: 2, nombre: 'Luis', email: 'luis@test.com', rol: 'ADMIN' } })),
    getCurrentUser: vi.fn(async () => ({ id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' })),
  },
}))

function AuthProbe() {
  const { isAuthenticated, user, login, logout } = useAuth()

  return (
    <div>
      <p>{isAuthenticated ? 'autenticado' : 'sin-sesion'}</p>
      <p>{user?.rol || 'sin-rol'}</p>
      <button type="button" onClick={() => login({ email: 'ana@test.com', password: 'secret123' })}>
        login
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  it('renders the session state and exposes login/logout actions', async () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(screen.getByText('sin-sesion')).toBeInTheDocument()
    expect(screen.getByText('sin-rol')).toBeInTheDocument()

    screen.getByRole('button', { name: /login/i }).click()

    expect(await screen.findByText('autenticado')).toBeInTheDocument()
  })
})
