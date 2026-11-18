import PropTypes from 'prop-types'

function FeedbackMessage({ tone = 'error', children }) {
  const isError = tone === 'error'

  return (
    <p
      className={`form-alert form-alert-${tone}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {children}
    </p>
  )
}

FeedbackMessage.propTypes = {
  tone: PropTypes.oneOf(['error', 'success']),
  children: PropTypes.node.isRequired,
}

export default FeedbackMessage
