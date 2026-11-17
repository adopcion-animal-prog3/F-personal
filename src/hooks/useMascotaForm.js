import { useCallback, useEffect, useState } from 'react'
import { mascotasService } from '../services/mascotasService'
import {
  buildMascotaInitialValues,
  buildMascotaPayload,
  validateMascota,
} from '../utils/mascotaValidation'

function useMascotaForm(id) {
  const [values, setValues] = useState(() => buildMascotaInitialValues())
  const [errors, setErrors] = useState({})
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      setValues(buildMascotaInitialValues())
      setLoadError('')
      setIsLoading(false)
      return undefined
    }

    let active = true
    setIsLoading(true)
    setLoadError('')
    setValues(buildMascotaInitialValues())
    mascotasService.getById(id)
      .then((mascota) => {
        if (!active) return
        if (!mascota) setLoadError('No se encontró una mascota con ese ID.')
        else setValues(buildMascotaInitialValues(mascota))
        setIsLoading(false)
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message || 'No se pudo cargar la mascota.')
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  const updateField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }, [])

  const submit = useCallback(async (event) => {
    event.preventDefault()
    const nextErrors = validateMascota(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return false

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const payload = buildMascotaPayload(values)
      if (id) await mascotasService.update(id, payload)
      else await mascotasService.create(payload)
      return true
    } catch (error) {
      setSubmitError(error.message || 'No se pudo guardar la mascota.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [id, values])

  return {
    values, errors, updateField, submit, loadError, submitError, isLoading, isSubmitting,
  }
}

export default useMascotaForm
