import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthContext from '../context/AuthContextValue'
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
  creado_por: 3,
}

export function renderMascotasRoutes(path = '/mascotas', user = { id: 41, rol: 'ADOPTANTE' }) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
          <Route path="/solicitudes/nueva" element={<h1>Formulario de solicitud</h1>} />
          <Route path="/mensajes/:usuarioId" element={<h1>Conversación abierta</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}
