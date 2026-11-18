import PropTypes from 'prop-types'
import Icon from './Icon'
import { ESPECIE_FILTERS } from '../utils/mascotaFilters'

function MascotaFilters({ filters, onChange }) {
  const update = (changes) => onChange({ ...filters, ...changes })

  return (
    <div className="filters" role="search">
      <label className="search-box" htmlFor="buscar-mascota">
        <Icon name="search" />
        <span className="visually-hidden">Buscar mascota</span>
        <input id="buscar-mascota" type="search" placeholder="Buscar por nombre, raza o descripción"
          value={filters.texto} onChange={(event) => update({ texto: event.target.value })} />
      </label>
      <div className="chips" role="group" aria-label="Filtrar por especie">
        {ESPECIE_FILTERS.map((option) => (
          <button key={option.id} type="button" aria-pressed={filters.especie === option.id}
            className={`chip ${filters.especie === option.id ? 'chip-active' : ''}`}
            onClick={() => update({ especie: option.id })}>
            {option.label}
          </button>
        ))}
      </div>
      <label className="toggle" htmlFor="solo-disponibles">
        <input id="solo-disponibles" type="checkbox" checked={filters.soloDisponibles}
          onChange={(event) => update({ soloDisponibles: event.target.checked })} />
        Solo disponibles
      </label>
    </div>
  )
}

MascotaFilters.propTypes = {
  filters: PropTypes.shape({
    texto: PropTypes.string.isRequired,
    especie: PropTypes.string.isRequired,
    soloDisponibles: PropTypes.bool.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MascotaFilters
