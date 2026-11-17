import { Link, useNavigate, useParams } from 'react-router-dom'
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
      navigate(isEditing ? `/mascotas/${id}` : '/mascotas', { replace: true })
    }
  }

  if (form.isLoading) return <div className="resource-state" role="status">Cargando mascota...</div>
  if (form.loadError) {
    return (
      <div className="page-shell">
        <p className="form-alert form-alert-error" role="alert">{form.loadError}</p>
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
