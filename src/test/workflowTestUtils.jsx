import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthContext from '../context/AuthContextValue'
import HistorialFormPage from '../pages/HistorialFormPage'
import HistorialMascotaPage from '../pages/HistorialMascotaPage'
import HistorialPage from '../pages/HistorialPage'
import SolicitudFormPage from '../pages/SolicitudFormPage'
import SolicitudesPage from '../pages/SolicitudesPage'

export const mascotaWorkflow = {
  id: 7, nombre: 'Mora', especie: 'Perro', raza: null, edad: 2,
  sexo: 'F', descripcion: '', adoptada: false,
}

export const solicitudWorkflow = {
  id: 3, usuario_id: 41, mascota_id: 7, estado: 'PENDIENTE', mensaje: 'Quiero adoptar',
}

export const registroWorkflow = {
  id: 9, mascota_id: 7, fecha_registro: '2026-03-01',
  descripcion: 'Control veterinario', veterinario: 'Dra. Sol',
}

export function renderWorkflowRoutes(path, user = { id: 41, rol: 'ADOPTANTE' }) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/solicitudes/nueva" element={<SolicitudFormPage />} />
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="/historial/:mascotaId" element={<HistorialMascotaPage />} />
          <Route path="/historial/:mascotaId/nuevo" element={<HistorialFormPage />} />
          <Route path="/historial/:mascotaId/:registroId/editar" element={<HistorialFormPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}
