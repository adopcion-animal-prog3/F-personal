import { useRef, useState } from 'react'
import { mascotasService } from '../services/mascotasService'

function useDeleteMascota(id) {
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteLock = useRef(false)

  const remove = async () => {
    if (deleteLock.current) return false
    deleteLock.current = true
    setIsDeleting(true)
    setError('')
    try {
      await mascotasService.deleteById(id)
      return true
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar la mascota.')
      return false
    } finally {
      deleteLock.current = false
      setIsDeleting(false)
    }
  }

  return { remove, error, isDeleting }
}

export default useDeleteMascota
