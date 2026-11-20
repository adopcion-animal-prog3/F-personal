import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AuthContext from '../context/AuthContextValue'
import ConversacionPage from '../pages/ConversacionPage'
import MensajesPage from '../pages/MensajesPage'
import SolicitudFormPage from '../pages/SolicitudFormPage'
import SolicitudesPage from '../pages/SolicitudesPage'

export const mascotaWorkflow = {
  id: 7, nombre: 'Mora', especie: 'Perro', raza: null, edad: 2,
  sexo: 'F', descripcion: '', adoptada: false, creado_por: 3,
}

export const solicitudWorkflow = {
  id: 3, usuario_id: 41, mascota_id: 7, estado: 'PENDIENTE', mensaje: 'Quiero adoptar',
}

export function renderWorkflowRoutes(path, user = { id: 41, rol: 'ADOPTANTE' }) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/solicitudes/nueva" element={<SolicitudFormPage />} />
          <Route path="/mensajes" element={<MensajesPage />} />
          <Route path="/mensajes/:usuarioId" element={<ConversacionPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}
