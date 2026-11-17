import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mascotaWorkflow, renderWorkflowRoutes, solicitudWorkflow } from '../test/workflowTestUtils'

vi.mock('../services/solicitudesService', () => ({
  solicitudesService: { getAll: vi.fn(), create: vi.fn(), updateStatus: vi.fn() },
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
    solicitudesService.updateStatus.mockResolvedValue(null)
    mascotasService.getAll.mockResolvedValue([mascotaWorkflow])
  })

  it('muestra la mascota asociada y los tres estados para ADMIN', async () => {
    solicitudesService.getAll.mockResolvedValue([
      solicitudWorkflow,
      { ...solicitudWorkflow, id: 4, estado: 'APROBADA' },
      { ...solicitudWorkflow, id: 5, estado: 'RECHAZADA' },
    ])
    const { container } = renderWorkflowRoutes('/solicitudes', { id: 1, rol: 'ADMIN' })

    expect(await screen.findAllByText('Mora')).toHaveLength(3)
    expect([...container.querySelectorAll('.solicitud-status')].map((badge) => badge.textContent))
      .toEqual(['PENDIENTE', 'APROBADA', 'RECHAZADA'])
    expect(screen.getAllByRole('button', { name: /actualizar estado/i })).toHaveLength(3)
  })

  it('muestra solamente solicitudes propias y no ofrece gestión a ADOPTANTE', async () => {
    solicitudesService.getAll.mockResolvedValue([
      solicitudWorkflow, { ...solicitudWorkflow, id: 99, usuario_id: 999 },
    ])
    renderWorkflowRoutes('/solicitudes', { id: 41, rol: 'ADOPTANTE' })

    expect(await screen.findByText('Solicitud #3')).toBeInTheDocument()
    expect(screen.queryByText('Solicitud #99')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /actualizar estado/i })).not.toBeInTheDocument()
  })

  it('permite a ADMIN actualizar estado y vuelve a leer los resultados', async () => {
    const user = userEvent.setup()
    solicitudesService.getAll
      .mockResolvedValueOnce([solicitudWorkflow])
      .mockResolvedValueOnce([{ ...solicitudWorkflow, estado: 'APROBADA' }])
    renderWorkflowRoutes('/solicitudes', { id: 1, rol: 'ADMIN' })

    await screen.findByText('PENDIENTE', { selector: '.solicitud-status' })
    await user.selectOptions(screen.getByLabelText('Estado'), 'APROBADA')
    await user.click(screen.getByRole('button', { name: /actualizar estado/i }))

    expect(solicitudesService.updateStatus).toHaveBeenCalledWith(3, 'APROBADA')
    expect(await screen.findByText('APROBADA', { selector: '.solicitud-status' })).toBeInTheDocument()
    expect(await screen.findByText('El estado de la solicitud se actualizó correctamente.')).toBeInTheDocument()
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

  it('muestra error si falla la actualización administrativa', async () => {
    solicitudesService.updateStatus.mockRejectedValueOnce(new Error('No autorizado'))
    renderWorkflowRoutes('/solicitudes', { id: 1, rol: 'ADMIN' })
    await screen.findByText('PENDIENTE', { selector: '.solicitud-status' })
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'RECHAZADA' } })
    fireEvent.click(screen.getByRole('button', { name: /actualizar estado/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No autorizado')
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'RECHAZADA' } })
    fireEvent.click(screen.getByRole('button', { name: /actualizar estado/i }))
    expect(await screen.findByText('El estado de la solicitud se actualizó correctamente.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
