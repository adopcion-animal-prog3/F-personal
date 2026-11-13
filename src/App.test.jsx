import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the default application heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /aplicación base react \+ vite/i })).toBeInTheDocument()
  })
})
