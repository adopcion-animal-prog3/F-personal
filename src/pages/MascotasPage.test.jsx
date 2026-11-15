import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MascotaDetailPage from './MascotaDetailPage'
import MascotasPage from './MascotasPage'

vi.mock('../services/mascotasService', () => ({
  mascotasService: { getAll: vi.fn(), getById: vi.fn() },
}))

import { mascotasService } from '../services/mascotasService'

const mascota = {
  id: 7,
  nombre: 'Mora',
  especie: 'Perro',
  raza: 'Mestiza',
  edad: 0,
  sexo: 'F',
  descripcion: 'Tranquila y amistosa',
  adoptada: false,
}

function renderRoutes(path = '/mascotas') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('pantallas de mascotas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([])
    mascotasService.getById.mockResolvedValue(null)
  })

  it('muestra las mascotas devueltas por el servicio', async () => {
    mascotasService.getAll.mockResolvedValue([mascota])
    renderRoutes()

    expect(await screen.findByRole('link', { name: /mora/i })).toHaveAttribute('href', '/mascotas/7')
    expect(screen.getByText('Tranquila y amistosa')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('informa cuando el listado está vacío', async () => {
    renderRoutes()
    expect(await screen.findByText(/todavía no hay mascotas/i)).toBeInTheDocument()
  })

  it('muestra el estado de carga mientras responde el servicio', () => {
    mascotasService.getAll.mockReturnValue(new Promise(() => {}))
    renderRoutes()
    expect(screen.getByRole('status')).toHaveTextContent('Cargando mascotas')
  })

  it('muestra un error de carga del servicio', async () => {
    mascotasService.getAll.mockRejectedValue(new Error('API no disponible'))
    renderRoutes()
    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
  })

  it('muestra el detalle de una mascota para el ID de la ruta', async () => {
    mascotasService.getById.mockResolvedValue(mascota)
    renderRoutes('/mascotas/7')

    expect(await screen.findByRole('heading', { name: 'Mora' })).toBeInTheDocument()
    expect(mascotasService.getById).toHaveBeenCalledWith('7')
    expect(screen.getByText('Mestiza')).toBeInTheDocument()
  })

  it('informa cuando no existe la mascota solicitada', async () => {
    renderRoutes('/mascotas/999')
    expect(await screen.findByText(/no se encontró una mascota/i)).toBeInTheDocument()
  })

  it('permite navegar del listado al detalle y volver', async () => {
    mascotasService.getAll.mockResolvedValue([mascota])
    mascotasService.getById.mockResolvedValue(mascota)
    renderRoutes()
    fireEvent.click(await screen.findByRole('link', { name: /mora/i }))

    await waitFor(() => expect(mascotasService.getById).toHaveBeenCalledWith('7'))
    fireEvent.click(await screen.findByRole('link', { name: /volver al listado/i }))
    expect(await screen.findByRole('link', { name: /mora/i })).toBeInTheDocument()
  })
})
