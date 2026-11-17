import { Link, useNavigate, useParams } from 'react-router-dom'
import FeedbackMessage from '../components/FeedbackMessage'
import HistorialForm from '../components/HistorialForm'
import SectionCard from '../components/SectionCard'
import useHistorialForm from '../hooks/useHistorialForm'

function HistorialFormPage() {
  const { mascotaId, registroId } = useParams()
  const navigate = useNavigate()
  const form = useHistorialForm(mascotaId, registroId)
  const cancelTo = `/historial/${mascotaId}`
  const isEditing = Boolean(registroId)

  const handleSubmit = async (event) => {
    if (await form.submit(event)) {
      navigate(cancelTo, {
        replace: true,
        state: { feedback: isEditing ? 'El registro clínico se actualizó correctamente.' : 'El registro clínico se agregó correctamente.' },
      })
    }
  }

  if (form.isLoading) {
    return <div className="resource-state" role="status" aria-live="polite">Cargando registro...</div>
  }
  if (form.loadError) {
    return (
      <div className="page-shell">
        <FeedbackMessage>{form.loadError}</FeedbackMessage>
        <Link className="button button-secondary" to="/historial">Volver al historial</Link>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <SectionCard title={isEditing ? 'Editar registro clínico' : 'Nuevo registro clínico'}
        eyebrow={`Mascota ${mascotaId}`}>
        <HistorialForm values={form.values} errors={form.errors} onChange={form.updateField}
          onSubmit={handleSubmit} cancelTo={cancelTo} isSubmitting={form.isSubmitting}
          submitError={form.submitError} />
      </SectionCard>
    </div>
  )
}

export default HistorialFormPage
