import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import MascotaBadge from './MascotaBadge'
import MascotaFoto from './MascotaFoto'
import { formatEdad, SEXO_LABELS } from '../utils/mascotaFilters'

function MascotaCard({ mascota, to }) {
  const Content = (
    <>
      <div className="mascota-card-media">
        <MascotaFoto mascota={mascota} />
        <MascotaBadge adoptada={mascota.adoptada} />
      </div>
      <div className="mascota-card-body">
        <div className="mascota-card-heading">
          <h3>{mascota.nombre}</h3>
          <span className="especie-tag">{mascota.especie}</span>
        </div>
        <dl className="mascota-fields">
          <div><dt>Raza</dt><dd>{mascota.raza || 'No informada'}</dd></div>
          <div><dt>Edad</dt><dd>{formatEdad(mascota.edad)}</dd></div>
          <div><dt>Sexo</dt><dd>{SEXO_LABELS[mascota.sexo] || 'No informado'}</dd></div>
        </dl>
        <p className="mascota-description">{mascota.descripcion || 'Sin descripción'}</p>
        {to ? <span className="mascota-card-cta">Conocer a {mascota.nombre} →</span> : null}
      </div>
    </>
  )

  if (to) {
    return <Link className="mascota-card mascota-card-link" to={to}>{Content}</Link>
  }

  return <article className="mascota-card mascota-card-detail">{Content}</article>
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
    imagen: PropTypes.string,
  }).isRequired,
  to: PropTypes.string,
}

export default MascotaCard
