import { mensajesService } from '../services/mensajesService'
import useAsyncResource from './useAsyncResource'

function useConversaciones() {
  return useAsyncResource(mensajesService.getConversaciones, 'conversaciones')
}

export default useConversaciones
