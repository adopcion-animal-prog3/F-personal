import PropTypes from 'prop-types'
import PageHeader from './PageHeader'

// Página con encabezado y un panel blanco para el contenido principal.
function SectionCard({ title, eyebrow, description, children }) {
  return (
    <section className="section-card" aria-label={title}>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="panel section-body">{children}</div>
    </section>
  )
}

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
}

export default SectionCard
