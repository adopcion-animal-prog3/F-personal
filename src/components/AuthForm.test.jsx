import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AuthForm from './AuthForm'

describe('AuthForm', () => {
  it('validates required fields and email format', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AuthForm mode="login" onSubmit={onSubmit} isSubmitting={false} submitError="" />)

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument()
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
  })

  it('submits valid credentials', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AuthForm mode="login" onSubmit={onSubmit} isSubmitting={false} submitError="" />)

    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@test.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'ana@test.com', password: 'secret123' })
  })

  it('uses confirmation only for client-side validation on registration', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AuthForm mode="register" onSubmit={onSubmit} isSubmitting={false} submitError="" />)

    await user.type(screen.getByLabelText(/^nombre$/i), ' Ana ')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@test.com')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'secret123')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'secret123',
    })
  })

  it('disables and ignores submissions while authentication is pending', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <AuthForm mode="login" onSubmit={onSubmit} isSubmitting submitError="" />,
    )

    expect(screen.getByRole('button', { name: /procesando/i })).toBeDisabled()
    fireEvent.submit(container.querySelector('form'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
