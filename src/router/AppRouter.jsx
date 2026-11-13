import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import AuthPage from '../pages/AuthPage'
import HistorialPage from '../pages/HistorialPage'
import HomePage from '../pages/HomePage'
import MascotasPage from '../pages/MascotasPage'
import NotFoundPage from '../pages/NotFoundPage'
import SolicitudesPage from '../pages/SolicitudesPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="route-loader">Verificando sesión...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
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
