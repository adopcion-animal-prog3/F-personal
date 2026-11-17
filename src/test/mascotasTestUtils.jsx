import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthContext from '../context/AuthContextValue'
import MascotaDetailPage from '../pages/MascotaDetailPage'
import MascotaFormPage from '../pages/MascotaFormPage'
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

export function renderMascotasRoutes(path = '/mascotas', role = 'ADOPTANTE') {
  return render(
    <AuthContext.Provider value={{ user: { rol: role } }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/mascotas/nueva" element={<MascotaFormPage />} />
          <Route path="/mascotas/:id/editar" element={<MascotaFormPage />} />
          <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}
