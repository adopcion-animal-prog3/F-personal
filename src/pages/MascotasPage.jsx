import SectionCard from '../components/SectionCard'

function MascotasPage() {
  return (
    <div className="page-shell">
      <SectionCard title="Mascotas" eyebrow="Listado">
        <div className="placeholder-box" role="status" aria-live="polite">
          <p>Listado de mascotas pendiente.</p>
          <small>Se preparará la vista de listado, detalle y gestión de alta/edición.</small>
        </div>
      </SectionCard>
    </div>
  )
}

export default MascotasPage
