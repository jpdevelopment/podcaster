# Podcaster

Mini aplicación web (SPA) para escuchar podcasts musicales. React, TypeScript y Webpack.

## Arquitectura y Decisiones de Diseño

### Arquitectura Hexagonal (Ports & Adapters)
Se ha implementado una arquitectura hexagonal estricta dividida en capas desacopladas:

El proyecto está desvinclado deliberadamente de librerías de terceros en su núcleo de negocio para garantizar la escalabilidad, la mantenibilidad y un aislamiento total de la infraestructura (como la API de iTunes o el enrutamiento).

src/
├── domain/               # Entidades de negocio puras, objetos de valor y errores de dominio
├── application/          # Casos de uso y Puertos de salida (interfaces de repositorios)
├── infrastructure/       # Adaptadores externos (clientes HTTP, API de iTunes, Mappers, DTOs)
├── presentation/         # Componentes UI de React, Vistas (MainView, PodcastDetailView) y estilos BEM
├── context/              # Gestión de estado global desacoplada mediante React Context API
└── composition-root/     # Contenedor centralizado de Inyección de Dependencias

Dominio Puro: Las entidades (Podcast, PodcastDetail, Episode) no conocen React ni dependencias externas.

Inyección de Dependencias: Gestionada a través de un Composition Root, facilitando la sustitución de adaptadores y el aislamiento en los tests.

Mapeo de Datos (Mappers): Transformación robusta de los DTOs externos (estructuras complejas de iTunes) a modelos limpios de dominio.

### Características principales

- Visualización fluida del ranking de podcasts con búsqueda reactiva optimizada.

- Vista Detallada y Reproductor de Episodios: Navegación paramétrica (react-router-dom) para consultar la sinopsis detallada y el listado de episodios.

- Manejo de Estados Límite (Edge Cases): Control centralizado de estados de carga (isLoading) y gestión de errores de red o dominio (PodcastFetchError, PodcastDetailError).

- Estilos Modulares: Metodología BEM (Block Element Modifier) para una estructuración limpia y escalable del CSS.

### Testing Suite

La aplicación cuenta con una suite de pruebas rigurosa construida con Jest, ts-jest, jsdom y React Testing Library:

- Pruebas de Mapeo (podcastMappers.test.ts): Validación unitaria de que la capa de infraestructura traduce correctamente el JSON crudo de la API externa a las entidades de dominio.

- Pruebas de Adaptadores de Red (ApiPodcastAdapter.test.ts): Mockeo del cliente HTTP (fetch) para asegurar que el adaptador maneja correctamente respuestas exitosas, códigos de error HTTP y fallos de red simulados lanzando excepciones de dominio.

- Pruebas de Vistas e Interfaz (MainView.test.tsx, PodcastDetailView.test.tsx):

- Verificación de renderizado de componentes y parámetros de ruta mediante MemoryRouter.

- Pruebas de interacción real del usuario con @testing-library/user-event (filtrado dinámico).

- Comprobación de resiliencia ante estados de carga y mensajes de error.

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