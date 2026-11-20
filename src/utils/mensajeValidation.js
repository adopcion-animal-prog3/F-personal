export const MAX_CONTENIDO = 2000

export const validateMensaje = (contenido) => {
  const texto = String(contenido ?? '').trim()
  if (!texto) return 'Escribí un mensaje antes de enviarlo.'
  if (texto.length > MAX_CONTENIDO) return `El mensaje no puede superar los ${MAX_CONTENIDO} caracteres.`
  return ''
}

export const buildMensajePayload = ({ destinatarioId, mascotaId, contenido }) => {
  const destinatario = Number(destinatarioId)
  if (!Number.isSafeInteger(destinatario) || destinatario <= 0) {
    throw new Error('El destinatario del mensaje no es válido.')
  }
  const mascota = Number(mascotaId)
  return {
    destinatario_id: destinatario,
    mascota_id: Number.isSafeInteger(mascota) && mascota > 0 ? mascota : null,
    contenido: String(contenido).trim(),
  }
}

export const formatFechaMensaje = (fecha) => {
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}
