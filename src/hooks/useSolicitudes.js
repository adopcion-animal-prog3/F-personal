import { useCallback, useState } from 'react'
import useAsyncResource from './useAsyncResource'
import { mascotasService } from '../services/mascotasService'
import { solicitudesService } from '../services/solicitudesService'

function useSolicitudes(user) {
  const role = user?.rol
  const userId = user?.id
  const loadSolicitudes = useCallback(async () => {
    if (!role) throw new Error('Iniciá sesión para consultar solicitudes.')
    if (!['ADMIN', 'ADOPTANTE'].includes(role)) throw new Error('El rol no puede consultar solicitudes.')
    if (role === 'ADOPTANTE' && userId == null) {
      throw new Error('No se pudo verificar el usuario de la sesión.')
    }

    const [solicitudes, mascotas] = await Promise.all([
      solicitudesService.getAll(),
      mascotasService.getAll(),
    ])
    const visible = role === 'ADMIN'
      ? solicitudes
      : solicitudes.filter((item) => String(item.usuario_id) === String(userId))
    return { solicitudes: visible, mascotas }
  }, [role, userId])
  const resource = useAsyncResource(loadSolicitudes, `solicitudes-${role}-${userId}`)
  const retry = resource.retry
  const [operationError, setOperationError] = useState('')

  const updateStatus = useCallback(async (id, estado) => {
    setOperationError('')
    try {
      await solicitudesService.updateStatus(id, estado)
      retry()
      return true
    } catch (error) {
      setOperationError(error.message || 'No se pudo actualizar la solicitud.')
      return false
    }
  }, [retry])

  return { ...resource, operationError, updateStatus, isAdmin: role === 'ADMIN' }
}

export default useSolicitudes
