import { useState } from 'react'
import { historialService } from '../services/historialService'

function useDeleteHistorial(id) {
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const remove = async () => {
    setError('')
    setIsDeleting(true)
    try {
      await historialService.deleteById(id)
      return true
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar el registro clínico.')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { remove, error, isDeleting }
}

export default useDeleteHistorial
