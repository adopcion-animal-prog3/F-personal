import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FeedbackMessage from './FeedbackMessage'

describe('FeedbackMessage', () => {
  it('announces errors as alerts and success as polite status', () => {
    const { rerender } = render(<FeedbackMessage>Falló la operación.</FeedbackMessage>)
    expect(screen.getByRole('alert')).toHaveTextContent('Falló la operación.')

    rerender(<FeedbackMessage tone="success">Operación confirmada.</FeedbackMessage>)
    expect(screen.getByRole('status')).toHaveTextContent('Operación confirmada.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
