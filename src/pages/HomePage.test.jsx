import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('offers a link to the real pet listing without fabricated metrics', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /explorar mascotas/i }))
      .toHaveAttribute('href', '/mascotas')
    expect(screen.queryByText(/mascotas activas|pendientes del módulo|24|08|12/i))
      .not.toBeInTheDocument()
  })
})
