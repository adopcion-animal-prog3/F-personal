import { useCallback, useEffect, useState } from 'react'
import { historialService } from '../services/historialService'
import { mascotasService } from '../services/mascotasService'
import {
  buildHistorialInitialValues,
  buildHistorialPayload,
  validateHistorial,
} from '../utils/historialValidation'

function useHistorialForm(mascotaId, registroId) {
  const [values, setValues] = useState(() => buildHistorialInitialValues())
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    const loadRegistro = async () => {
      setIsLoading(true)
      setLoadError('')
      setValues(buildHistorialInitialValues())
      try {
        const mascota = await mascotasService.getById(mascotaId)
        if (!mascota) throw new Error('No se encontró la mascota.')
        if (registroId) {
          const registros = await historialService.getByMascotaId(mascotaId)
          const registro = registros.find((item) => String(item.id) === String(registroId))
          if (!registro) throw new Error('No se encontró el registro clínico de esta mascota.')
          if (active) setValues(buildHistorialInitialValues(registro))
        }
      } catch (error) {
        if (active) setLoadError(error.message || 'No se pudo cargar el registro clínico.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    loadRegistro()
    return () => { active = false }
  }, [mascotaId, registroId])

  const updateField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }, [])

  const submit = useCallback(async (event) => {
    event.preventDefault()
    const nextErrors = validateHistorial(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return false

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const payload = buildHistorialPayload(values)
      if (registroId) await historialService.update(registroId, payload)
      else await historialService.create(mascotaId, payload)
      return true
    } catch (error) {
      setSubmitError(error.message || 'No se pudo guardar el registro clínico.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [mascotaId, registroId, values])

  return {
    values, errors, updateField, submit, isLoading, loadError, submitError, isSubmitting,
  }
}

export default useHistorialForm
