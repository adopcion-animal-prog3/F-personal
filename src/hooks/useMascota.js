import { useCallback } from 'react'
import { mascotasService } from '../services/mascotasService'
import useAsyncResource from './useAsyncResource'

function useMascota(id) {
  const loadMascota = useCallback(() => mascotasService.getById(id), [id])
  return useAsyncResource(loadMascota, id)
}

export default useMascota
