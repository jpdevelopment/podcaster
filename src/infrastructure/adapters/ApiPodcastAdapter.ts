import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';
import { mapApiToPodcasts, mapApiToPodcastDetail } from '../mappers/podcastMappers';
import { PodcastFetchError, PodcastDetailError } from '../../domain/errors/Errors';

/**
 * Clase Adaptador que implementa la interfaz del puerto del podcast y sus métododos.
 * Será inyectada como dependencia a través de las clases de casos de uso.
 */
export class ApiPodcastAdapter implements PodcastRepository {
  //private CORS_PROXY = 'https://api.allorigins.win/get?url=';
  private BASE_URL = '/itunes';
  /**
   * Obtiene los 100 primeros podcasts del top formateados con interfaces del dominio.
   * @returns array con los 100 primeros podcasts del top con interfaz Podcast, envuelto en una Promesa.
   */
  async getTopPodcasts(): Promise<Podcast[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/us/rss/toppodcasts/limit=100/genre=1310/json`);

      if (!response.ok) throw new PodcastFetchError();

      const rawJson = await response.json();
      return mapApiToPodcasts(rawJson);
    } catch (error) {
      console.log(error);
      throw new PodcastFetchError();
    }
  }

  /**
   * Obtiene los detalles de un podcast concreto a través de su ID.
   * @param podcastId Id del podcast para la petición
   * @returns Detalles del podcast con interfaz PodcastDetail, envuelto en una Promesa.
   */
  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`,
      );

      if (!response.ok) throw new PodcastDetailError(podcastId);

      const rawJson = await response.json();
      return mapApiToPodcastDetail(rawJson, podcastId);
    } catch (error) {
      console.log(error);
      throw new PodcastDetailError(podcastId);
    }
  }
}
