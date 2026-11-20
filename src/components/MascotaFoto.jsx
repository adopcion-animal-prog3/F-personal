import PropTypes from 'prop-types'

function MascotaFoto({ mascota }) {
  if (mascota.imagen) {
    return <img className="mascota-foto" src={mascota.imagen} alt={`Foto de ${mascota.nombre}`} loading="lazy" />
  }

  return (
    <div className="mascota-foto mascota-foto-vacia" aria-hidden="true">
      {String(mascota.nombre ?? '?').slice(0, 1).toUpperCase()}
    </div>
  )
}

MascotaFoto.propTypes = {
  mascota: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    imagen: PropTypes.string,
  }).isRequired,
}

export default MascotaFoto
