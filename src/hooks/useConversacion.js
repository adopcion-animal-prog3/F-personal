import { useCallback, useEffect, useRef, useState } from 'react'
import { mensajesService } from '../services/mensajesService'
import { buildMensajePayload, validateMensaje } from '../utils/mensajeValidation'
import useAsyncResource from './useAsyncResource'

// Carga el hilo con otra cuenta, marca como leídos los recibidos y permite responder.
function useConversacion(usuarioId, mascotaId) {
  const loadConversacion = useCallback(async () => {
    const conversacion = await mensajesService.getConversacion(usuarioId)
    await mensajesService.marcarLeidos(usuarioId)
    return conversacion
  }, [usuarioId])
  const resource = useAsyncResource(loadConversacion, usuarioId)
  const [mensajes, setMensajes] = useState([])
  const [sendError, setSendError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const sendLock = useRef(false)

  useEffect(() => setMensajes(resource.data?.mensajes ?? []), [resource.data])

  const enviar = useCallback(async (contenido) => {
    const error = validateMensaje(contenido)
    setSendError(error)
    if (error || sendLock.current) return false

    sendLock.current = true
    setIsSending(true)
    try {
      const enviado = await mensajesService.enviar(
        buildMensajePayload({ destinatarioId: usuarioId, mascotaId, contenido }),
      )
      setMensajes((current) => [...current, enviado])
      return true
    } catch (sendFailure) {
      setSendError(sendFailure.message || 'No se pudo enviar el mensaje.')
      return false
    } finally {
      sendLock.current = false
      setIsSending(false)
    }
  }, [mascotaId, usuarioId])

  return {
    ...resource, usuario: resource.data?.usuario ?? null, mensajes, enviar, sendError, isSending,
  }
}

export default useConversacion
