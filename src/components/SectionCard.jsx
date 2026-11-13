function SectionCard({ title, eyebrow, children, accent }) {
  return (
    <section className="section-card" aria-label={title}>
      <div className="section-header">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      <div className={`section-body ${accent ? `accent-${accent}` : ''}`}>{children}</div>
    </section>
  )
}

export default SectionCard
