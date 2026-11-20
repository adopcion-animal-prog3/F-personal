import { useCallback } from 'react'
import useAsyncResource from './useAsyncResource'
import { mascotasService } from '../services/mascotasService'
import { solicitudesService } from '../services/solicitudesService'

// Solicitudes del adoptante autenticado junto con las mascotas para mostrar sus nombres.
function useSolicitudes(user) {
  const userId = user?.id
  const loadSolicitudes = useCallback(async () => {
    if (userId == null) throw new Error('Iniciá sesión para consultar tus solicitudes.')

    const [solicitudes, mascotas] = await Promise.all([
      solicitudesService.getAll(),
      mascotasService.getAll(),
    ])
    const propias = solicitudes.filter((item) => String(item.usuario_id) === String(userId))
    return { solicitudes: propias, mascotas }
  }, [userId])

  return useAsyncResource(loadSolicitudes, `solicitudes-${userId}`)
}

export default useSolicitudes
