import { useCallback, useEffect, useState } from 'react'

function useAsyncResource(loadResource, resourceKey) {
  const [attempt, setAttempt] = useState(0)
  const [resource, setResource] = useState({
    data: null,
    error: '',
    status: 'loading',
  })

  useEffect(() => {
    let active = true
    setResource({ data: null, error: '', status: 'loading' })

    loadResource()
      .then((data) => {
        if (active) setResource({ data, error: '', status: 'success' })
      })
      .catch((error) => {
        if (active) {
          setResource({
            data: null,
            error: error.message || 'Ocurrió un error inesperado.',
            status: 'error',
          })
        }
      })

    return () => {
      active = false
    }
  }, [attempt, loadResource, resourceKey])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])
  return { ...resource, retry }
}

export default useAsyncResource
