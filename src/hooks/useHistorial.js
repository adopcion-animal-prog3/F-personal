import { useCallback } from 'react'
import { mascotasService } from '../services/mascotasService'
import { historialService } from '../services/historialService'
import useAsyncResource from './useAsyncResource'

function useHistorial(mascotaId) {
  const loadHistorial = useCallback(async () => {
    const mascota = await mascotasService.getById(mascotaId)
    if (!mascota) return { mascota: null, registros: [] }

    const registros = await historialService.getByMascotaId(mascotaId)
    return { mascota, registros }
  }, [mascotaId])

  return useAsyncResource(loadHistorial, `historial-${mascotaId}`)
}

export default useHistorial
