import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import SolicitudForm from '../components/SolicitudForm'
import useSolicitudForm from '../hooks/useSolicitudForm'

function SolicitudFormPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const form = useSolicitudForm(searchParams.get('mascotaId'))

  const handleSubmit = async (event) => {
    if (await form.submit(event)) navigate('/solicitudes', { replace: true })
  }

  if (form.isLoading) {
    return <MascotaResourceState status="loading" loadingMessage="Cargando mascotas..." />
  }
  if (form.loadError) {
    return (
      <div className="page-shell">
        <p className="form-alert form-alert-error" role="alert">{form.loadError}</p>
        <Link className="button button-secondary" to="/solicitudes">Volver</Link>
      </div>
    )
  }
  if (!form.mascotas.length) {
    return (
      <div className="page-shell">
        <MascotaResourceState status="empty" emptyMessage="No hay mascotas disponibles para solicitar." />
        <Link className="button button-secondary" to="/solicitudes">Volver</Link>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <SectionCard title="Solicitar adopción" eyebrow="Nueva solicitud">
        <SolicitudForm mascotas={form.mascotas} values={form.values} errors={form.errors}
          onChange={form.updateField} onSubmit={handleSubmit} cancelTo="/solicitudes"
          isSubmitting={form.isSubmitting} submitError={form.submitError} />
      </SectionCard>
    </div>
  )
}

export default SolicitudFormPage
