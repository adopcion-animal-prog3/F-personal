import SectionCard from '../components/SectionCard'

function SolicitudesPage() {
  return (
    <div className="page-shell">
      <SectionCard title="Solicitudes" eyebrow="Adopción">
        <div className="placeholder-box" role="status" aria-live="polite">
          <p>Gestión de solicitudes pendiente.</p>
          <small>Se prepara la pantalla para crear, consultar y revisar solicitudes por estado.</small>
        </div>
      </SectionCard>
    </div>
  )
}

export default SolicitudesPage
