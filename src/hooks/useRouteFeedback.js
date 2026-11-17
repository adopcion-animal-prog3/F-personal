import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useRouteFeedback() {
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const consumed = useRef(false)

  useEffect(() => {
    const feedback = location.state?.feedback
    if (!feedback || consumed.current) return

    consumed.current = true
    setMessage(feedback)
    navigate({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    }, { replace: true, state: null })
  }, [location.key, location.hash, location.pathname, location.search, location.state, navigate])

  return message
}

export default useRouteFeedback
