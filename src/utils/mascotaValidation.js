export const buildMascotaInitialValues = (mascota = {}) => ({
  nombre: mascota.nombre ?? '',
  especie: mascota.especie ?? '',
  raza: mascota.raza ?? '',
  edad: mascota.edad == null ? '' : String(mascota.edad),
  sexo: mascota.sexo ?? '',
  descripcion: mascota.descripcion ?? '',
  adoptada: mascota.adoptada ?? false,
})

export const validateMascota = (values) => {
  const errors = {}
  const edad = (values.edad ?? '').trim()
  const parsedEdad = Number(edad)
  const nombre = (values.nombre ?? '').trim()
  const especie = (values.especie ?? '').trim()
  const raza = (values.raza ?? '').trim()

  if (!nombre) errors.nombre = 'El nombre es obligatorio.'
  else if (nombre.length > 150) errors.nombre = 'El nombre no puede superar 150 caracteres.'
  if (!especie) errors.especie = 'La especie es obligatoria.'
  else if (especie.length > 100) errors.especie = 'La especie no puede superar 100 caracteres.'
  if (raza.length > 120) errors.raza = 'La raza no puede superar 120 caracteres.'
  if (edad && (!Number.isInteger(parsedEdad) || parsedEdad < 0 || parsedEdad > 2147483647)) {
    errors.edad = 'La edad debe ser un entero entre 0 y 2147483647.'
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
  adoptada: values.adoptada ?? false,
})
