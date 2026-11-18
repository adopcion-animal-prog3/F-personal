import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import AuthContext from '../context/AuthContextValue'

describe('HomePage', () => {
  it('offers a link to the real pet listing without fabricated metrics', () => {
    render(
      <AuthContext.Provider value={{ user: { nombre: 'Ana Pérez' } }}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    expect(screen.getByRole('link', { name: /explorar mascotas/i }))
      .toHaveAttribute('href', '/mascotas')
    expect(screen.queryByText(/mascotas activas|pendientes del módulo|24|08|12/i))
      .not.toBeInTheDocument()
    expect(screen.getByText('Bienvenido, Ana')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /cómo adoptar/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
