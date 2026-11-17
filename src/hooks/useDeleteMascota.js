import { useState } from 'react'
import { mascotasService } from '../services/mascotasService'

function useDeleteMascota(id) {
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const remove = async () => {
    setIsDeleting(true)
    setError('')
    try {
      await mascotasService.deleteById(id)
      return true
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar la mascota.')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { remove, error, isDeleting }
}

export default useDeleteMascota
