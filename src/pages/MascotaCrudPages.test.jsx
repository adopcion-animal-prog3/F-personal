import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mascotaDePrueba, renderMascotasRoutes } from '../test/mascotasTestUtils'

vi.mock('../services/mascotasService', () => ({
  mascotasService: {
    getAll: vi.fn(), getById: vi.fn(), create: vi.fn(), update: vi.fn(), deleteById: vi.fn(),
  },
}))

import { mascotasService } from '../services/mascotasService'

describe('CRUD visual de mascotas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mascotasService.getAll.mockResolvedValue([mascotaDePrueba])
    mascotasService.getById.mockResolvedValue(mascotaDePrueba)
    mascotasService.create.mockResolvedValue({ id: 8 })
    mascotasService.update.mockResolvedValue({ id: 7 })
    mascotasService.deleteById.mockResolvedValue(null)
  })

  it('valida y crea, y luego carga el listado actualizado', async () => {
    const user = userEvent.setup()
    mascotasService.getAll.mockResolvedValue([mascotaDePrueba, { ...mascotaDePrueba, id: 8, nombre: 'Luna' }])
    renderMascotasRoutes('/mascotas/nueva', 'ADMIN')

    await user.click(screen.getByRole('button', { name: /guardar mascota/i }))
    expect(await screen.findByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(mascotasService.create).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/nombre/i), ' Luna ')
    await user.type(screen.getByLabelText(/especie/i), 'Gato')
    await user.click(screen.getByRole('button', { name: /guardar mascota/i }))

    await screen.findByRole('link', { name: /luna/i })
    expect(mascotasService.create).toHaveBeenCalledWith({
      nombre: 'Luna', especie: 'Gato', raza: null, edad: null, sexo: null,
      descripcion: null, adoptada: false,
    })
    expect(mascotasService.getAll).toHaveBeenCalled()
    expect(await screen.findByText('La mascota fue creada correctamente.')).toBeInTheDocument()
  })

  it('precarga la mascota para editar y permite cancelar al detalle', async () => {
    const user = userEvent.setup()
    renderMascotasRoutes('/mascotas/7/editar', 'ADMIN')

    expect(await screen.findByLabelText(/nombre/i)).toHaveValue('Mora')
    expect(screen.getByLabelText(/edad/i)).toHaveValue(0)
    await user.click(screen.getByRole('link', { name: /cancelar/i }))
    expect(await screen.findByRole('heading', { name: /detalle de mascota/i })).toBeInTheDocument()
    expect(mascotasService.update).not.toHaveBeenCalled()
  })

  it('actualiza mediante el servicio y muestra el detalle recargado', async () => {
    const user = userEvent.setup()
    mascotasService.getById
      .mockResolvedValueOnce(mascotaDePrueba)
      .mockResolvedValueOnce({ ...mascotaDePrueba, nombre: 'Luna' })
    renderMascotasRoutes('/mascotas/7/editar', 'ADMIN')

    const name = await screen.findByLabelText(/nombre/i)
    await user.clear(name)
    await user.type(name, 'Luna')
    await user.click(screen.getByRole('button', { name: /guardar mascota/i }))

    expect(await screen.findByRole('heading', { name: 'Luna' })).toBeInTheDocument()
    expect(mascotasService.update).toHaveBeenCalledWith('7', expect.objectContaining({ nombre: 'Luna' }))
    expect(await screen.findByText('La mascota fue actualizada correctamente.')).toBeInTheDocument()
  })

  it('mantiene el formulario y muestra error si falla el guardado', async () => {
    const user = userEvent.setup()
    mascotasService.create.mockRejectedValue(new Error('API no disponible'))
    renderMascotasRoutes('/mascotas/nueva', 'ADMIN')
    await user.type(screen.getByLabelText(/nombre/i), 'Mora')
    await user.type(screen.getByLabelText(/especie/i), 'Perro')
    await user.click(screen.getByRole('button', { name: /guardar mascota/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('API no disponible')
    expect(screen.getByRole('heading', { name: /nueva mascota/i })).toBeInTheDocument()
    await user.type(screen.getByLabelText(/nombre/i), 'Mora')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('pide confirmación, no elimina al cancelar y recarga tras confirmar', async () => {
    const confirm = vi.spyOn(window, 'confirm')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
    mascotasService.getAll.mockResolvedValue([])
    renderMascotasRoutes('/mascotas/7', 'ADMIN')
    await screen.findByRole('heading', { name: 'Mora' })

    fireEvent.click(screen.getByRole('button', { name: /eliminar mascota/i }))
    expect(mascotasService.deleteById).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /eliminar mascota/i }))

    expect(await screen.findByText(/todavía no hay mascotas/i)).toBeInTheDocument()
    expect(await screen.findByText('La mascota fue eliminada correctamente.')).toBeInTheDocument()
    expect(confirm).toHaveBeenCalledTimes(2)
    expect(mascotasService.deleteById).toHaveBeenCalledWith(7)
    expect(mascotasService.getAll).toHaveBeenCalled()
  })

  it('informa el error de eliminación sin salir del detalle', async () => {
    mascotasService.deleteById.mockRejectedValue(new Error('No autorizado'))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderMascotasRoutes('/mascotas/7', 'ADMIN')
    await screen.findByRole('heading', { name: 'Mora' })
    fireEvent.click(screen.getByRole('button', { name: /eliminar mascota/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No autorizado')
  })

  it('muestra las acciones de gestión solamente a ADMIN', async () => {
    renderMascotasRoutes('/mascotas/7', 'ADOPTANTE')
    await screen.findByRole('heading', { name: 'Mora' })
    expect(screen.queryByRole('button', { name: /eliminar mascota/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /editar mascota/i })).not.toBeInTheDocument()
  })

  it('ignora envíos repetidos mientras espera la respuesta del servicio', async () => {
    const user = userEvent.setup()
    let finishCreate
    mascotasService.create.mockImplementation(() => new Promise((resolve) => {
      finishCreate = resolve
    }))
    const { container } = renderMascotasRoutes('/mascotas/nueva', 'ADMIN')
    await user.type(screen.getByLabelText(/nombre/i), 'Mora')
    await user.type(screen.getByLabelText(/especie/i), 'Perro')

    fireEvent.submit(container.querySelector('form'))
    fireEvent.submit(container.querySelector('form'))

    await waitFor(() => expect(mascotasService.create).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled()
    finishCreate({ id: 8 })
    expect(await screen.findByText('La mascota fue creada correctamente.')).toBeInTheDocument()
  })
})
