import { screen } from '@testing-library/react'
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

describe('SolicitudesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    solicitudesService.getAll.mockResolvedValue([solicitudWorkflow])
    mascotasService.getAll.mockResolvedValue([mascotaWorkflow])
  })

  it('muestra el estado de cada solicitud propia con el nombre de la mascota', async () => {
    solicitudesService.getAll.mockResolvedValue([
      solicitudWorkflow,
      { ...solicitudWorkflow, id: 4, estado: 'APROBADA' },
      { ...solicitudWorkflow, id: 5, estado: 'RECHAZADA' },
    ])
    const { container } = renderWorkflowRoutes('/solicitudes')

    expect(await screen.findAllByText('Mora')).toHaveLength(3)
    expect([...container.querySelectorAll('.solicitud-status')].map((badge) => badge.textContent))
      .toEqual(['PENDIENTE', 'APROBADA', 'RECHAZADA'])
  })

  it('muestra solamente solicitudes propias y nunca controles de gestión', async () => {
    solicitudesService.getAll.mockResolvedValue([
      solicitudWorkflow, { ...solicitudWorkflow, id: 99, usuario_id: 999 },
    ])
    renderWorkflowRoutes('/solicitudes')

    expect(await screen.findByText('Solicitud #3')).toBeInTheDocument()
    expect(screen.queryByText('Solicitud #99')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /actualizar estado/i })).not.toBeInTheDocument()
  })

  it('ofrece escribirle al publicador de la mascota', async () => {
    renderWorkflowRoutes('/solicitudes')

    expect(await screen.findByRole('link', { name: /escribir al publicador/i }))
      .toHaveAttribute('href', '/mensajes/3?mascotaId=7')
  })

  it('muestra estado vacío', async () => {
    solicitudesService.getAll.mockResolvedValueOnce([])
    renderWorkflowRoutes('/solicitudes')
    expect(await screen.findByText(/no tenés solicitudes/i)).toBeInTheDocument()
  })

  it('muestra errores del servicio', async () => {
    solicitudesService.getAll.mockRejectedValueOnce(new Error('API no disponible'))
    renderWorkflowRoutes('/solicitudes')
    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
  })

  it('no consulta solicitudes si falta la sesión identificable', async () => {
    renderWorkflowRoutes('/solicitudes', null)

    expect(await screen.findByRole('alert')).toHaveTextContent(/iniciá sesión/i)
    expect(solicitudesService.getAll).not.toHaveBeenCalled()
    expect(mascotasService.getAll).not.toHaveBeenCalled()
  })
})
