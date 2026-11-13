import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders the main navigation and dashboard shell', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: /menú principal/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /panel principal/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /panel general de adopción/i })).toBeInTheDocument()
  })

  it('renders the not found fallback route when an invalid path is used', () => {
    render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument()
  })
})
