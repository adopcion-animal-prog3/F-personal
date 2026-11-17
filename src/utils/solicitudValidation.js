export const SOLICITUD_ESTADOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA']

export const buildSolicitudInitialValues = (mascotaId = '') => ({
  mascotaId: mascotaId == null ? '' : String(mascotaId),
  mensaje: '',
})

export const validateSolicitud = (values, mascotas) => {
  const errors = {}
  const mascotaExists = mascotas.some((mascota) => String(mascota.id) === values.mascotaId)

  if (!values.mascotaId) errors.mascotaId = 'Seleccioná una mascota.'
  else if (!mascotaExists) errors.mascotaId = 'La mascota seleccionada no está disponible.'

  return errors
}

export const buildSolicitudPayload = (values, mascotas) => {
  const mascota = mascotas.find((item) => String(item.id) === values.mascotaId)
  if (!mascota) throw new Error('La mascota seleccionada no está disponible.')

  return { mascota_id: mascota.id, mensaje: values.mensaje.trim() }
}
