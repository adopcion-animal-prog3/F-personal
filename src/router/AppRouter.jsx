import PropTypes from 'prop-types'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import useAuth from '../hooks/useAuth'
import AuthPage from '../pages/AuthPage'
import ConversacionPage from '../pages/ConversacionPage'
import HomePage from '../pages/HomePage'
import MascotaDetailPage from '../pages/MascotaDetailPage'
import MascotasPage from '../pages/MascotasPage'
import MensajesPage from '../pages/MensajesPage'
import SolicitudFormPage from '../pages/SolicitudFormPage'
import NotFoundPage from '../pages/NotFoundPage'
import SolicitudesPage from '../pages/SolicitudesPage'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="route-loader" role="status" aria-live="polite">Verificando sesión...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/mascotas" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/mascotas" element={<MascotasPage />} />
          <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/solicitudes/nueva" element={<SolicitudFormPage />} />
          <Route path="/mensajes" element={<MensajesPage />} />
          <Route path="/mensajes/:usuarioId" element={<ConversacionPage />} />
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
