import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthPage from './AuthPage'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  error: '',
  login: vi.fn(),
  register: vi.fn(),
  clearError: vi.fn(),
}))

vi.mock('../hooks/useAuth', () => ({ default: () => auth }))

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.isAuthenticated = false
    auth.isLoading = false
    auth.error = ''
    auth.register.mockResolvedValue(true)
  })

  it('returns to login after registration because the API does not issue a token', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route path="/registro" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/^nombre$/i), 'Ana')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(auth.register).toHaveBeenCalledWith({
      nombre: 'Ana', email: 'ana@test.com', password: 'password123',
    })
    expect(await screen.findByText(/registro completado\. iniciá sesión/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })
})
