import { ApiPodcastAdapter } from '../infrastructure/adapters/ApiPodcastAdapter';
import { CachedPodcastAdapter } from '../infrastructure/adapters/CachedPodcastAdapter';
import { GetTopPodcasts } from '../application/use-cases/GetTopPodcasts';
import { GetPodcastDetail } from '../application/use-cases/GetPodcastDetail';

// Este archivo centraliza la creación de los adaptadores y los casos de uso de forma limpia y desacoplada (Composition Root).
// Se usa el patrón Singleton, para usar siempre las mismas instancias. Inicio de la arquitectura hexagonal.

const apiAdapter = new ApiPodcastAdapter();
const cachedAdapter = new CachedPodcastAdapter(apiAdapter);

export const getTopPodcasts = new GetTopPodcasts(cachedAdapter);
export const getPodcastDetail = new GetPodcastDetail(cachedAdapter);