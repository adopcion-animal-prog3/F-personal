import PropTypes from 'prop-types'
import FeedbackMessage from './FeedbackMessage'
import { EmptyIllustration } from './Illustrations'

function MascotaResourceState({
  status,
  error,
  emptyMessage,
  loadingMessage = 'Cargando mascotas...',
  onRetry,
}) {
  if (status === 'loading') {
    return (
      <div className="resource-state" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        {loadingMessage}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="resource-state resource-state-error">
        <FeedbackMessage>{error}</FeedbackMessage>
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="resource-state resource-state-empty" role="status" aria-live="polite">
      <EmptyIllustration />
      <p>{emptyMessage}</p>
    </div>
  )
}

MascotaResourceState.propTypes = {
  status: PropTypes.oneOf(['loading', 'error', 'empty']).isRequired,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  onRetry: PropTypes.func,
}

export default MascotaResourceState
