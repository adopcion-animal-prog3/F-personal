export const buildMascotaInitialValues = (mascota = {}) => ({
  nombre: mascota.nombre ?? '',
  especie: mascota.especie ?? '',
  raza: mascota.raza ?? '',
  edad: mascota.edad == null ? '' : String(mascota.edad),
  sexo: mascota.sexo ?? '',
  descripcion: mascota.descripcion ?? '',
})

export const validateMascota = (values) => {
  const errors = {}
  const edad = values.edad.trim()

  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!values.especie.trim()) errors.especie = 'La especie es obligatoria.'
  if (edad && (!Number.isFinite(Number(edad)) || Number(edad) < 0)) {
    errors.edad = 'La edad debe ser nula o mayor o igual a cero.'
  }
  if (values.sexo && !['M', 'F', 'OTRO'].includes(values.sexo)) {
    errors.sexo = 'El sexo debe ser M, F u OTRO.'
  }

  return errors
}

export const buildMascotaPayload = (values) => ({
  nombre: values.nombre.trim(),
  especie: values.especie.trim(),
  raza: values.raza.trim() || null,
  edad: values.edad.trim() ? Number(values.edad) : null,
  sexo: values.sexo || null,
  descripcion: values.descripcion.trim() || null,
})
