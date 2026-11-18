import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthPage from './AuthPage'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  error: '',
  pendingVerification: null,
  login: vi.fn(),
  register: vi.fn(),
  verifyCode: vi.fn(),
  resendCode: vi.fn(),
  cancelVerification: vi.fn(),
  clearError: vi.fn(),
}))

vi.mock('../hooks/useAuth', () => ({ default: () => auth }))

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/registro" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<h1>Inicio</h1>} />
    </Routes>
  </MemoryRouter>,
)

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.pendingVerification = null
    auth.error = ''
    auth.register.mockResolvedValue(true)
    auth.verifyCode.mockResolvedValue(true)
  })

  it('envía el registro con los campos del backend', async () => {
    const user = userEvent.setup()
    renderAt('/registro')

    await user.type(screen.getByLabelText(/^nombre$/i), 'Ana')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(auth.register).toHaveBeenCalledWith({ nombre: 'Ana', email: 'ana@test.com', password: 'password123' })
  })

  it('pide el código del correo y entra al confirmarlo', async () => {
    const user = userEvent.setup()
    auth.pendingVerification = { email: 'ana@test.com', proposito: 'LOGIN' }
    renderAt('/login')

    expect(screen.getByRole('heading', { name: /revisá tu correo/i })).toBeInTheDocument()
    expect(screen.getByText('ana@test.com')).toBeInTheDocument()
    const confirmar = screen.getByRole('button', { name: /confirmar código/i })
    expect(confirmar).toBeDisabled()

    await user.type(screen.getByLabelText(/código de verificación/i), '12a34-56')
    expect(screen.getByLabelText(/código de verificación/i)).toHaveValue('123456')
    await user.click(confirmar)

    expect(auth.verifyCode).toHaveBeenCalledWith('123456')
    expect(await screen.findByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
  })

  it('permite reenviar el código recién después de un minuto y volver atrás', async () => {
    const user = userEvent.setup()
    auth.pendingVerification = { email: 'ana@test.com', proposito: 'REGISTRO' }
    renderAt('/registro')

    expect(screen.getByRole('button', { name: /reenviar código en 60 s/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /usar otro correo/i }))
    expect(auth.cancelVerification).toHaveBeenCalled()
  })
})
