import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import AuthPage from '../pages/AuthPage'
import HistorialPage from '../pages/HistorialPage'
import HomePage from '../pages/HomePage'
import MascotasPage from '../pages/MascotasPage'
import NotFoundPage from '../pages/NotFoundPage'
import SolicitudesPage from '../pages/SolicitudesPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/historial" element={<HistorialPage />} />
        </Route>

        <Route path="/login" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
