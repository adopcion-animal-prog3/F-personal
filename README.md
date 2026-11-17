# F-personal

Frontend de la Plataforma de Adopción y Gestión de Salud Animal, desarrollado
con React y Vite. Consume la API REST de B-personal; no se conecta directamente
con PostgreSQL.

## Requisitos

- Node.js compatible con Vite 5.
- B-personal disponible en `http://localhost:8000` para el modo de desarrollo.
- La configuración de PostgreSQL y JWT requerida por B-personal. No guardar
  secretos del backend en este proyecto.

## Instalación y ejecución integrada

Desde esta carpeta:

```bash
npm ci
```

Copiar `.env.example` a `.env` y mantener estos valores para el backend local:

```env
VITE_API_URL=/
API_PROXY_TARGET=http://localhost:8000
```

Iniciar B-personal siguiendo su README y, en otra terminal, iniciar el
frontend:

```bash
npm run dev
```

Vite envía las rutas `/api/*` al backend configurado en `API_PROXY_TARGET`.
Este proxy de desarrollo permite trabajar sin habilitar CORS en B-personal para
el origen local de Vite. Para desplegar el frontend, configurar `VITE_API_URL`
con la URL pública de la API y permitir ese origen en CORS o usar un proxy
inverso; el proxy incluido en Vite no forma parte del build de producción.

## Funcionalidades conectadas

- Registro, inicio/cierre de sesión, validación de JWT y recuperación de
  usuario mediante `/api/auth/me`.
- Consulta de mascotas para usuarios autenticados; alta, edición y eliminación
  solo para `ADMIN`.
- Creación y consulta de solicitudes para `ADMIN` y `ADOPTANTE`; el backend
  determina las solicitudes visibles y solo `ADMIN` puede cambiar el estado.
- Consulta y gestión del historial clínico solo para `ADMIN`.
- Estados de carga, ausencia de datos y errores HTTP presentados en la interfaz.

El frontend respeta el envelope exitoso `{success, status, data}` y el envelope
de errores de B-personal. La autorización del backend siempre es la autoridad;
las rutas y acciones ocultas en la interfaz no la reemplazan.

## Verificación

```bash
npm run test:run
npm run lint
npm run build
```

Las pruebas frontend usan servicios simulados. Para comprobar la integración
real, ejecutar ambos proyectos con una base de datos configurada y validar en
la aplicación los recorridos y permisos de `ADMIN` y `ADOPTANTE`.
