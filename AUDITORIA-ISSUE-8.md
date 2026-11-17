# Auditoría de F-personal — Issue 8

## Alcance y resultado

La revisión se limitó a F-personal. Se leyeron los tres documentos de contexto y no se modificaron. No se abrieron ni modificaron otros repositorios. No se conectó la aplicación a una API real; las pruebas automatizadas y la comprobación visual protegida usaron servicios simulados.

Correcciones puntuales: la autenticación ahora falla con un mensaje controlado si falta `VITE_API_URL`; mascotas reutiliza el guard compartido; el formulario de registro valida `confirmPassword` localmente pero no lo envía; se quitó del inicio un resumen con cifras ficticias y enlaces a tareas ya implementadas.

## Estado funcional

- **Autenticación y sesión:** login, registro, persistencia local, recuperación con `GET /api/auth/me`, JWT Bearer, logout y protección de rutas. La interfaz distingue `ADMIN` y `ADOPTANTE`; el backend debe aplicar la autorización efectiva.
- **Mascotas:** listado, detalle, alta, edición y eliminación; validación y confirmación de borrado. Gestión visual solo para `ADMIN`.
- **Solicitudes:** listado y creación para usuarios autenticados; estados `PENDIENTE`, `APROBADA`, `RECHAZADA`; acciones de estado solo para `ADMIN`. El frontend filtra adoptantes por `usuario_id`, lo que no reemplaza el filtro/autorización del backend.
- **Historial clínico:** selector de mascota, consulta, alta, edición y eliminación con confirmación; restringido visualmente a `ADMIN`.
- **Navegación y feedback:** rutas protegidas, login/registro, página 404, carga/error/vacío y feedback de operaciones. Los formularios bloquean envíos repetidos.
- **Dato de dominio:** no se encontró un campo `estado` inventado para mascotas; se usa `adoptada`.

## Pantallas

Hay **11 archivos `*Page.jsx`** y **14 modos de pantalla/ruta** (login/registro y alta/edición reutilizan páginas): login, registro, inicio, listado/detalle de mascotas, alta/edición de mascota, solicitudes, nueva solicitud, selector de mascota para historial, historial por mascota, alta/edición clínica y 404. Las páginas son `AuthPage`, `HomePage`, `MascotasPage`, `MascotaDetailPage`, `MascotaFormPage`, `SolicitudesPage`, `SolicitudFormPage`, `HistorialPage`, `HistorialMascotaPage`, `HistorialFormPage` y `NotFoundPage`. No son placeholders vacíos.

## Arquitectura y contratos preparados

- UI en `src/components/` y `src/pages/`; estado/orquestación en `src/hooks/` y `src/context/`; HTTP en `src/services/`; rutas en `src/router/`.
- `api.js` centraliza URL base, JSON, `Authorization: Bearer`, errores HTTP y token. `VITE_API_URL` es obligatorio en los servicios; el ejemplo está vacío.
- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`. Se esperan payloads de credenciales (`email`, `password`; registro también `nombre`). Se aceptan variantes de respuesta `token`/`access_token`/`accessToken`/`jwt` y `user`/`usuario`/`data`; confirmar formato real.
- **Mascotas:** GET lista/detalle, POST colección, PUT/DELETE por ID. Listado esperado: array; detalle: objeto; 404 de detalle: recurso inexistente. Payload de escritura: `nombre`, `especie`, `raza`, `edad`, `sexo`, `descripcion`.
- **Solicitudes:** GET colección, POST colección y PUT por ID. Listado esperado: array; creación envía `mascota_id` y `mensaje`, nunca `usuario_id`; cambio envía `{ estado }`.
- **Historial:** GET/POST por mascota y PUT/DELETE por registro. Listado esperado: array; payload: `fecha_registro`, `descripcion`, `veterinario`.
- El cliente transforma errores usando `detail`, `message`, `error` o texto HTTP; respuestas 2xx sin JSON se representan como `null`.
- `GET /api/solicitudes/:id` figura en `PROYECTO.md`, pero no se consume ni está preparado por la UI actual; no hay vista de detalle. `GET /health` tampoco se consume.

## Calidad medida

| Criterio | Resultado comprobado |
|---|---|
| Índice ≥60, duplicación ≤15%, no-layering y métricas oficiales | **Pendientes:** no hay evaluador de cátedra en scripts/dependencias; no se estiman valores. |
| SEC | No se hallaron credenciales reales. `.env` no existe y Git lo ignora; `.env.example` está trackeado y solo contiene `VITE_API_URL=`. `secret123` aparece únicamente como fixture de tests. |
| SQL | No se encontraron consultas SQL ni conexión directa a PostgreSQL en el frontend. |
| HTTP | Sin `fetch`/`axios` en componentes, páginas o hooks; el uso de `fetch` está en el cliente central. |
| DBG | Sin `console.log/debug/info`, `debugger`, `print`, `pprint`, `pdb` ni `binding.pry` en `src`. |
| ANY | No aplica: el proyecto usa JavaScript. |
| BigC | Un archivo JSX supera 149 líneas: `AuthContext.jsx` (184); es el proveedor de sesión, no una pantalla. Ningún componente visual alcanza 150 líneas. |
| Tests / vistas | 20 archivos de tests, 71 casos aprobados; 11 archivos de página (14 modos). |
| Cobertura | Pendiente: no hay script/proveedor de cobertura configurado. |

Conteo de producción: 56 archivos JS/JSX y 2.387 LOC. Archivos de `src` sobre 129 líneas: `App.css` (770), `AuthContext.jsx` (184) y `MascotaCrudPages.test.jsx` (140). La hoja sigue siendo global, con dos breakpoints responsive (860 y 640 px); no se dividió artificialmente. Tampoco se dividieron el proveedor ni el test cohesivo. Un chequeo ESLint ad hoc con umbrales de 29 líneas y complejidad 5 reportó 45 advertencias combinadas; no equivale a las métricas de cátedra. No detectó funciones con más de cuatro parámetros.

## Pruebas y verificaciones

- `npm run test:run`: **20 archivos y 71 tests aprobados**. Las pruebas de servicio/UI usan mocks; no son integración real.
- `npm run build`: aprobado (97 módulos).
- `npm run lint`: aprobado sin warnings.
- `git diff --check`: aprobado.
- Navegador: 78 comprobaciones de desbordamiento en 375, 430, 768, 1024, 1366 y 1920 px, sobre login, registro, 404 e inicio/módulos/rutas de administración. No hubo overflow horizontal. Las rutas protegidas usaron un servidor mock temporal con datos de prueba; no valida contratos reales ni permisos del backend.

## Pendientes para la integración posterior

1. Configurar `VITE_API_URL` en el entorno local y verificar CORS, Bearer, expiración y rechazo de sesiones.
2. Contrastar OpenAPI/backend para payloads y respuestas de login, registro y `/me`, incluyendo errores, campos obligatorios, códigos y respuestas 204.
3. Confirmar disponibilidad/permisos de todos los endpoints; decidir si la vista necesita `GET /api/solicitudes/:id` y verificar `/health` solo si se va a consumir.
4. Confirmar que el backend filtra solicitudes por sesión, impide manipular `usuario_id`, y limita transiciones de estado a ADMIN.
5. Confirmar el tratamiento de mascotas ya adoptadas al solicitar adopción.
6. Ejecutar integración y E2E reales entre repositorios cuando el usuario conecte los backends; todavía no hay evidencia de integración real.

## Archivos de esta auditoría

- `src/services/authService.js`, `src/services/authService.test.js`: error controlado sin URL y prueba de Bearer/configuración.
- `src/services/mascotasService.js`: reutilización de `requireApiUrl`.
- `src/components/AuthForm.jsx`, `src/components/AuthForm.test.jsx`: exclusión de `confirmPassword` del payload.
- `src/pages/HomePage.jsx`, `src/pages/HomePage.test.jsx`: reemplazo del resumen ficticio y prueba del acceso al listado real.
- `src/App.test.jsx`, `src/context/AuthContext.test.jsx`: configuración explícita de API en pruebas y cobertura de logout.

No se hicieron commits, push ni cambios fuera de F-personal o del alcance de auditoría.
