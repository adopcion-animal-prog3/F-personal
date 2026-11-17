import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  mascotaWorkflow, registroWorkflow, renderWorkflowRoutes,
} from '../test/workflowTestUtils'

vi.mock('../services/mascotasService', () => ({
  mascotasService: { getAll: vi.fn(), getById: vi.fn() },
}))
vi.mock('../services/historialService', () => ({
  historialService: { getByMascotaId: vi.fn(), create: vi.fn(), update: vi.fn(), deleteById: vi.fn() },
}))

import { mascotasService } from '../services/mascotasService'
import { historialService } from '../services/historialService'

describe('Historial clínico', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([mascotaWorkflow])
    mascotasService.getById.mockResolvedValue(mascotaWorkflow)
    historialService.getByMascotaId.mockResolvedValue([registroWorkflow])
    historialService.deleteById.mockResolvedValue(null)
  })

  it('permite elegir mascota y consulta los registros asociados', async () => {
    const user = userEvent.setup()
    renderWorkflowRoutes('/historial', { id: 1, rol: 'ADMIN' })
    await user.click(await screen.findByRole('link', { name: /mora/i }))

    expect(await screen.findByText('Control veterinario')).toBeInTheDocument()
    expect(screen.getByText('Dra. Sol')).toBeInTheDocument()
    expect(historialService.getByMascotaId).toHaveBeenCalledWith('7')
  })

  it('muestra un historial sin registros', async () => {
    historialService.getByMascotaId.mockResolvedValueOnce([])
    renderWorkflowRoutes('/historial/7', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByText(/no tiene registros clínicos/i)).toBeInTheDocument()
  })

  it('informa si la mascota no existe', async () => {
    mascotasService.getById.mockResolvedValue(null)
    renderWorkflowRoutes('/historial/404', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByText(/no se encontró la mascota/i)).toBeInTheDocument()
  })

  it('muestra errores al cargar el historial', async () => {
    historialService.getByMascotaId.mockRejectedValue(new Error('API no disponible'))
    renderWorkflowRoutes('/historial/7', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
  })

  it('confirma antes de eliminar y recarga luego de cancelar o confirmar', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    historialService.getByMascotaId
      .mockResolvedValueOnce([registroWorkflow])
      .mockResolvedValueOnce([])
    renderWorkflowRoutes('/historial/7', { id: 1, rol: 'ADMIN' })
    await screen.findByText('Control veterinario')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(historialService.deleteById).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText(/no tiene registros clínicos/i)).toBeInTheDocument()
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(historialService.deleteById).toHaveBeenCalledWith(9)
  })

  it('muestra la falla de eliminación sin perder el registro', async () => {
    historialService.deleteById.mockRejectedValue(new Error('No autorizado'))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderWorkflowRoutes('/historial/7', { id: 1, rol: 'ADMIN' })
    await screen.findByText('Control veterinario')
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No autorizado')
  })
})
