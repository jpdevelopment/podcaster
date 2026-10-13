import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';
import { mapApiToPodcasts, mapApiToPodcastDetail } from '../mappers/podcastMappers';
import { ITunesTopPodcastsResponseDTO } from '../dtos/iTunesPodcastDTO';
import { ITunesEpisodesResponseDTO } from '../dtos/iTunesEpisodeDTO';
import { PodcastFetchError, PodcastDetailError } from '../../domain/errors/Errors';

/**
 * Clase Adaptador que implementa la interfaz del puerto del podcast y sus métododos.
 * Será inyectada como dependencia a través de las clases de casos de uso.
 * Consulta directamente la API de iTunes: sus endpoints envían cabeceras CORS, por lo que no hace falta proxy.
 */
export class ApiPodcastAdapter implements PodcastRepository {
  private readonly BASE_URL = 'https://itunes.apple.com';

  /**
   * Helper privado para realizar la petición y devolver el JSON tipado.
   * @param path ruta de iTunes (con query string) a consultar
   * @throws Error con el código HTTP si la respuesta no es correcta
   */
  private async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${path}`);
    if (!response.ok) throw new Error(`Respuesta HTTP ${response.status} al consultar ${path}`);
    return (await response.json()) as T;
  }

  /**
   * Obtiene los 100 primeros podcasts del top formateados con interfaces del dominio.
   * @returns array con los 100 primeros podcasts del top con interfaz Podcast, envuelto en una Promesa.
   */
  async getTopPodcasts(): Promise<Podcast[]> {
    try {
      const rawJson = await this.fetchJson<ITunesTopPodcastsResponseDTO>(
        '/us/rss/toppodcasts/limit=100/genre=1310/json',
      );
      return mapApiToPodcasts(rawJson);
    } catch (error) {
      console.error(error);
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
      const rawJson = await this.fetchJson<ITunesEpisodesResponseDTO>(
        `/lookup?id=${encodeURIComponent(podcastId)}&media=podcast&entity=podcastEpisode&limit=20`,
      );
      return mapApiToPodcastDetail(rawJson, podcastId);
    } catch (error) {
      console.error(error);
      throw new PodcastDetailError(podcastId);
    }
  }
}