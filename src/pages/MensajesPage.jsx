import ConversacionItem from '../components/ConversacionItem'
import MascotaResourceState from '../components/MascotaResourceState'
import SectionCard from '../components/SectionCard'
import useConversaciones from '../hooks/useConversaciones'

function MensajesPage() {
  const { data, error, status, retry } = useConversaciones()
  const conversaciones = data ?? []
  const isEmpty = status === 'success' && conversaciones.length === 0

  return (
    <div className="page-shell">
      <SectionCard title="Mensajes" eyebrow="Conversaciones"
        description="Para iniciar una conversación, entrá a una mascota y tocá “Contactar al publicador”.">
        {status === 'success' && !isEmpty ? (
          <div className="conversacion-list">
            {conversaciones.map((conversacion) => (
              <ConversacionItem key={conversacion.usuario.id} conversacion={conversacion} />
            ))}
          </div>
        ) : (
          <MascotaResourceState status={isEmpty ? 'empty' : status}
            error={`No se pudieron cargar los mensajes. ${error}`}
            emptyMessage="Todavía no tenés conversaciones."
            loadingMessage="Cargando conversaciones..." onRetry={retry} />
        )}
      </SectionCard>
    </div>
  )
}

export default MensajesPage
