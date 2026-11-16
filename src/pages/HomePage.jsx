import SectionCard from '../components/SectionCard'

const summary = [
  { label: 'Mascotas activas', value: '24' },
  { label: 'Solicitudes', value: '08' },
  { label: 'Historiales', value: '12' },
]

function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero-panel" aria-label="Resumen general del sistema">
        <div>
          <p className="eyebrow">Resumen</p>
          <h2>Panel general de adopción</h2>
        </div>
        <p>
          Vista base preparada para mostrar métricas, estado del sistema y pendientes de
          implementación del módulo de adopción.
        </p>
      </section>

      <div className="metrics-grid" aria-label="Indicadores principales">
        {summary.map((item) => (
          <article key={item.label} className="metric-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <SectionCard title="Pendientes del módulo" eyebrow="Trabajo en curso">
        <ul className="list-stack">
          <li>Autenticación y roles del usuario.</li>
          <li>Listado y detalle de mascotas con filtros.</li>
          <li>Solicitudes de adopción y aprobación/rechazo.</li>
          <li>Registros clínicos y historial por mascota.</li>
        </ul>
      </SectionCard>
    </div>
  )
}

export default HomePage
