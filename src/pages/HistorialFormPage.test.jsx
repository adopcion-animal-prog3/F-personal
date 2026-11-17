import { screen } from '@testing-library/react'
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

describe('HistorialFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getById.mockResolvedValue(mascotaWorkflow)
    historialService.getByMascotaId.mockResolvedValue([registroWorkflow])
    historialService.create.mockResolvedValue({ id: 10 })
    historialService.update.mockResolvedValue({ id: 9 })
  })

  it('valida descripción y crea un registro asociado por la ruta', async () => {
    const user = userEvent.setup()
    historialService.getByMascotaId.mockResolvedValue([
      { ...registroWorkflow, id: 10, descripcion: 'Vacunación' },
    ])
    renderWorkflowRoutes('/historial/7/nuevo', { id: 1, rol: 'ADMIN' })
    await screen.findByRole('heading', { name: /nuevo registro clínico/i })

    await user.click(screen.getByRole('button', { name: /guardar registro/i }))
    expect(await screen.findByText(/la descripción es obligatoria/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/descripción/i), ' Vacunación ')
    await user.click(screen.getByRole('button', { name: /guardar registro/i }))

    expect(await screen.findByText('Vacunación')).toBeInTheDocument()
    expect(historialService.create).toHaveBeenCalledWith('7', {
      fecha_registro: null, descripcion: 'Vacunación', veterinario: null,
    })
  })

  it('precarga un registro y lo actualiza', async () => {
    const user = userEvent.setup()
    historialService.getByMascotaId
      .mockResolvedValueOnce([registroWorkflow])
      .mockResolvedValueOnce([{ ...registroWorkflow, descripcion: 'Control actualizado' }])
    renderWorkflowRoutes('/historial/7/9/editar', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByLabelText(/descripción/i)).toHaveValue('Control veterinario')
    expect(screen.getByLabelText(/veterinario/i)).toHaveValue('Dra. Sol')
    await user.clear(screen.getByLabelText(/descripción/i))
    await user.type(screen.getByLabelText(/descripción/i), 'Control actualizado')
    await user.click(screen.getByRole('button', { name: /guardar registro/i }))

    expect(historialService.update).toHaveBeenCalledWith('9', {
      fecha_registro: '2026-03-01',
      descripcion: 'Control actualizado',
      veterinario: 'Dra. Sol',
    })
    expect(await screen.findByText('Control actualizado')).toBeInTheDocument()
  })

  it('informa si la mascota de la ruta no existe', async () => {
    mascotasService.getById.mockResolvedValueOnce(null)
    renderWorkflowRoutes('/historial/404/nuevo', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByRole('alert')).toHaveTextContent(/no se encontró la mascota/i)
  })

  it('informa si el registro no pertenece a la mascota de la ruta', async () => {
    mascotasService.getById.mockResolvedValue(mascotaWorkflow)
    historialService.getByMascotaId.mockResolvedValue([])
    renderWorkflowRoutes('/historial/7/404/editar', { id: 1, rol: 'ADMIN' })
    expect(await screen.findByRole('alert')).toHaveTextContent(/no se encontró el registro clínico/i)
  })

  it('mantiene el formulario y muestra errores del servicio', async () => {
    const user = userEvent.setup()
    historialService.create.mockRejectedValue(new Error('API no disponible'))
    renderWorkflowRoutes('/historial/7/nuevo', { id: 1, rol: 'ADMIN' })
    await screen.findByRole('heading', { name: /nuevo registro clínico/i })
    await user.type(screen.getByLabelText(/descripción/i), 'Consulta')
    await user.click(screen.getByRole('button', { name: /guardar registro/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
    expect(screen.getByRole('heading', { name: /nuevo registro clínico/i })).toBeInTheDocument()
  })
})
