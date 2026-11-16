import SectionCard from '../components/SectionCard'

function HistorialPage() {
  return (
    <div className="page-shell">
      <SectionCard title="Historial clínico" eyebrow="Mascotas">
        <div className="placeholder-box" role="status" aria-live="polite">
          <p>Historial clínico pendiente.</p>
          <small>Se reservará este espacio para registros, filtros y detalle de consultas veterinarias.</small>
        </div>
      </SectionCard>
    </div>
  )
}

export default HistorialPage
