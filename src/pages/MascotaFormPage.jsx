import { Link, useNavigate, useParams } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import MascotaForm from '../components/MascotaForm'
import SectionCard from '../components/SectionCard'
import useMascotaForm from '../hooks/useMascotaForm'

function MascotaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const form = useMascotaForm(id)
  const cancelTo = isEditing ? `/mascotas/${id}` : '/mascotas'

  const handleSubmit = async (event) => {
    if (await form.submit(event)) {
      navigate(isEditing ? `/mascotas/${id}` : '/mascotas', {
        replace: true,
        state: { feedback: isEditing ? 'La mascota fue actualizada correctamente.' : 'La mascota fue creada correctamente.' },
      })
    }
  }

  if (form.isLoading) {
    return <div className="resource-state" role="status" aria-live="polite">Cargando mascota...</div>
  }
  if (form.loadError) {
    return (
      <div className="page-shell">
        <FeedbackMessage>{form.loadError}</FeedbackMessage>
        <Link className="button button-secondary" to="/mascotas">Volver al listado</Link>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <SectionCard title={isEditing ? 'Editar mascota' : 'Nueva mascota'} eyebrow="Gestión">
        <MascotaForm values={form.values} errors={form.errors} onChange={form.updateField}
          onSubmit={handleSubmit} cancelTo={cancelTo} isSubmitting={form.isSubmitting}
          submitError={form.submitError} />
      </SectionCard>
    </div>
  )
}

export default MascotaFormPage
