import { useCallback, useEffect, useState } from 'react'
import { mascotasService } from '../services/mascotasService'
import { solicitudesService } from '../services/solicitudesService'
import {
  buildSolicitudInitialValues,
  buildSolicitudPayload,
  validateSolicitud,
} from '../utils/solicitudValidation'

function useSolicitudForm(mascotaId) {
  const [mascotas, setMascotas] = useState([])
  const [values, setValues] = useState(() => buildSolicitudInitialValues(mascotaId))
  const [errors, setErrors] = useState({})
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    mascotasService.getAll()
      .then((result) => {
        if (active) {
          setMascotas(result)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || 'No se pudieron cargar las mascotas.')
          setIsLoading(false)
        }
      })
    return () => { active = false }
  }, [])

  const updateField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }, [])

  const submit = useCallback(async (event) => {
    event.preventDefault()
    const nextErrors = validateSolicitud(values, mascotas)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return false

    setIsSubmitting(true)
    setSubmitError('')
    try {
      await solicitudesService.create(buildSolicitudPayload(values, mascotas))
      return true
    } catch (error) {
      setSubmitError(error.message || 'No se pudo enviar la solicitud.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [mascotas, values])

  return {
    mascotas, values, errors, loadError, submitError, isLoading, isSubmitting, updateField, submit,
  }
}

export default useSolicitudForm
