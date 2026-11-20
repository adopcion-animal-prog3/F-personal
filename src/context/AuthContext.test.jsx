import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import useAuth from '../hooks/useAuth'
import { AuthProvider } from './AuthContext'
import { API_UNAUTHORIZED_EVENT } from '../services/api'

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(async () => ({ verificacion: { email: 'ana@test.com', proposito: 'LOGIN' } })),
    verify: vi.fn(async () => ({ token: 'token-123', user: { id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' } })),
    resendCode: vi.fn(async () => ({})),
    getCurrentUser: vi.fn(async () => ({ id: 1, nombre: 'Ana', email: 'ana@test.com', rol: 'ADOPTANTE' })),
  },
}))

function AuthProbe() {
  const { isAuthenticated, user, login, verifyCode, logout, error, pendingVerification } = useAuth()

  return (
    <div>
      <p>{isAuthenticated ? 'autenticado' : 'sin-sesion'}</p>
      <p>{user?.rol || 'sin-rol'}</p>
      {error ? <p role="alert">{error}</p> : null}
      {pendingVerification ? <p>codigo-pendiente:{pendingVerification.email}</p> : null}
      <button type="button" onClick={() => verifyCode('123456')}>verificar</button>
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
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(screen.getByText('sin-sesion')).toBeInTheDocument()
    expect(screen.getByText('sin-rol')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /login/i }))
    expect(await screen.findByText('codigo-pendiente:ana@test.com')).toBeInTheDocument()
    expect(screen.getByText('sin-sesion')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /verificar/i }))
    expect(await screen.findByText('autenticado')).toBeInTheDocument()
    expect(screen.queryByText(/codigo-pendiente/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /logout/i }))
    expect(await screen.findByText('sin-sesion')).toBeInTheDocument()
  })

  it('clears an expired session after an unauthorized API response', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )
    await user.click(screen.getByRole('button', { name: /login/i }))
    await user.click(await screen.findByRole('button', { name: /verificar/i }))
    expect(await screen.findByText('autenticado')).toBeInTheDocument()

    act(() => window.dispatchEvent(new Event(API_UNAUTHORIZED_EVENT)))

    expect(await screen.findByText('sin-sesion')).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent(/sesión expiró/i)
    await waitFor(() => {
      expect(window.localStorage.getItem('f-personal-auth-session')).toBeNull()
    })
  })
})
