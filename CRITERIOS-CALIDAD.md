# CRITERIOS-CALIDAD.md

## Programación III — Perfil exigente

Este documento adapta al repositorio **F-personal (React + Vite)** los criterios de calidad suministrados por la cátedra. El análisis de la cátedra es heurístico (regex + métricas): no compila ni ejecuta el código. Sirve como criba para priorizar la revisión docente; no es una nota automática.

La evaluación se realiza sobre la rama `main`. Un repositorio sin código en `main` comienza con índice 0. No editar manualmente los informes de evaluación generados automáticamente.

> Los criterios y umbrales generales se mantienen. Los criterios exclusivos de backend se identifican como no aplicables directamente a F-personal; los criterios frontend son los relevantes para este repositorio.

---

# 1. Objetivos generales

| Indicador | Meta |
|---|---:|
| Índice de calidad | ≥ 60/100 |
| Duplicación | ≤ 15 % |
| Secretos hardcodeados (SEC) | 0 |
| Consultas SQL por concatenación (SQL) | 0 en los repositorios backend; el frontend no debe construir SQL |
| Separación en capas (CAPAS) | Sin `no_layering`; al menos 2 capas a partir de 150 LOC |
| HTTP dentro de componentes (HTTP) | 0 |
| Depuración olvidada (DBG) | 0 |
| Uso masivo de `any` (ANY) | ≤ 2 según el umbral del evaluador |
| Componentes grandes (BigC) | ≤ 1; estándar interno: mantenerlos por debajo de 130 líneas cuando sea razonable |
| Baja cohesión (Coh) | 0 clases detectadas |
| Complejidad alta (Compl) | ≤ 5 cada 1.000 LOC |
| Funciones largas o con muchos parámetros (Tam) | ≤ 10 cada 1.000 LOC |
| Acoplamiento alto (Acop) | ≤ 2 cada 1.000 LOC |
| Archivos de tests | ≥ 5 |
| Vistas/componentes de pantalla (frontend) | ≥ 8 |

El criterio de endpoints HTTP (mínimo 10) corresponde a backend y no se debe cumplir artificialmente desde F-personal.

---

# 2. Los 15 criterios de la cátedra

## 1. Índice de calidad (`indice`)

- **Qué mide:** puntaje global de 0 a 100 que combina señales y métricas del análisis.
- **Meta:** al menos 60/100.
- **Cómo mejorar:** reducir duplicación y señales de mayor peso; evitar secretos, SQL inseguro y falta de capas.

La fórmula orientativa del documento de cátedra es:

```text
indice = 100 * (1 - penalizacion)
penalizacion = peso / (peso + 25)
```

Luego se aplican topes duros. No reconstruir ni asumir el índice final a partir de una sola modificación: ejecutar el evaluador real.

## 2. Duplicación (`duplicacion`)

- **Qué mide:** porcentaje de líneas dentro de bloques de código repetidos.
- **Meta:** máximo 15 %.
- **Cómo mejorar:** extraer componentes, helpers, hooks y servicios reutilizables.

Topes duros:

- Duplicación ≥ 15 %: índice máximo 50.
- Duplicación ≥ 30 %: índice máximo 30.
- Duplicación ≥ 50 %: índice máximo 15.

La medición comienza desde 1 %.

En F-personal se debe evitar copiar y pegar componentes, formularios, validaciones, llamadas HTTP y lógica de estado.

## 3. Secretos hardcodeados (`SEC`)

- **Qué mide:** credenciales, tokens, API keys y claves privadas escritas en el código.
- **Meta:** cero secretos.
- **Cómo mejorar:** utilizar variables de entorno y mantener `.env` fuera del repositorio.

En Vite, las variables `VITE_*` quedan expuestas al código del navegador. Nunca colocar contraseñas de base de datos, secretos JWT privados ni claves privadas en variables `VITE_*`.

La URL pública de la API puede configurarse con `VITE_API_URL`; las credenciales y secretos del backend deben permanecer en el servidor.

Patrones que el evaluador puede detectar incluyen `password`, `api_key`, `token`, `secret`, claves PEM y patrones de claves reales. Los valores provenientes de mecanismos de entorno se tratan de manera diferente según el analizador.

## 4. SQL por concatenación (`SQL`)

- **Qué mide:** consultas SQL construidas concatenando o interpolando valores.
- **Meta:** cero consultas inseguras.

Este criterio aplica directamente a los backends. F-personal no debe conectarse a PostgreSQL ni construir SQL. Todas las operaciones de datos deben realizarse a través de la API.

No incluir credenciales ni lógica de acceso directo a la base en el frontend.

## 5. Separación en capas (`CAPAS`)

- **Qué mide:** separación en capas reconocibles.
- **Meta:** no tener la señal `no_layering`; al menos dos capas reconocidas a partir de 150 LOC.

Para frontend, el evaluador reconoce estas capas:

- **Vistas/UI:** `components/`, `views/`, `pages/`, `layouts/`, `ui/`.
- **Servicios:** `services/`, `api/`, `clients/`, `http/`.
- **Estado:** `store/`, `state/`, `context/`, `redux/`, `pinia/`, `hooks/`, `composables/`.

La estructura debe reflejar responsabilidades reales. No crear carpetas vacías solamente para satisfacer el detector.

## 6. HTTP dentro de componentes (`HTTP`)

- **Qué mide:** llamadas `fetch` o `axios` dentro de componentes visuales.
- **Meta:** cero llamadas HTTP dentro de componentes.
- **Cómo mejorar:** mover las operaciones de red a `src/services/` o a la capa API existente. Los hooks pueden coordinar estado y consumir esos servicios.

Los componentes deben encargarse de la presentación y de interacciones de UI, no de implementar directamente el acceso HTTP.

## 7. Depuración olvidada (`DBG`)

- **Qué mide:** salidas de depuración olvidadas.
- **Meta:** cero.

El detector puede marcar:

- `console.log`
- `console.debug`
- `console.info`
- `debugger;`
- `print(`
- `pprint(`
- `pdb.set_trace`
- `binding.pry`
- `System.out.print`

No dejar código temporal de depuración en el código de producción. Los tests también deben mantenerse limpios y sin impresiones innecesarias.

## 8. Uso de `any` (`ANY`)

- **Qué mide:** uso débil de `any` en TypeScript.
- **Meta:** máximo dos según el perfil exigente.
- **Regla del detector:** marca tres o más usos en un mismo archivo `.ts` o `.tsx`.
- **Cómo mejorar:** definir `interface` o `type` y mantener `strict` en `tsconfig` cuando el proyecto usa TypeScript.

Si F-personal utiliza JavaScript, este indicador puede no aplicar directamente. No migrar todo el proyecto a TypeScript solo para cambiar la métrica; respetar la tecnología existente y justificar una migración por separado.

## 9. Componente grande (`BigC`)

- **Qué mide:** componentes `.vue`, `.jsx`, `.tsx` o `.svelte` de 150 líneas o más.
- **Meta:** máximo un componente detectado.
- **Estándar interno más estricto:** archivos nuevos de UI por debajo de 130 líneas cuando sea razonable.
- **Cómo mejorar:** separar subcomponentes dentro de `components/` y extraer estado/lógica a hooks.

No dividir artificialmente un componente si eso vuelve la solución más difícil de entender.

## 10. Cohesión (`Coh`)

- **Qué mide:** clases cuyos métodos y campos tienen poca relación entre sí.
- **Meta:** cero clases detectadas con baja cohesión.
- **Umbral transversal:** LCOM aproximado menor al 50 %, con al menos cuatro métodos y tres campos, dispara la señal según el documento de la cátedra.

No introducir clases artificiales para optimizar métricas. Mantener cada unidad enfocada en una responsabilidad.

## 11. Complejidad (`Compl`)

- **Qué mide:** complejidad ciclomática alta.
- **Meta:** máximo cinco casos de complejidad alta cada 1.000 LOC.
- **Umbral transversal:** complejidad de seis o más en una función/método.
- **Cómo mejorar:** retornos tempranos, extracción de funciones coherentes y menos anidamiento profundo.

No fragmentar código de manera artificial.

## 12. Tamaño de métodos y funciones (`Tam`)

- **Qué mide:** funciones/métodos largos o con demasiados parámetros.
- **Meta:** máximo diez casos cada 1.000 LOC.
- **Umbrales transversales:** funciones de 30 líneas o más y más de cuatro parámetros.
- **Cómo mejorar:** dividir responsabilidades y agrupar parámetros relacionados en objetos cuando tenga sentido.

Como estándar interno, preferir funciones de menos de 30 líneas y cuatro parámetros o menos cuando sea razonable.

## 13. Acoplamiento (`Acop`)

- **Qué mide:** dependencias externas excesivas entre unidades.
- **Meta:** máximo dos unidades con acoplamiento alto cada 1.000 LOC.
- **Umbral transversal:** CBO aproximado de ocho o más.
- **Cómo mejorar:** depender de contratos claros, aislar el acceso a datos y evitar dependencias innecesarias.

El análisis puede ser ruidoso en JavaScript/TypeScript. No agregar abstracciones artificiales para manipular el resultado.

## 14. Tests (`TESTS`)

- **Qué mide:** existencia de archivos de prueba separados del código de producción.
- **Meta:** al menos cinco archivos de tests.
- **Ubicaciones reconocidas:** `tests/`, `test_*.py`, `*.spec.ts` y patrones equivalentes.

En F-personal, los tests deben cubrir componentes, hooks, servicios, rutas/flujo de usuario y validaciones según la arquitectura real.

No crear archivos vacíos ni tests artificiales para alcanzar el número. Deben contener pruebas útiles y ejecutables.

**Objetivo adicional de cobertura:** el informe de evaluación de B-profesional pidió cobertura de líneas medible de al menos 80 %. Para F-personal se adopta 80 % como objetivo interno de calidad cuando la herramienta de evaluación y el runner frontend permitan medirlo. Confirmar el umbral aplicable en el reporte específico de F-personal antes de presentarlo como requisito formal del frontend.

## 15a. Endpoints backend (`EP`)

- Meta: al menos diez endpoints reales.
- **No aplica directamente a F-personal**, porque es frontend. Los endpoints pertenecen a los repositorios backend.

## 15b. Vistas frontend (`VISTAS`)

- **Qué mide:** cantidad de vistas/componentes de UI.
- **Meta:** al menos ocho vistas/componentes de pantalla reales.
- **Cómo mejorar:** implementar las pantallas funcionales previstas por el proyecto.

No crear vistas vacías o artificiales para aumentar el conteo.

---

# 3. Señales de servicio y pesos aproximados

El perfil exigente utiliza estos pesos aproximados:

| Señal | Peso aproximado |
|---|---:|
| Secreto hardcodeado | 20 |
| SQL por concatenación | 15 |
| Falta de capas | 10 |
| Baja cohesión | 8 |
| Alto acoplamiento | 8 |
| Componente grande | 6 |
| Método largo | 5 |
| Complejidad alta | 5 |
| Función larga | 4 |
| Parámetros de más | 4 |
| HTTP dentro de componente | 3 |
| `any` | 2 |
| Depuración olvidada | 2 |

El índice utiliza los pesos y una penalización, y luego aplica topes duros por duplicación. No calcular a mano un índice final ni darlo por confirmado sin ejecutar el evaluador.

---

# 4. Advertencias del evaluador

- SEC y SQL pueden producir falsos positivos: revisar archivo y línea del informe.
- DBG puede marcar salidas de scripts de prueba.
- La detección de capas se basa en nombres de carpetas.
- Cohesión y acoplamiento son métricas aproximadas y pueden ser ruidosas en JS/TS.
- La evaluación no compila ni ejecuta el código.
- El informe no es una nota automática.

Cuando aparezca una señal, investigar antes de cambiar código. Diferenciar falsos positivos de defectos reales y documentar el motivo.

---

# 5. Cinco reglas de calidad adicionales del proyecto

Estas reglas fueron establecidas para todas las tareas de código desde la Issue #21.

## 5.1 Componentes y archivos pequeños

- Cada archivo nuevo debe tener menos de 130 líneas cuando sea razonable.
- Dividir nuevas pantallas/UI en subcomponentes reutilizables dentro de `components/`.
- Extraer estado y lógica reutilizable a hooks dentro de `src/hooks/` o estructura equivalente.
- No ampliar archivos grandes sin necesidad.
- La división debe ser coherente y no artificial.

## 5.2 Cero duplicación

- Revisar componentes, formularios, validadores, helpers y hooks existentes antes de crear otros.
- Reutilizar componentes globales y utilidades.
- No copiar y pegar lógica entre vistas.
- Extraer lógica compartida a un único lugar cuando tenga sentido.

## 5.3 SQL seguro

- F-personal no debe ejecutar SQL ni conectarse directamente a PostgreSQL.
- Toda persistencia debe realizarse mediante la API.
- El requisito de SQL parametrizado aplica a los backends; el frontend debe limitarse a consumir servicios HTTP.
- No incluir consultas, credenciales ni cadenas de conexión de la base de datos en el cliente.

## 5.4 Llamadas HTTP aisladas

- No utilizar `fetch` ni `axios` directamente dentro de componentes de UI.
- Utilizar `src/services/` o la capa API existente.
- Los hooks pueden invocar servicios y administrar el estado, pero no deben provocar duplicación de acceso HTTP.
- Centralizar base URL, headers, token y manejo común de respuestas cuando corresponda.

## 5.5 Cero depuración

- No agregar `console.log`, `print`, `debugger` ni salidas temporales.
- No dejar código experimental.
- Utilizar manejo de errores adecuado.
- No exponer tokens ni información sensible en mensajes o interfaz.

---

# 6. Criterios específicos para F-personal

La calidad del frontend debe comprobarse considerando:

1. Separación real entre vistas/componentes, servicios y estado/hooks.
2. Cero llamadas `fetch`/`axios` dentro de componentes.
3. Componentes pequeños, preferentemente menores a 130 líneas.
4. Al menos ocho vistas/componentes de pantalla funcionales.
5. Al menos cinco archivos de tests útiles y separados del código de producción.
6. Duplicación no superior al 15 %.
7. Cero secretos hardcodeados.
8. Cero código de depuración.
9. Si se usa TypeScript, evitar `any` y mantener el tipado estricto cuando sea viable.
10. Funciones cortas y con responsabilidades claras.
11. Diseño responsive y feedback visual coherente.
12. Equivalencia funcional con F-profesional (Vue).

No trasladar métricas exclusivas de backend al frontend. En particular, F-personal no necesita implementar endpoints HTTP propios ni consultas SQL.

---

# 7. Checklist antes de entregar

- [ ] No hay secretos en el código.
- [ ] No hay `console.log`, `print`, `debugger` ni salidas de depuración olvidadas.
- [ ] No hay llamadas `fetch`/`axios` dentro de componentes.
- [ ] El acceso HTTP está centralizado en servicios.
- [ ] Hay separación reconocible entre componentes/vistas, servicios y estado/hooks.
- [ ] Los archivos nuevos son menores a 130 líneas cuando es razonable.
- [ ] No se duplicó lógica existente.
- [ ] No hay uso innecesario de `any`.
- [ ] No hay componentes de UI de 150 líneas o más, salvo excepción justificada.
- [ ] Funciones y métodos son cortos y tienen pocos parámetros cuando es razonable.
- [ ] Duplicación ≤ 15 %.
- [ ] Hay al menos cinco archivos de tests útiles.
- [ ] La cobertura se mide y se informa; objetivo interno ≥ 80 % si el evaluador aplicable lo permite.
- [ ] Hay al menos ocho vistas/componentes de pantalla reales.
- [ ] La aplicación consume la API real y maneja carga, errores y éxito.
- [ ] Se mantiene la equivalencia funcional con Vue.
- [ ] Los cambios están en la rama de trabajo y se integran mediante PR aprobado.

---

# 8. Cómo usar este documento

Antes de cada Issue, leer este archivo junto con `PROYECTO.md` y `.github/copilot-instructions.md`.

Después de cada entrega, volver a medir las métricas con las herramientas de la cátedra sobre la rama `main`. No asumir que una métrica mejoró sin ejecutar el análisis.

Este documento define objetivos y umbrales; no reemplaza el contrato de API, la descripción de cada Issue ni la aprobación del profesor.
