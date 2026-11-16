import { mascotasService } from '../services/mascotasService'
import useAsyncResource from './useAsyncResource'

function useMascotas() {
  return useAsyncResource(mascotasService.getAll, 'mascotas')
}

export default useMascotas
