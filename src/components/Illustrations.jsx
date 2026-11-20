import PropTypes from 'prop-types'

// Dibujos vectoriales de la marca Huellitas (perro y gato) para portada y estados vacíos.
export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#15803d" />
      <g fill="#ffffff">
        <ellipse cx="16" cy="17" rx="3.6" ry="4.6" />
        <ellipse cx="32" cy="17" rx="3.6" ry="4.6" />
        <ellipse cx="10.5" cy="25" rx="3.2" ry="4" />
        <ellipse cx="37.5" cy="25" rx="3.2" ry="4" />
        <path d="M24 24c-5.5 0-10 6-10 10 0 3 2.4 4 4.6 4 2.4 0 3.6-1.4 5.4-1.4s3 1.4 5.4 1.4c2.2 0 4.6-1 4.6-4 0-4-4.5-10-10-10z" />
      </g>
    </svg>
  )
}

Logo.propTypes = { size: PropTypes.number }

function Dog() {
  return (
    <g>
      <ellipse cx="150" cy="250" rx="70" ry="45" fill="#d97706" />
      <path d="M95 160c-20-10-30 30-18 55l20-10z" fill="#92400e" />
      <path d="M205 160c20-10 30 30 18 55l-20-10z" fill="#92400e" />
      <circle cx="150" cy="185" r="58" fill="#f59e0b" />
      <ellipse cx="150" cy="212" rx="32" ry="24" fill="#fde68a" />
      <circle cx="128" cy="178" r="7" fill="#1f2937" />
      <circle cx="172" cy="178" r="7" fill="#1f2937" />
      <circle cx="130" cy="176" r="2" fill="#ffffff" />
      <circle cx="174" cy="176" r="2" fill="#ffffff" />
      <ellipse cx="150" cy="200" rx="10" ry="7" fill="#1f2937" />
      <path d="M140 214q10 10 20 0" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M145 220q5 14 10 0z" fill="#f87171" />
      <rect x="112" y="238" width="76" height="12" rx="6" fill="#15803d" />
      <circle cx="150" cy="256" r="8" fill="#facc15" />
    </g>
  )
}

function Cat() {
  return (
    <g>
      <ellipse cx="292" cy="262" rx="52" ry="34" fill="#9ca3af" />
      <path d="M340 270q40-10 30-50" stroke="#9ca3af" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M252 182l-6-38 30 20z" fill="#6b7280" />
      <path d="M332 182l6-38-30 20z" fill="#6b7280" />
      <circle cx="292" cy="205" r="46" fill="#d1d5db" />
      <circle cx="275" cy="200" r="6" fill="#1f2937" />
      <circle cx="309" cy="200" r="6" fill="#1f2937" />
      <path d="M287 214h10l-5 6z" fill="#f472b6" />
      <path d="M262 218h-22M262 224l-20 6M322 218h22M322 224l20 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
      <path d="M284 226q8 6 16 0" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

export function HeroIllustration() {
  return (
    <svg className="illustration" viewBox="0 0 420 320" role="img" aria-label="Un perro y un gato felices">
      <circle cx="215" cy="175" r="128" fill="#dcfce7" />
      <circle cx="80" cy="70" r="22" fill="#bbf7d0" />
      <circle cx="360" cy="90" r="14" fill="#fde68a" />
      <path d="M352 40c-6-8-18-2-12 8l12 12 12-12c6-10-6-16-12-8z" fill="#f87171" />
      <path d="M60 130c-5-6-14-2-10 6l10 9 10-9c4-8-5-12-10-6z" fill="#fb923c" />
      <Dog />
      <Cat />
      <rect x="40" y="292" width="340" height="10" rx="5" fill="#86efac" />
    </svg>
  )
}

export function EmptyIllustration() {
  return (
    <svg className="illustration illustration-small" viewBox="0 0 200 140" aria-hidden="true">
      <ellipse cx="100" cy="122" rx="80" ry="10" fill="#dcfce7" />
      <path d="M40 120q0-50 60-50t60 50z" fill="#15803d" />
      <path d="M62 120q0-30 38-30t38 30z" fill="#14532d" />
      <ellipse cx="100" cy="112" rx="26" ry="12" fill="#f59e0b" />
      <circle cx="84" cy="104" r="12" fill="#f59e0b" />
      <path d="M78 104h4M88 104h4" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <text x="128" y="70" fontSize="18" fill="#16a34a" fontWeight="700">z</text>
      <text x="142" y="54" fontSize="14" fill="#16a34a" fontWeight="700">z</text>
    </svg>
  )
}
