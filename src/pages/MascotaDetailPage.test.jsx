import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mascotaDePrueba, renderMascotasRoutes } from '../test/mascotasTestUtils'

vi.mock('../services/mascotasService', () => ({
  mascotasService: { getAll: vi.fn(), getById: vi.fn() },
}))

import { mascotasService } from '../services/mascotasService'

describe('MascotaDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([mascotaDePrueba])
    mascotasService.getById.mockResolvedValue(mascotaDePrueba)
  })

  it('muestra el detalle de la mascota del ID de la ruta', async () => {
    renderMascotasRoutes('/mascotas/7')

    expect(await screen.findByRole('heading', { name: 'Mora' })).toBeInTheDocument()
    expect(mascotasService.getById).toHaveBeenCalledWith('7')
    expect(screen.getByText('Mestiza')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('muestra la carga del detalle', () => {
    mascotasService.getById.mockReturnValue(new Promise(() => {}))
    renderMascotasRoutes('/mascotas/7')
    expect(screen.getByRole('status')).toHaveTextContent('Cargando detalle de mascota')
  })

  it('informa cuando no existe la mascota solicitada', async () => {
    mascotasService.getById.mockResolvedValue(null)
    renderMascotasRoutes('/mascotas/999')
    expect(await screen.findByText(/no se encontró una mascota con ese id/i)).toBeInTheDocument()
  })

  it('muestra el error del servicio al consultar el detalle', async () => {
    mascotasService.getById.mockRejectedValue(new Error('Error interno'))
    renderMascotasRoutes('/mascotas/7')
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar la mascota. Error interno')
  })

  it('permite navegar del listado al detalle y volver', async () => {
    renderMascotasRoutes()
    fireEvent.click(await screen.findByRole('link', { name: /mora/i }))

    expect(await screen.findByRole('heading', { name: 'Detalle de mascota' })).toBeInTheDocument()
    expect(mascotasService.getById).toHaveBeenCalledWith('7')

    fireEvent.click(screen.getByRole('link', { name: /volver al listado/i }))
    expect(await screen.findByRole('heading', { name: 'Mascotas' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /mora/i })).toBeInTheDocument()
  })
})
