import { render, screen } from '@testing-library/react'
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
})
