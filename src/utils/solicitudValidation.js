export const SOLICITUD_ESTADOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA']

export const buildSolicitudInitialValues = (mascotaId = '') => ({
  mascotaId: mascotaId == null ? '' : String(mascotaId),
  mensaje: '',
})

export const validateSolicitud = (values, mascotas) => {
  const errors = {}
  const mascota = mascotas.find((item) => String(item.id) === values.mascotaId)

  if (!values.mascotaId) errors.mascotaId = 'Seleccioná una mascota.'
  else if (!mascota || mascota.adoptada) {
    errors.mascotaId = 'La mascota seleccionada no está disponible para adopción.'
  }

  return errors
}

export const buildSolicitudPayload = (values, mascotas) => {
  const mascota = mascotas.find((item) => String(item.id) === values.mascotaId)
  if (!mascota || mascota.adoptada) {
    throw new Error('La mascota seleccionada no está disponible para adopción.')
  }
  const mascotaId = Number(mascota.id)
  if (!Number.isSafeInteger(mascotaId) || mascotaId <= 0) {
    throw new Error('El identificador de la mascota no es válido.')
  }

  return { mascota_id: mascotaId, mensaje: values.mensaje.trim() }
}
