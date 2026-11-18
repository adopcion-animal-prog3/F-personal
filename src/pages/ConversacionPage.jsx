import { Link, useParams, useSearchParams } from 'react-router-dom'
import MascotaResourceState from '../components/MascotaResourceState'
import MensajeForm from '../components/MensajeForm'
import MensajeHilo from '../components/MensajeHilo'
import SectionCard from '../components/SectionCard'
import useAuth from '../hooks/useAuth'
import useConversacion from '../hooks/useConversacion'

function ConversacionPage() {
  const { usuarioId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const conversacion = useConversacion(usuarioId, searchParams.get('mascotaId'))
  const titulo = conversacion.usuario ? `Conversación con ${conversacion.usuario.nombre}` : 'Conversación'

  return (
    <div className="page-shell">
      <SectionCard title={titulo} eyebrow="Mensajes">
        {conversacion.status === 'success' ? (
          <>
            <MensajeHilo mensajes={conversacion.mensajes} userId={user?.id} />
            <MensajeForm onSend={conversacion.enviar} isSending={conversacion.isSending}
              error={conversacion.sendError} />
          </>
        ) : (
          <MascotaResourceState status={conversacion.status}
            error={`No se pudo cargar la conversación. ${conversacion.error}`}
            loadingMessage="Cargando conversación..." onRetry={conversacion.retry} />
        )}
        <Link className="button button-secondary mascota-back-link" to="/mensajes">
          Volver a mensajes
        </Link>
      </SectionCard>
    </div>
  )
}

export default ConversacionPage
