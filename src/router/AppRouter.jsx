import PropTypes from 'prop-types'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import useAuth from '../hooks/useAuth'
import AuthPage from '../pages/AuthPage'
import HistorialPage from '../pages/HistorialPage'
import HomePage from '../pages/HomePage'
import HistorialFormPage from '../pages/HistorialFormPage'
import HistorialMascotaPage from '../pages/HistorialMascotaPage'
import MascotaDetailPage from '../pages/MascotaDetailPage'
import MascotaFormPage from '../pages/MascotaFormPage'
import MascotasPage from '../pages/MascotasPage'
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
          <Route
            path="/mascotas/nueva"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><MascotaFormPage /></ProtectedRoute>}
          />
          <Route path="/mascotas/:id" element={<MascotaDetailPage />} />
          <Route
            path="/mascotas/:id/editar"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><MascotaFormPage /></ProtectedRoute>}
          />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route
            path="/solicitudes/nueva"
            element={<SolicitudFormPage />}
          />
          <Route
            path="/historial"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><HistorialPage /></ProtectedRoute>}
          />
          <Route
            path="/historial/:mascotaId"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><HistorialMascotaPage /></ProtectedRoute>}
          />
          <Route
            path="/historial/:mascotaId/nuevo"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><HistorialFormPage /></ProtectedRoute>}
          />
          <Route
            path="/historial/:mascotaId/:registroId/editar"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><HistorialFormPage /></ProtectedRoute>}
          />
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
