export const buildHistorialInitialValues = (registro = {}) => ({
  fecha_registro: registro.fecha_registro ? String(registro.fecha_registro).slice(0, 10) : '',
  descripcion: registro.descripcion ?? '',
  veterinario: registro.veterinario ?? '',
})

export const validateHistorial = (values) => (
  values.descripcion.trim() ? {} : { descripcion: 'La descripción es obligatoria.' }
)

export const buildHistorialPayload = (values) => ({
  fecha_registro: values.fecha_registro || null,
  descripcion: values.descripcion.trim(),
  veterinario: values.veterinario.trim() || null,
})
