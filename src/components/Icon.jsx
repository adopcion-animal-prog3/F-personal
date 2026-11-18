import PropTypes from 'prop-types'

// Íconos de trazo simple (24x24) usados en la navegación y los botones.
const PATHS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  paw: 'M8.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-7 1c-3 0-6 3.5-6 6 0 1.5 1.2 2 2.5 2 1.4 0 2.3-.8 3.5-.8s2.1.8 3.5.8c1.3 0 2.5-.5 2.5-2 0-2.5-3-6-6-6z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  chat: 'M4 5h16v11H8l-4 4z',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm9 3-4.3-4.3',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h10',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  send: 'M4 12l16-8-6 16-3-7z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  check: 'M5 12l5 5 9-10',
  building: 'M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01',
}

function Icon({ name, size = 20, filled = false }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  )
}

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(PATHS)).isRequired,
  size: PropTypes.number,
  filled: PropTypes.bool,
}

export default Icon
