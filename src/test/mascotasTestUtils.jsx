import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MascotaDetailPage from '../pages/MascotaDetailPage'
import MascotasPage from '../pages/MascotasPage'

export const mascotaDePrueba = {
  id: 7,
  nombre: 'Mora',
  especie: 'Perro',
  raza: 'Mestiza',
  edad: 0,
  sexo: 'F',
  descripcion: 'Tranquila y amistosa',
  adoptada: false,
}

export function renderMascotasRoutes(path = '/mascotas') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}
