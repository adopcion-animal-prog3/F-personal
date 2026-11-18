import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mascotaWorkflow, renderWorkflowRoutes, solicitudWorkflow } from '../test/workflowTestUtils'

vi.mock('../services/solicitudesService', () => ({
  solicitudesService: { getAll: vi.fn(), create: vi.fn() },
}))
vi.mock('../services/mascotasService', () => ({
  mascotasService: { getAll: vi.fn(), getById: vi.fn() },
}))

import { solicitudesService } from '../services/solicitudesService'
import { mascotasService } from '../services/mascotasService'

describe('SolicitudFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([
      mascotaWorkflow, { ...mascotaWorkflow, id: 8, nombre: 'Nina', adoptada: true },
    ])
    solicitudesService.getAll.mockResolvedValue([])
    solicitudesService.create.mockResolvedValue(solicitudWorkflow)
  })

  it('valida la mascota y crea sin enviar usuario_id', async () => {
    const user = userEvent.setup()
    renderWorkflowRoutes('/solicitudes/nueva')

    await user.click(await screen.findByRole('button', { name: /enviar solicitud/i }))
    expect(await screen.findByText('Seleccioná una mascota.')).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /nina/i })).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText(/mascota/i), '7')
    await user.type(screen.getByLabelText(/mensaje/i), '  Me gustaría adoptarla  ')
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }))

    expect(await screen.findByRole('heading', { name: 'Mis solicitudes' })).toBeInTheDocument()
    expect(await screen.findByText('La solicitud se envió correctamente.')).toBeInTheDocument()
    expect(solicitudesService.create).toHaveBeenCalledWith({
      mascota_id: 7, mensaje: 'Me gustaría adoptarla',
    })
    expect(solicitudesService.create.mock.calls[0][0]).not.toHaveProperty('usuario_id')
  })

  it('mantiene el formulario y muestra errores reales del servicio', async () => {
    const user = userEvent.setup()
    solicitudesService.create.mockRejectedValue(new Error('API no disponible'))
    renderWorkflowRoutes('/solicitudes/nueva')

    await screen.findByRole('combobox', { name: /mascota/i })
    await user.selectOptions(screen.getByLabelText(/mascota/i), '7')
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
    expect(screen.getByRole('heading', { name: /solicitar adopción/i })).toBeInTheDocument()
  })
})
