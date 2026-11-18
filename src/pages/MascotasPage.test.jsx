import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mascotaDePrueba, renderMascotasRoutes } from '../test/mascotasTestUtils'

vi.mock('../services/mascotasService', () => ({
  mascotasService: { getAll: vi.fn(), getById: vi.fn() },
}))

import { mascotasService } from '../services/mascotasService'

describe('MascotasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([])
  })

  it('muestra las mascotas devueltas por el servicio', async () => {
    const adoptada = { ...mascotaDePrueba, id: 8, nombre: 'Tom', adoptada: true, raza: null, descripcion: '' }
    mascotasService.getAll.mockResolvedValue([mascotaDePrueba, adoptada])
    renderMascotasRoutes()

    expect(await screen.findByRole('link', { name: /mora/i })).toHaveAttribute('href', '/mascotas/7')
    expect(screen.getByRole('link', { name: /tom/i })).toHaveAttribute('href', '/mascotas/8')
    expect(screen.getByText('Tranquila y amistosa')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.getByText('Adoptada')).toBeInTheDocument()
    expect(screen.getByText('No informada')).toBeInTheDocument()
    expect(screen.getByText('Sin descripción')).toBeInTheDocument()
  })

  it('informa cuando el listado está vacío', async () => {
    renderMascotasRoutes()
    expect(await screen.findByText(/todavía no hay mascotas/i)).toBeInTheDocument()
  })

  it('no ofrece publicar mascotas en el portal de adopción', async () => {
    mascotasService.getAll.mockResolvedValueOnce([mascotaDePrueba])
    renderMascotasRoutes('/mascotas')
    expect(await screen.findByRole('link', { name: /mora/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /agregar mascota/i })).not.toBeInTheDocument()
  })

  it('muestra el estado de carga mientras responde el servicio', () => {
    mascotasService.getAll.mockReturnValue(new Promise(() => {}))
    renderMascotasRoutes()
    expect(screen.getByRole('status')).toHaveTextContent('Cargando mascotas')
  })

  it('muestra el error del servicio y permite reintentar', async () => {
    mascotasService.getAll.mockRejectedValueOnce(new Error('API no disponible'))
    renderMascotasRoutes()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No se pudieron cargar las mascotas. API no disponible')

    mascotasService.getAll.mockResolvedValueOnce([mascotaDePrueba])
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
    expect(await screen.findByRole('link', { name: /mora/i })).toBeInTheDocument()
    expect(mascotasService.getAll).toHaveBeenCalledTimes(2)
  })
})
