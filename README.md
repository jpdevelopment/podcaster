# Podcaster

Mini aplicación web (SPA) para escuchar podcasts musicales. React, TypeScript y Webpack.

## Arquitectura y Decisiones de Diseño

### Arquitectura Hexagonal (Ports & Adapters)

Se ha implementado una arquitectura hexagonal estricta dividida en capas desacopladas:

El proyecto está desvinclado deliberadamente de librerías de terceros en su núcleo de negocio para garantizar la escalabilidad, la mantenibilidad y un aislamiento total de la infraestructura (como la API de iTunes o el enrutamiento).

src/
├── domain/ # Entidades de negocio puras, objetos de valor y errores de dominio
├── application/ # Casos de uso y Puertos de salida (interfaces de repositorios)
├── infrastructure/ # Adaptadores externos (clientes HTTP, API de iTunes, Mappers, DTOs)
├── presentation/ # Componentes UI de React, Vistas (MainView, PodcastDetailView) y estilos BEM
├── context/ # Gestión de estado global desacoplada mediante React Context API
└── composition-root/ # Contenedor centralizado de Inyección de Dependencias

Dominio Puro: Las entidades (Podcast, PodcastDetail, Episode) no conocen React ni dependencias externas.

Inyección de Dependencias: Gestionada a través de un Composition Root, facilitando la sustitución de adaptadores y el aislamiento en los tests.

Mapeo de Datos (Mappers): Transformación robusta de los DTOs externos (estructuras complejas de iTunes) a modelos limpios de dominio.

### Características principales

- Visualización fluida del ranking de podcasts con búsqueda reactiva optimizada.

- Vista Detallada y Reproductor de Episodios: Navegación paramétrica (react-router-dom) para consultar la sinopsis detallada y el listado de episodios.

- Manejo de Estados Límite (Edge Cases): Control centralizado de estados de carga (isLoading) y gestión de errores de red o dominio (PodcastFetchError, PodcastDetailError).

- Estilos Modulares: Metodología BEM (Block Element Modifier) para una estructuración limpia y escalable del CSS.

## Estrategia de caché

`CachedPodcastAdapter` es un **decorador** del puerto: implementa la misma interfaz que el adaptador real y lo envuelve, de modo que el resto de la aplicación no sabe que existe.

- **Dónde**: `localStorage`. Cada recurso tiene su clave (`podcaster_top_100`, `podcaster_detail_<id>`) y guarda la fecha de escritura.
- **Caducidad (TTL)**: 24 horas. Pasado ese tiempo se vuelve a pedir a la API y se reescribe la entrada.
- **Peticiones en vuelo**: si dos consumidores piden lo mismo mientras la petición sigue en curso, comparten la misma promesa. Evita peticiones duplicadas, por ejemplo por el doble efecto de `StrictMode` en desarrollo. Si la petición falla no queda cacheada y se puede reintentar.
- **Tolerancia a fallos**: una entrada corrupta o un `localStorage` no disponible o lleno no rompen la app; simplemente se consulta la API.

## Decisiones técnicas

- **Llamadas directas a iTunes**: la API permite CORS desde el navegador, así que no hay backend ni proxy. Se probó un proxy CORS público (allorigins), pero tenía caídas frecuentes (errores 520/522 de Cloudflare) y se descartó.
- **Descripción del podcast**: el endpoint de detalle (`lookup`) no la incluye; sí la trae el top 100. `GetPodcastDetail` combina ambas fuentes (la lista sale de la caché) y, si el top no está disponible, el detalle se muestra igualmente sin descripción.
- **Número de episodios**: se muestra el total real (`trackCount`) y no los 20 episodios cargados.
- **Seguridad**: las descripciones de episodios llegan como HTML de terceros. Se sanean con DOMPurify en un único componente (`SanitizedHtml`) antes de usar `dangerouslySetInnerHTML`.
- **Tipado**: TypeScript en modo `strict`, con `noUncheckedIndexedAccess`.
- **Estilos**: CSS propio por componente con nomenclatura BEM, sin frameworks ni librerías de UI.

### Testing Suite

La aplicación cuenta con una suite de pruebas rigurosa construida con Jest, ts-jest, jsdom y React Testing Library:

- **Mappers**: transformación de DTOs a dominio (duraciones, fechas, valores por defecto, `episodeCount`).
- **Adaptadores**: `ApiPodcastAdapter` con `fetch` mockeado (éxito, error HTTP y fallo de red) y `CachedPodcastAdapter` (fallo y acierto de caché, caducidad con `Date.now` controlado, entrada corrupta, fallo de `localStorage`, peticiones compartidas, reintento tras error).
- **Casos de uso**: con repositorios falsos.
- **Hooks y componentes**: `usePodcastDetail` (incluida una respuesta tardía de un id anterior), cabecera, barra lateral, saneado de HTML y las tres vistas, con `MemoryRouter` e interacción real del usuario.

### Calidad de código

- ESLint (configuración flat, `typescript-eslint`, reglas de React y de hooks) con `--max-warnings 0`.
- Prettier para el formato (`format` y `format:check`).
- `npm run typecheck` para comprobar los tipos sin generar archivos.
- Commits pequeños y por funcionalidad, con tags por hito.

### Stack Tecnológico

Core: React 19, TypeScript (Tipado estricto)
Enrutamiento: React Router DOM
Testing: Jest, ts-jest, React Testing Library, @testing-library/user-event
Estilos: CSS Modules / Metodología BEM

## Guía de Inicio Rápido

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

- git clone [https://github.com/jpdevelopment/podcaster.git](https://github.com/jpdevelopment/podcaster.git)

- cd podcaster

- npm install

## Ejecución

- Desarrollo (assets sin minificar): `npm run start`
- Producción (assets minificados): `npm run build && npm run preview`
- Otros scripts: `npm test`, `npm run test:coverage`, `npm run lint`, `npm run typecheck`,
  `npm run format` y `npm run format:check`.
