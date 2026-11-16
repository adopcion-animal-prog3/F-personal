# PROYECTO.md

## Plataforma de Adopción y Gestión de Salud Animal

### 1. Identificación

- **Materia:** Programación III.
- **Repositorio:** `F-personal`.
- **Tipo de proyecto:** frontend web.
- **Tecnologías principales:** React + Vite.
- **Backend consumido:** servicios REST implementados en `B-personal` (FastAPI) y `B-profesional` (Express).
- **Base de datos compartida conceptualmente:** PostgreSQL 18.6, administrada exclusivamente por los backends.

> Este documento describe el alcance previsto de F-personal. Antes de implementar una funcionalidad, se debe comparar con el código actual, las Issues aprobadas y el contrato real de la API. Las decisiones que todavía no hayan sido aprobadas por el profesor deben presentarse como propuestas.

---

## 2. Objetivo general

Desarrollar una aplicación web con React que permita gestionar la adopción y la salud de mascotas. La aplicación debe comunicarse con el backend mediante HTTP/REST y ofrecer una interfaz clara para consultar mascotas, realizar solicitudes de adopción y administrar información clínica de acuerdo con los permisos del usuario.

F-personal es la implementación frontend basada en React + Vite. Debe mantener equivalencia funcional con `F-profesional`, desarrollado con Vue.js, utilizando el mismo contrato de API y flujos de usuario equivalentes.

## 3. Contexto de los cuatro repositorios

| Repositorio | Tecnología | Responsabilidad |
|---|---|---|
| `B-personal` | Python + FastAPI | Backend |
| `F-personal` | React + Vite | Frontend de este repositorio |
| `B-profesional` | Node.js + Express | Backend |
| `F-profesional` | Vue.js | Frontend equivalente |

Los backends deben ofrecer servicios equivalentes mediante tecnologías diferentes. Los frontends deben ofrecer funcionalidades, vistas y recorridos de usuario equivalentes, aunque la implementación interna sea propia de React o Vue.

Este repositorio no debe conectarse directamente a PostgreSQL ni modificar el esquema de la base de datos. Toda lectura o modificación de datos debe hacerse mediante los endpoints del backend.

---

## 4. Alcance funcional

### 4.1 Autenticación y sesión

La aplicación debe contemplar:

- Inicio de sesión.
- Registro de usuarios, si el endpoint correspondiente está disponible y forma parte del contrato aprobado.
- Conservación y recuperación de la sesión según la estrategia definida por el proyecto.
- Envío del JWT como `Authorization: Bearer <token>` en las peticiones protegidas.
- Cierre de sesión.
- Recuperación de los datos del usuario autenticado, si existe el endpoint correspondiente.
- Protección de rutas privadas.
- Presentación de opciones de interfaz según el rol `ADMIN` o `ADOPTANTE`.

La protección visual del frontend no reemplaza la autorización del backend. El backend es la autoridad final para aceptar o rechazar operaciones.

### 4.2 Mascotas

La interfaz debe permitir, de acuerdo con el rol y el contrato de API:

- Listar mascotas.
- Consultar el detalle de una mascota.
- Crear mascotas.
- Editar mascotas.
- Eliminar mascotas.
- Mostrar si una mascota está adoptada.
- Mostrar estados de carga, error y confirmación de operaciones.

Los campos conocidos del modelo son:

- `id`
- `nombre`
- `especie`
- `raza`
- `edad`
- `sexo`
- `descripcion`
- `adoptada`
- `creado_por`
- `created_at`

Reglas conocidas:

- `nombre` y `especie` son obligatorios.
- `edad` puede ser nula; si tiene valor, debe ser mayor o igual a cero.
- `sexo` admite `M`, `F` y `OTRO`.
- `adoptada` es un booleano.

No inventar propiedades como `estado` para mascotas si no aparecen en el contrato real.

### 4.3 Solicitudes de adopción

La interfaz debe contemplar:

- Crear una solicitud para una mascota.
- Consultar las solicitudes permitidas para el usuario autenticado.
- Mostrar el estado de cada solicitud.
- Permitir a `ADMIN` gestionar el estado cuando el backend lo autorice.
- Mostrar mensajes de validación y resultados.

Campos conocidos:

- `id`
- `usuario_id`
- `mascota_id`
- `estado`
- `mensaje`
- `created_at`
- `updated_at`

Estados permitidos:

- `PENDIENTE`
- `APROBADA`
- `RECHAZADA`

El frontend no debe enviar ni permitir manipular la identidad del usuario como mecanismo de autorización. La identidad debe derivarse de la sesión y ser validada por el backend.

### 4.4 Historial clínico

La aplicación debe permitir consultar y gestionar los registros clínicos según el rol y los endpoints disponibles.

Campos conocidos:

- `id`
- `mascota_id`
- `fecha_registro`
- `descripcion`
- `veterinario`
- `created_at`
- `updated_at`

La descripción es obligatoria. No inventar campos ni reglas adicionales sin verificar el contrato.

### 4.5 Vistas previstas

El frontend debe contar con al menos ocho vistas/componentes de pantalla identificables, conforme al criterio de la cátedra. La distribución concreta debe respetar la arquitectura existente. Como referencia, pueden contemplarse:

1. Login.
2. Registro.
3. Inicio o panel principal.
4. Listado de mascotas.
5. Detalle de mascota.
6. Formulario de alta/edición de mascota.
7. Listado/gestión de solicitudes.
8. Formulario o detalle de solicitud de adopción.
9. Historial clínico de mascota.
10. Formulario de registro clínico, si está dentro de los permisos y alcance aprobados.

La lista es una propuesta funcional, no una obligación de crear una ruta independiente por cada punto si el diseño aprobado utiliza otra organización. No crear pantallas artificiales solo para aumentar el conteo.

---

## 5. Contrato de API previsto

La URL base debe configurarse mediante una variable de entorno, por ejemplo:

```env
VITE_API_URL=http://localhost:3000
```

El valor real debe coincidir con el backend seleccionado y el entorno de ejecución. No repetir URLs en componentes.

Endpoints previstos, sujetos a verificación contra la API real:

### Salud

- `GET /health`

### Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

No asumir que el registro o `me` están implementados si no aparecen en el contrato vigente.

### Mascotas

- `GET /api/mascotas`
- `GET /api/mascotas/:id`
- `POST /api/mascotas`
- `PUT /api/mascotas/:id`
- `DELETE /api/mascotas/:id`

### Solicitudes

- `GET /api/solicitudes`
- `GET /api/solicitudes/:id`
- `POST /api/solicitudes`
- `PUT /api/solicitudes/:id`

### Historial clínico

- `GET /api/mascotas/:id/historial`
- `POST /api/mascotas/:id/historial`
- `PUT /api/historial/:id`
- `DELETE /api/historial/:id`

Antes de integrar un endpoint, verificar método, ruta, campos, respuestas, códigos HTTP, autenticación y permisos en la implementación real o en su especificación OpenAPI. No inventar respuestas ni asumir que todos los endpoints están disponibles.

---

## 6. Arquitectura frontend

La estructura exacta debe partir del repositorio existente. Como guía, se recomienda separar responsabilidades en capas reconocibles:

```text
src/
├── components/       # Componentes reutilizables de interfaz
├── views/            # Vistas o pantallas asociadas a rutas
├── services/         # Comunicación HTTP con la API
├── hooks/            # Hooks reutilizables y lógica de estado
├── context/          # Contexto compartido, si corresponde
├── router/           # Configuración de rutas
├── assets/           # Recursos estáticos
└── ...               # Configuración y módulos existentes
```

No crear carpetas vacías ni mover todo el proyecto sin necesidad. Adaptar esta guía a la estructura actual.

### Servicios HTTP

Toda llamada a `fetch` o `axios` debe estar fuera de los componentes de UI y centralizada en `src/services/` o la capa equivalente ya existente.

Los componentes deben consumir funciones de servicios o hooks, no implementar directamente la comunicación HTTP.

### Componentes y estado

- Mantener componentes pequeños y enfocados en una responsabilidad.
- Extraer lógica compartida a hooks.
- Reutilizar componentes, helpers, validadores y formularios ya existentes.
- Evitar duplicar estado o lógica de API.
- Usar el mecanismo de estado existente; no instalar una librería nueva sin necesidad.

### Enrutamiento

Usar la solución de routing existente (por ejemplo, React Router si ya está instalada). Definir rutas públicas y privadas según el flujo aprobado. No duplicar rutas ni crear protecciones que contradigan los permisos del backend.

---

## 7. Requisitos no funcionales

- **Usabilidad:** navegación clara y formularios comprensibles.
- **Accesibilidad básica:** labels, botones identificables y mensajes de error visibles.
- **Responsive:** uso adecuado en computadora, tablet y celular.
- **Seguridad:** no incluir secretos en el frontend; no confiar en permisos decididos únicamente por la UI.
- **Mantenibilidad:** separación en componentes, vistas, servicios y estado.
- **Consistencia:** feedback visual uniforme para carga, error y éxito.
- **Compatibilidad:** mantener el mismo contrato y flujo funcional que F-profesional (Vue).
- **Rendimiento:** evitar renderizados o peticiones innecesarias cuando sea razonable.

---

## 8. Criterios de aceptación generales

El frontend se considerará funcionalmente completo cuando, dentro del alcance aprobado:

- Consuma la API real mediante la capa de servicios.
- Permita iniciar y cerrar sesión.
- Proteja rutas privadas.
- Muestre las vistas principales.
- Permita las operaciones CRUD requeridas.
- Permita gestionar solicitudes e historial clínico según permisos.
- Muestre estados de carga, errores y confirmaciones.
- Mantenga equivalencia funcional con Vue.
- Tenga al menos ocho vistas/componentes de pantalla reales, sin crear elementos artificiales.
- Cuente con al menos cinco archivos de tests separados del código de producción.
- Disponga de pruebas ejecutables y resultados verificables.

El 80 % de cobertura fue establecido en el informe específico de evaluación del backend. Para F-personal se adopta como objetivo interno de calidad cuando el runner y el evaluador aplicable permitan medirlo; verificar el umbral del evaluador frontend antes de afirmar que es un requisito idéntico.

---

## 9. Metodología de Issues y Git

Cada Issue representa una entrega revisable y con alcance delimitado.

Antes de implementarla:

1. Leer la Issue y sus criterios de aceptación.
2. Revisar `.github/copilot-instructions.md`.
3. Revisar este `PROYECTO.md`.
4. Revisar `CRITERIOS-CALIDAD.md`.
5. Inspeccionar rama, estado de Git y cambios locales.
6. Revisar el código existente y sus dependencias.

Durante el trabajo:

- Trabajar solo en la Issue solicitada.
- No implementar Issues futuras.
- No sobrescribir ni descartar cambios locales.
- No hacer push directo a `main`.
- Usar una rama por Issue o por entrega aprobada.
- Usar Conventional Commits.
- Mantener las pruebas y la documentación relacionadas con el cambio.

Flujo de entrega: Issue aprobada → rama → implementación → pruebas → commit → Pull Request → revisión/aprobación del profesor → merge.

Respetar el procedimiento de aprobación establecido por la cátedra. No iniciar una Issue posterior si el proceso exige que la anterior esté presentada, aprobada y mergeada.

---

## 10. Estado del proyecto y advertencias

Este documento es una base de contexto y no reemplaza la inspección del repositorio.

Antes de cada tarea, comprobar:

- Qué componentes y vistas existen realmente.
- Qué endpoints están disponibles.
- Qué autenticación está implementada.
- Qué cambios están mergeados.
- Qué pruebas existen y qué cobertura producen.
- Qué métricas reporta la evaluación actual.

No asumir que las Issues planificadas están implementadas. Si hay contradicciones entre documentación, código y API, informarlas antes de hacer cambios que puedan romper compatibilidad.

No modificar manualmente informes generados automáticamente por la cátedra.
