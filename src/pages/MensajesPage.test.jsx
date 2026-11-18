import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWorkflowRoutes } from '../test/workflowTestUtils'

vi.mock('../services/mensajesService', () => ({
  mensajesService: {
    getConversaciones: vi.fn(), getConversacion: vi.fn(), marcarLeidos: vi.fn(), enviar: vi.fn(),
  },
}))

import { mensajesService } from '../services/mensajesService'

const publicador = { id: 3, nombre: 'Refugio Sur', rol: 'ADMIN' }
const recibido = {
  id: 1, remitente_id: 3, destinatario_id: 41, mascota_id: 7,
  contenido: '¡Hola! Mora sigue disponible.', leido: false, created_at: '2026-11-18T10:00:00Z',
}

describe('Mensajes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mensajesService.getConversaciones.mockResolvedValue([
      { usuario: publicador, ultimo_mensaje: recibido, no_leidos: 2 },
    ])
    mensajesService.getConversacion.mockResolvedValue({ usuario: publicador, mensajes: [recibido] })
    mensajesService.marcarLeidos.mockResolvedValue({ actualizados: 1 })
  })

  it('lista las conversaciones con su último mensaje y los no leídos', async () => {
    renderWorkflowRoutes('/mensajes')

    const link = await screen.findByRole('link', { name: /refugio sur/i })
    expect(link).toHaveAttribute('href', '/mensajes/3')
    expect(screen.getByText('Publicador')).toBeInTheDocument()
    expect(screen.getByLabelText('2 sin leer')).toBeInTheDocument()
  })

  it('muestra el estado vacío y los errores', async () => {
    mensajesService.getConversaciones.mockResolvedValueOnce([])
    const { unmount } = renderWorkflowRoutes('/mensajes')
    expect(await screen.findByText(/todavía no tenés conversaciones/i)).toBeInTheDocument()
    unmount()

    mensajesService.getConversaciones.mockRejectedValueOnce(new Error('Sin conexión'))
    renderWorkflowRoutes('/mensajes')
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión')
  })

  it('abre el hilo, marca como leídos y envía una respuesta con la mascota', async () => {
    const user = userEvent.setup()
    mensajesService.enviar.mockResolvedValue({
      ...recibido, id: 2, remitente_id: 41, destinatario_id: 3, contenido: 'Quiero conocerla',
    })
    renderWorkflowRoutes('/mensajes/3?mascotaId=7')

    expect(await screen.findByRole('heading', { name: 'Conversación con Refugio Sur' })).toBeInTheDocument()
    expect(screen.getByText('¡Hola! Mora sigue disponible.')).toBeInTheDocument()
    expect(mensajesService.marcarLeidos).toHaveBeenCalledWith('3')

    await user.type(screen.getByLabelText('Nuevo mensaje'), '  Quiero conocerla ')
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(mensajesService.enviar).toHaveBeenCalledWith({
      destinatario_id: 3, mascota_id: 7, contenido: 'Quiero conocerla',
    })
    expect(await screen.findByText('Quiero conocerla')).toBeInTheDocument()
    expect(screen.getByLabelText('Nuevo mensaje')).toHaveValue('')
  })

  it('no envía mensajes vacíos y muestra los errores del envío', async () => {
    const user = userEvent.setup()
    mensajesService.enviar.mockRejectedValueOnce(new Error('Usuario not found'))
    renderWorkflowRoutes('/mensajes/3')
    await screen.findByText('¡Hola! Mora sigue disponible.')

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/escribí un mensaje/i)
    expect(mensajesService.enviar).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('Nuevo mensaje'), 'Hola')
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario not found')
    expect(screen.getByLabelText('Nuevo mensaje')).toHaveValue('Hola')
  })
})
