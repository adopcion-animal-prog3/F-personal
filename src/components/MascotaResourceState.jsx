import PropTypes from 'prop-types'

function MascotaResourceState({
  status,
  error,
  emptyMessage,
  loadingMessage = 'Cargando mascotas...',
  onRetry,
}) {
  if (status === 'loading') {
    return <div className="resource-state" role="status">{loadingMessage}</div>
  }

  if (status === 'error') {
    return (
      <div className="resource-state resource-state-error" role="alert">
        <p>{error}</p>
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    )
  }

  return <div className="resource-state" role="status">{emptyMessage}</div>
}

MascotaResourceState.propTypes = {
  status: PropTypes.oneOf(['loading', 'error', 'empty']).isRequired,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  onRetry: PropTypes.func,
}

export default MascotaResourceState
