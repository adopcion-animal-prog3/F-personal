# GitHub Copilot Instructions — F-personal
## Plataforma de Adopción y Gestión de Salud Animal

Estas instrucciones corresponden exclusivamente al repositorio **F-personal**, el frontend desarrollado con **React + Vite** del proyecto integrador de Programación III.

Copilot debe leer estas instrucciones antes de implementar cualquier tarea en este repositorio. También debe revisar `PROYECTO.md` si existe, la Issue actual y el código real antes de modificar archivos.

---

# 1. Contexto del proyecto

El proyecto integrador se llama **Plataforma de Adopción y Gestión de Salud Animal**. Su objetivo es desarrollar una aplicación web para gestionar usuarios, mascotas, solicitudes de adopción e historiales clínicos.

Las funcionalidades generales previstas son:

- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Navegación según la sesión y los permisos del usuario.
- Consulta, creación, edición y eliminación de mascotas.
- Creación y consulta de solicitudes de adopción.
- Aprobación o rechazo de solicitudes por parte de usuarios autorizados.
- Consulta y gestión del historial clínico según los permisos definidos.
- Feedback visual para operaciones exitosas, errores y estados de carga.

Los roles principales son `ADMIN` y `ADOPTANTE`.

El frontend debe ser sencillo, entendible, mantenible y adecuado para que estudiantes de 5.º año de una escuela técnica informática puedan explicar y defender oralmente sus decisiones técnicas. Evitar soluciones innecesariamente complejas.

---

# 2. Repositorios y diversidad tecnológica

El proyecto está dividido en cuatro repositorios independientes:

| Repositorio | Tecnología | Responsabilidad |
|---|---|---|
| `B-personal` | Python + FastAPI | Backend |
| `F-personal` | React + Vite | Frontend de este repositorio |
| `B-profesional` | Node.js + Express | Segundo backend |
| `F-profesional` | Vue.js | Segundo frontend |

Este repositorio es **F-personal**. No lo confundas con `F-profesional` ni con los backends.

## Requisito de equivalencia

`F-personal` y `F-profesional` deben implementar la misma aplicación mediante frameworks diferentes.

Por lo tanto, ambas aplicaciones deben mantener equivalencia funcional en:

- Funcionalidades principales.
- Vistas y flujos de usuario.
- Rutas o equivalentes funcionales.
- Formularios y validaciones.
- Consumo de endpoints.
- Autenticación y autorización.
- Manejo de errores y estados de carga.
- Feedback de éxito.
- Operaciones CRUD y flujos de adopción e historial clínico.

No es necesario que el código React y Vue sea idéntico. La equivalencia requerida es funcional y de contrato.

Cuando exista una implementación equivalente en Vue, puede utilizarse como referencia conceptual, pero primero debe revisarse el contrato de API y las decisiones del repositorio React. No copies código Vue literalmente ni introduzcas dependencias propias de Vue.

No agregues funcionalidades exclusivas de React que alteren el flujo compartido, salvo que exista una necesidad técnica justificada.

---

# 3. Tecnologías y alcance técnico

La tecnología principal de este repositorio es:

- React.
- Vite.
- JavaScript o TypeScript, según lo que ya utilice el repositorio.
- React Router, si ya está instalado o si la arquitectura aprobada lo utiliza.
- CSS o la solución de estilos existente.
- Cliente HTTP mediante la capa de servicios del proyecto.

Antes de introducir o actualizar una dependencia:

1. Revisar `package.json` y el lockfile.
2. Comprobar si ya existe una solución equivalente.
3. Reutilizar las dependencias actuales siempre que sea razonable.
4. Instalar únicamente lo indispensable para la Issue.
5. No actualizar paquetes no relacionados con la tarea.

No migres JavaScript a TypeScript, ni cambies el sistema de estilos o enrutamiento, solo para aplicar una preferencia personal. Respetá las tecnologías y convenciones existentes.

---

# 4. Arquitectura del proyecto

La estructura real del repositorio tiene prioridad. Antes de crear carpetas, inspeccioná cómo está organizado el código y reutilizá sus convenciones.

La arquitectura debe mantener separación reconocible entre vistas/componentes, servicios HTTP y estado.

Como referencia, la organización puede ser similar a:

```text
src/
├── components/       # Componentes reutilizables de interfaz
├── pages/            # Pantallas o vistas principales
├── services/         # Comunicación HTTP con el backend
├── hooks/            # Custom Hooks y lógica reutilizable de React
├── context/          # Contexto compartido, si corresponde
├── store/            # Estado global, si ya existe una solución
├── router/           # Configuración de rutas, si está separada
├── utils/            # Funciones auxiliares reutilizables
├── assets/           # Imágenes y recursos
└── ...
```

Esta estructura es orientativa. No dupliques carpetas ni reorganices todo el repositorio si ya existe una estructura equivalente.

El evaluador de la cátedra reconoce, entre otras, estas capas frontend por sus nombres:

- Vistas: `components/`, `views/`, `pages/`, `layouts/`, `ui/`.
- Servicios: `services/`, `api/`, `clients/`, `http/`.
- Estado: `store/`, `state/`, `context/`, `redux/`, `pinia/`, `hooks/`, `composables/`.

La meta es tener al menos dos capas reconocibles a partir de 150 LOC. Para el diseño de este frontend, se debe procurar separar vistas/componentes, servicios y estado/hooks cuando corresponda. El nombre de una carpeta no sustituye una separación real de responsabilidades.

---

# 5. Backend y base de datos

Los backends del proyecto son:

- `B-personal`: Python + FastAPI.
- `B-profesional`: Node.js + Express.

Ambos utilizan conceptualmente la misma base de datos PostgreSQL 18.6, ejecutada mediante Docker y con persistencia por volumen.

**El frontend nunca debe conectarse directamente a PostgreSQL.** Toda operación de datos debe pasar por la API HTTP.

No modificar desde este repositorio:

- Código de `B-personal` o `B-profesional`.
- `init.sql` o scripts del esquema del backend.
- `docker-compose.yml` del backend.
- Tablas, columnas, relaciones ni restricciones de PostgreSQL.

Si se detecta un problema en un endpoint, contrato o respuesta del backend:

1. Identificarlo y explicar qué necesita el frontend.
2. No inventar campos ni respuestas.
3. No cambiar el backend desde F-personal.
4. Informar el problema para que se atienda en el repositorio backend correspondiente.

---

# 6. Entidades y campos conocidos

Estos son los campos conocidos del modelo compartido. Antes de enviar o consumir datos, verificar el contrato real de la API y no asumir que todos los endpoints devuelven todos los campos.

## Usuarios

- `id`
- `nombre`
- `email`
- `password_hash` (nunca debe mostrarse ni manejarse desde la interfaz)
- `rol`
- `created_at`

Roles:

- `ADMIN`
- `ADOPTANTE`

Nunca mostrar ni guardar `password_hash` en el frontend.

## Mascotas

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
- `edad` puede ser nula; si tiene valor debe ser mayor o igual a cero.
- `sexo` admite `M`, `F` y `OTRO`.
- `adoptada` es booleano.

No inventes una propiedad `estado` para las mascotas si el contrato actual no la incluye. No confundas `adoptada` con el estado de una solicitud.

## Solicitudes de adopción

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

El frontend no debe permitir que el usuario elija o suplante arbitrariamente su `usuario_id` cuando el backend obtiene la identidad desde el JWT.

## Historial clínico

- `id`
- `mascota_id`
- `fecha_registro`
- `descripcion`
- `veterinario`
- `created_at`
- `updated_at`

La descripción es obligatoria. Los campos y acciones editables deben respetar el contrato real y los permisos del usuario.

---

# 7. Contrato de API previsto

Los siguientes endpoints forman parte del contrato general previsto del proyecto. No asumas que todos están implementados o disponibles en el backend conectado.

Antes de integrar una operación:

1. Revisá la documentación OpenAPI si existe.
2. Revisá los servicios y llamadas existentes en este frontend.
3. Revisá el endpoint y su respuesta real cuando sea posible.
4. Confirmá nombres de propiedades, tipos, autenticación y códigos HTTP.
5. Si la implementación del backend no coincide, informá la diferencia; no inventes una solución.

## Salud

- `GET /health`

## Autenticación

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

No asumas que el registro o `GET /api/auth/me` existen solo porque están planificados. Comprobá su presencia.

## Mascotas

- `GET /api/mascotas`
- `GET /api/mascotas/:id`
- `POST /api/mascotas`
- `PUT /api/mascotas/:id`
- `DELETE /api/mascotas/:id`

## Solicitudes

- `GET /api/solicitudes`
- `GET /api/solicitudes/:id`
- `POST /api/solicitudes`
- `PUT /api/solicitudes/:id`

## Historial clínico

- `GET /api/mascotas/:id/historial`
- `POST /api/mascotas/:id/historial`
- `PUT /api/historial/:id`
- `DELETE /api/historial/:id`

Implementá únicamente los endpoints necesarios para la Issue actual. No agregues endpoints al frontend ni supongas que una ruta no verificada existe.

---

# 8. URL del backend y variables de entorno

La URL base debe centralizarse en una variable de entorno, por ejemplo:

```env
VITE_API_URL=http://localhost:3000
```

El valor concreto debe coincidir con el backend y la configuración local del proyecto.

Usá el mecanismo de variables de entorno de Vite y una configuración centralizada del cliente HTTP. No repitas URLs en los componentes ni servicios.

IMPORTANTE: las variables `VITE_*` se exponen al código del navegador. Nunca guardes secretos, contraseñas de base de datos, claves privadas ni `JWT_SECRET` en variables `VITE_*`.

El archivo `.env` local no debe subirse al repositorio. Mantené un `.env.example` con nombres y ejemplos no sensibles cuando corresponda.

---

# 9. REGLA OBLIGATORIA: ARCHIVOS PEQUEÑOS

Cada archivo nuevo debe tener **menos de 130 líneas cuando sea razonable**.

Esta regla se aplica especialmente a pantallas y componentes React.

- Cada nueva pantalla o UI debe dividirse en subcomponentes reutilizables dentro de `components/` cuando corresponda.
- La lógica de estado, formularios y llamadas a la API debe extraerse a Custom Hooks dentro de `src/hooks/` o a la ubicación equivalente que ya utilice el proyecto.
- No concentres renderizado, estado, validaciones y llamadas HTTP en un único componente.
- Evitá ampliar innecesariamente un archivo existente que ya sea grande.
- Si un archivo nuevo necesita superar excepcionalmente el límite por una razón técnica real, explicá por qué.
- No dividas artificialmente el código en componentes de una sola línea ni crees abstracciones sin utilidad.

El evaluador de la cátedra considera componente grande a un archivo `.jsx` o `.tsx` de 150 líneas o más. La regla interna de este proyecto es más estricta: apuntar a menos de 130 líneas para los archivos nuevos, cuando sea razonable.

---

# 10. REGLA OBLIGATORIA: CERO DUPLICACIÓN

Antes de crear componentes, hooks, validaciones, servicios o helpers, buscá si ya existe una solución equivalente.

Reutilizá cuando corresponda:

- Botones e inputs comunes.
- Formularios y campos compartidos.
- Tablas, tarjetas y elementos de listado.
- Modales y confirmaciones.
- Alertas y mensajes de feedback.
- Indicadores de carga.
- Validaciones.
- Funciones de formato.
- Servicios HTTP.
- Hooks de sesión y estado.
- Componentes de layout y navegación.

No copies y pegues lógica entre pantallas.

La duplicación es una métrica evaluada por la cátedra. La meta es **15 % o menos**. Extraé lógica compartida cuando mejore la mantenibilidad, sin introducir abstracciones complejas ni modificar comportamientos ajenos a la Issue.

---

# 11. REGLA OBLIGATORIA: LLAMADAS HTTP AISLADAS

Está prohibido utilizar `fetch` o `axios` directamente dentro de componentes visuales.

Toda comunicación con el backend debe estar centralizada en `src/services/` o en la capa de API equivalente ya existente.

Los componentes no deben conocer detalles de URLs, headers, configuración del cliente HTTP ni construcción de peticiones.

Separación esperada:

- `components/` y `pages/`: presentación e interacción visual.
- `services/`: comunicación HTTP y transformación de datos necesaria para la API.
- `hooks/`: estado y coordinación de operaciones reutilizables.
- `context/` o `store/`: estado compartido cuando corresponda.

Usá los servicios existentes en lugar de crear otro cliente HTTP.

Si una Issue requiere una nueva operación, agregala al servicio correspondiente y consumila desde un hook o desde la capa de lógica de la vista, siguiendo la arquitectura actual.

La meta del criterio HTTP de la cátedra es **cero llamadas `fetch` o `axios` dentro de componentes de UI**.

---

# 12. REGLA OBLIGATORIA: CONSULTAS SQL SEGURAS

Este repositorio es exclusivamente frontend y no debe ejecutar SQL ni conectarse directamente a PostgreSQL.

No agregues consultas SQL, clientes de base de datos ni credenciales de PostgreSQL en React.

La regla de parametrización SQL corresponde a los repositorios backend. Si excepcionalmente una tarea autorizada incluye código backend, todas las consultas nuevas o modificadas deben estar parametrizadas y nunca concatenar valores de usuarios.

En F-personal, los datos se obtienen exclusivamente mediante la API HTTP.

---

# 13. REGLA OBLIGATORIA: CERO CÓDIGO DE DEPURACIÓN

El código entregado debe estar libre de mensajes de depuración olvidados.

No agregues:

- `console.log`.
- `console.debug`.
- `console.info`.
- `debugger`.
- `print`.
- Código temporal de depuración.

No dejes tokens, contraseñas, datos personales ni respuestas completas de API en la consola.

Manejá los errores de forma controlada y mostrale al usuario mensajes claros.

La cátedra admite un logger con niveles cuando corresponda. No agregues una biblioteca de logging innecesaria al frontend.

El objetivo del criterio DBG es **cero mensajes de depuración olvidados**.

---

# 14. CAPAS Y ESTADO DE LA APLICACIÓN

El frontend debe tener separación reconocible entre:

1. Vistas y componentes.
2. Servicios/API.
3. Estado y lógica reutilizable.

Usá Custom Hooks para extraer lógica que pueda reutilizarse o que vuelva demasiado complejo un componente.

Usá Context o el sistema de estado existente solamente cuando sea necesario compartir información entre distintas partes de la aplicación.

No instales Redux, Zustand u otra solución si el proyecto ya tiene una forma sencilla y suficiente de manejar el estado.

No dupliques el estado de autenticación en diferentes lugares.

La sesión debe tener una única fuente de verdad coherente con la arquitectura existente.

---

# 15. AUTENTICACIÓN Y SESIÓN

La aplicación utiliza JWT según el contrato del backend.

Debe poder:

- Iniciar sesión.
- Conservar la sesión según la estrategia existente.
- Recuperar la información pública del usuario cuando el backend lo permita.
- Enviar el token en las peticiones protegidas.
- Cerrar sesión y limpiar los datos de sesión.
- Redirigir al usuario cuando corresponda.

Utilizá el mecanismo de almacenamiento ya definido en el proyecto. No cambies arbitrariamente entre `localStorage`, `sessionStorage` o cookies.

No guardes contraseñas.

No muestres el token.

No imprimas JWT en consola.

Si el token falta, es inválido o expiró, manejá la sesión de manera controlada según el contrato existente.

No supongas que un endpoint de recuperación de usuario existe: verificá primero si está implementado.

---

# 16. RUTAS Y PROTECCIÓN DE VISTAS

Respetá el sistema de enrutamiento ya instalado.

Si el proyecto utiliza React Router, reutilizá su configuración y sus convenciones.

Las rutas públicas pueden incluir:

- Login.
- Registro.

Las rutas privadas deben requerir una sesión válida.

Las rutas administrativas deben respetar los permisos definidos para `ADMIN`.

Los adoptantes no deben acceder a funcionalidades exclusivas de administración.

La protección visual de rutas no reemplaza la autorización del backend. El backend siempre debe validar los permisos.

No implementes permisos nuevos ni cambies el contrato de roles.

---

# 17. VISTAS Y FUNCIONALIDADES PRINCIPALES

La aplicación debe alcanzar equivalencia funcional con F-profesional (Vue).

Las vistas previstas incluyen, según el alcance aprobado:

## Autenticación
- Login.
- Registro.

## Mascotas
- Listado de mascotas.
- Detalle de mascota.
- Formulario de creación.
- Formulario de edición.

## Solicitudes de adopción
- Listado de solicitudes.
- Formulario para crear una solicitud.
- Gestión del estado de solicitudes para usuarios autorizados.

## Historial clínico
- Consulta del historial de una mascota.
- Formulario para crear un registro.
- Edición de un registro.
- Eliminación de un registro.

No implementes todas las vistas en una sola Issue. Respetá la planificación y las dependencias del proyecto.

El criterio de vistas del perfil exigente requiere **al menos ocho componentes o pantallas de UI** en el repositorio frontend. Deben ser vistas/componentes reales y útiles; no crees pantallas artificiales solo para alcanzar el número.

---

# 18. FORMULARIOS Y VALIDACIONES

Los formularios deben validar datos antes de enviar solicitudes.

Ejemplos:

- Email con formato válido.
- Campos obligatorios completos.
- Edad nula o mayor/igual a cero, según el modelo.
- Sexo limitado a `M`, `F` u `OTRO`.
- Descripción clínica obligatoria.
- Estados de solicitud limitados a `PENDIENTE`, `APROBADA` y `RECHAZADA`, según los permisos.

La validación del frontend mejora la experiencia, pero no reemplaza la validación del backend.

No inventes campos ni reglas que no estén en el contrato real.

Reutilizá las validaciones existentes cuando sea razonable.

Mostrá errores cerca de los campos correspondientes y evitá enviar repetidamente el mismo formulario mientras una petición está en curso.

---

# 19. CARGA, ERRORES Y FEEDBACK

Las operaciones HTTP deben contemplar estados de:

- Carga.
- Éxito.
- Error.
- Estado vacío, cuando corresponda.

Ejemplos de mensajes comprensibles:

- No se pudieron cargar las mascotas.
- El email o la contraseña son incorrectos.
- La mascota fue creada correctamente.
- No se pudo actualizar la mascota.
- La solicitud fue enviada correctamente.

No muestres trazas técnicas, SQL, secretos ni errores internos al usuario.

No trates una respuesta fallida como una operación exitosa.

Reutilizá componentes globales de Alert, Loading, Modal, Button y otros elementos existentes cuando corresponda.

---

# 20. DISEÑO Y RESPONSIVE

La interfaz debe ser:

- Clara.
- Ordenada.
- Consistente.
- Fácil de usar.
- Responsive.

Debe funcionar en computadora, tablet y celular.

Evitá duplicar estilos y estructuras visuales entre pantallas.

Reutilizá layouts, componentes y variables de diseño existentes.

La apariencia debe mantener equivalencia razonable con F-profesional, aunque las implementaciones CSS sean diferentes.

No introduzcas rediseños generales en una Issue funcional, salvo que el alcance lo solicite.

---

# 21. MÉTRICAS DEL PERFIL EXIGENTE DE LA CÁTEDRA

El documento `CRITERIOS-CALIDAD.md` define un análisis heurístico por regex y métricas. No compila ni ejecuta el código; sirve como criba para orientar la revisión docente y no constituye por sí solo una nota.

La rama evaluada es `main`.

El objetivo general del proyecto es alcanzar un índice de calidad de al menos **60/100**, cuando se mida en este repositorio.

Los criterios frontend relevantes son:

| Criterio | Meta |
|---|---:|
| Índice de calidad | ≥ 60/100 |
| Duplicación | ≤ 15 % |
| Secretos hardcodeados (SEC) | 0 |
| Separación en capas (CAPAS) | Sin `no_layering`; al menos 2 capas a partir de 150 LOC |
| HTTP dentro de componentes (HTTP) | 0 |
| Depuración olvidada (DBG) | 0 |
| Uso de `any` (ANY) | ≤ 2; evitar `any` y no alcanzar 3 usos en un archivo TS/TSX |
| Componentes grandes (BigC) | ≤ 1; señal desde 150 líneas en `.vue`, `.jsx`, `.tsx` o `.svelte` |
| Baja cohesión (Coh) | 0 clases/unidades señaladas |
| Complejidad alta (Compl) | ≤ 5 por cada 1.000 LOC; señal por función desde complejidad 6 |
| Tamaño (Tam) | ≤ 10 casos por cada 1.000 LOC; señales desde 30 líneas o más de 4 parámetros |
| Acoplamiento (Acop) | ≤ 2 por cada 1.000 LOC |
| Tests | ≥ 5 archivos de tests separados del código de producción |
| Vistas (15b) | ≥ 8 componentes/pantallas de UI |

No todos los criterios se aplican de igual manera a todos los archivos. Por ejemplo, SQL corresponde al backend y las señales BigC, HTTP y ANY se enfocan principalmente en frontend.

La evaluación detecta capas por nombres de carpetas. Para evitar `no_layering`, mantené carpetas convencionales y separación real entre vistas/componentes, servicios y estado/hooks.

## Cálculo del índice

El documento de la cátedra describe:

`indice = 100 * (1 - penalizacion)`

`penalizacion = peso / (peso + 25)`

Luego se aplican topes duros por duplicación:

- Duplicación ≥ 15 %: índice máximo 50.
- Duplicación ≥ 30 %: índice máximo 30.
- Duplicación ≥ 50 %: índice máximo 15.

No calcules ni inventes un índice propio como si fuera el resultado oficial. La confirmación debe salir del evaluador de la cátedra.

## Umbrales transversales

- Duplicación se mide desde 1 %.
- Complejidad alta: 6 o más en una función.
- Función/método largo: 30 o más líneas.
- Demasiados parámetros: más de 4.
- Cohesión aproximada: menos de 50 % cuando se cumplen las condiciones del detector.
- Acoplamiento aproximado: 8 o más dependencias externas.

Intentá mantener funciones por debajo de 30 líneas y con cuatro parámetros o menos cuando sea razonable. Evitá complejidad ciclomática alta mediante retornos tempranos, extracción coherente de funciones y menor anidamiento.

---

# 22. SECRETOS Y VARIABLES DE ENTORNO

Meta SEC: cero secretos hardcodeados.

No escribas en el frontend:

- `JWT_SECRET`.
- Contraseñas de PostgreSQL.
- Claves privadas.
- Tokens reales.
- API keys privadas.

Las variables `VITE_*` son visibles en el navegador y no son un lugar seguro para secretos.

La URL pública del backend sí puede configurarse con `VITE_API_URL`.

Mantené `.env` fuera del repositorio y utilizá `.env.example` con valores de ejemplo no sensibles.

No alteres ni inventes secretos para hacer funcionar la aplicación.

---

# 23. TESTS DEL FRONTEND

El perfil exigente establece un mínimo de **cinco archivos de tests**, separados del código de producción.

Creá pruebas útiles y ejecutables. No generes archivos vacíos para cumplir el recuento.

Antes de instalar herramientas:

1. Revisá si existe Vitest, Jest, React Testing Library u otra configuración.
2. Reutilizá el runner y las dependencias ya presentes.
3. Si falta una herramienta indispensable, incorporá solamente lo necesario.
4. Documentá los comandos disponibles.

Probá, según las funcionalidades implementadas:

- Renderizado de vistas.
- Formularios y validaciones.
- Interacciones principales.
- Navegación.
- Protección de rutas.
- Estado de autenticación.
- Consumo de servicios mediante mocks controlados.
- Estados de carga, error, vacío y éxito.
- Acciones permitidas según rol.

Las pruebas del frontend pueden simular la API cuando el objetivo sea verificar la interfaz y sus estados. Indicá claramente qué se probó con mocks y qué se verificó contra un backend real.

El informe disponible de B-profesional exigía 80 % de cobertura, pero no asumir que ese umbral está confirmado para F-personal sin revisar su propio informe. Si el evaluador del frontend también presenta un mínimo de cobertura, cumplir el umbral indicado allí. En cualquier caso, buscá una cobertura útil y medible sin crear tests artificiales.

---

# 24. CRITERIOS QUE NO DEBEN FORZARSE

La cátedra aclara que no evalúa directamente POO/SOLID pura, por ejemplo:

- Porcentaje de POO.
- Herencia.
- Interfaces por sí mismas.
- Encapsulación.
- `instanceof` o `type-switch`.
- Uso de `new` con clases concretas.
- Funciones fuera de clases.

En React, los componentes funcionales y Custom Hooks son formas normales de organizar el código. No agregues clases artificiales para intentar mejorar métricas de cohesión o acoplamiento.

No introduzcas patrones avanzados sin una necesidad concreta.

---

# 25. GIT, RAMAS Y COMMITS

Cada Issue debe trabajarse en su rama específica, siguiendo el procedimiento del profesor.

Ejemplo de rama:

`issue/12-listado-mascotas`

No hagas push directamente a `main`.

No hagas merge sin la aprobación requerida.

Flujo esperado:

Issue → rama → implementación → pruebas → commit → push de la rama → Pull Request → revisión/aprobación del profesor → merge.

Utilizá Conventional Commits.

Ejemplos:

```text
feat(auth): implementar login
feat(auth): proteger rutas privadas
feat(mascotas): implementar listado
feat(mascotas): implementar detalle
feat(mascotas): crear formulario
feat(mascotas): conectar creacion con API
feat(solicitudes): implementar listado
feat(historial): consultar historial clinico
fix(auth): corregir persistencia de sesion
test(mascotas): agregar pruebas del listado
refactor(api): centralizar cliente HTTP
chore(config): configurar variables de entorno
```

El mensaje debe describir los cambios reales de la Issue. No inventes commits ni alteres el historial para aparentar trabajo.

---

# 26. CÓMO TRABAJAR CON CADA ISSUE

Cuando se proporcione una Issue:

1. Leer esta documentación.
2. Leer `PROYECTO.md` si existe.
3. Leer la Issue y sus criterios de aceptación.
4. Inspeccionar el estado de Git y la rama actual.
5. Revisar el código y las funcionalidades existentes.
6. Buscar componentes, servicios, hooks y validaciones reutilizables.
7. Identificar el impacto sobre las métricas de calidad.
8. Implementar únicamente la Issue solicitada.
9. Mantener funcionando el trabajo anterior.
10. Ejecutar pruebas y verificaciones disponibles.
11. Revisar el diff y los archivos afectados.
12. Informar resultados reales y pendientes.

**No implementes Issues futuras**, aunque detectes dependencias o mejoras posibles. Informá el problema y dejá el trabajo futuro para su Issue correspondiente.

Si la Issue solicita una pantalla, dividí la interfaz en componentes pequeños cuando corresponda y extraé la lógica de estado/API a hooks y servicios.

Si solicita integración con la API, no agregues `fetch` o `axios` al componente. Utilizá la capa `services/`.

Si encontrás una respuesta backend distinta del contrato esperado, no inventes datos ni cambies el backend desde este repositorio.

---

# 27. FORMATO OBLIGATORIO DEL INFORME FINAL

Al terminar cada Issue, respondé con las siguientes secciones:

## 1. Archivos creados y modificados

Enumerá los archivos afectados, su responsabilidad y la cantidad de líneas de cada archivo nuevo.

## 2. Implementación realizada

Explicá qué se implementó y cómo funciona.

## 3. Reglas de calidad

Indicá si se cumplieron:

- Archivos pequeños.
- Cero duplicación.
- Llamadas HTTP aisladas en servicios.
- Separación de vistas, servicios y estado/hooks.
- Cero código de depuración.
- Ausencia de secretos hardcodeados.
- Consultas SQL parametrizadas si la tarea autorizada incluyó SQL.

Explicá las excepciones.

## 4. Equivalencia con Vue

Cuando corresponda, indicá si la funcionalidad conserva el flujo y contrato equivalente a F-profesional.

## 5. Pruebas ejecutadas

Enumerá únicamente las pruebas realmente ejecutadas y sus resultados.

## 6. Pruebas pendientes

Indicá qué no pudo probarse y por qué.

## 7. Impacto en métricas

Describí qué indicadores podrían mejorar o verse afectados. No inventes un índice ni asegures una mejora que el evaluador todavía no confirmó.

## 8. Problemas encontrados

Detallá errores, limitaciones o incompatibilidades.

## 9. Estado final

Indicá si la Issue está implementada, si necesita correcciones o si requiere pruebas adicionales.

## 10. Alcance

Confirmá que no se implementaron Issues futuras ni se modificaron áreas fuera del alcance.

---

# 28. REGLA FINAL

La prioridad es entregar un frontend funcional, seguro, mantenible, visualmente coherente y equivalente al frontend Vue.

Objetivos de calidad:

- Índice de calidad: al menos 60/100.
- Duplicación: máximo 15 %.
- Secretos hardcodeados: cero.
- Llamadas HTTP dentro de componentes: cero.
- Mensajes de depuración olvidados: cero.
- Componentes grandes: máximo uno detectado; procurar menos de 130 líneas en archivos nuevos.
- Uso de `any`: máximo dos según el criterio del evaluador; preferir tipado explícito cuando el proyecto use TypeScript.
- Separación reconocible entre vistas/componentes, servicios y estado/hooks.
- Al menos cinco archivos de tests útiles.
- Al menos ocho vistas/componentes de UI reales.
- Complejidad, tamaño de funciones y acoplamiento dentro de los umbrales del perfil exigente.

No alteres el código para engañar al analizador.

No inventes resultados.

No sobrescribas código correcto.

No agregues duplicación para terminar una Issue más rápido.

No implementes tareas futuras.

Preferí cambios pequeños, revisables, seguros y fáciles de explicar.

El resultado esperado es una aplicación React funcional, con separación de responsabilidades, integración real con el backend, pruebas útiles y calidad suficiente para defender el proyecto ante el profesor.
```
