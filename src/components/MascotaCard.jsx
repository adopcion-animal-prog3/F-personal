import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import MascotaBadge from './MascotaBadge'

function MascotaCard({ mascota, to, showHeading = true }) {
  const Content = (
    <div>
      {showHeading ? (
        <div className="mascota-card-heading">
          <h3>{mascota.nombre}</h3>
          <MascotaBadge adoptada={mascota.adoptada} />
        </div>
      ) : null}
      <dl className="mascota-fields">
        <div><dt>Especie</dt><dd>{mascota.especie}</dd></div>
        <div><dt>Raza</dt><dd>{mascota.raza || 'No informada'}</dd></div>
        <div><dt>Edad</dt><dd>{mascota.edad ?? 'No informada'}</dd></div>
        <div><dt>Sexo</dt><dd>{mascota.sexo || 'No informado'}</dd></div>
        <div className="mascota-description">
          <dt>Descripción</dt><dd>{mascota.descripcion || 'Sin descripción'}</dd>
        </div>
      </dl>
    </div>
  )

  if (to) {
    return <Link className="mascota-card mascota-card-link" to={to}>{Content}</Link>
  }

  return <article className="mascota-card">{Content}</article>
}

MascotaCard.propTypes = {
  mascota: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    especie: PropTypes.string.isRequired,
    raza: PropTypes.string,
    edad: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sexo: PropTypes.string,
    descripcion: PropTypes.string,
    adoptada: PropTypes.bool.isRequired,
  }).isRequired,
  to: PropTypes.string,
  showHeading: PropTypes.bool,
}

export default MascotaCard
