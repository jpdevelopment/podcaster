import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';
import { mapApiToPodcasts, mapApiToPodcastDetail } from '../mappers/podcastMappers';
import { ITunesTopPodcastsResponseDTO } from '../dtos/iTunesPodcastDTO';
import { ITunesEpisodesResponseDTO } from '../dtos/iTunesEpisodeDTO';
import { PodcastFetchError, PodcastDetailError } from '../../domain/errors/Errors';

// Sobre con el que allorigins (/get) devuelve la respuesta del servicio de destino.
interface AllOriginsResponse {
  contents?: unknown;
}

/**
 * Clase Adaptador que implementa la interfaz del puerto del podcast y sus métododos.
 * Será inyectada como dependencia a través de las clases de casos de uso.
 */
export class ApiPodcastAdapter implements PodcastRepository {
  private readonly CORS_PROXY = 'https://api.allorigins.win/get?url=';

  /**
   * Helper privado para realizar el fetch a través del proxy CORS y extraer el JSON interno
   * @param itunesPath ruta de iTunes (con query string) a consultar
   * @returns el JSON de iTunes tipado como T, o null si la respuesta no es válida
   */
  private async fetchJson<T>(itunesPath: string): Promise<T | null> {
    const targetUrl = `https://itunes.apple.com${itunesPath}`;
    const url = `${this.CORS_PROXY}${encodeURIComponent(targetUrl)}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data: AllOriginsResponse = await response.json();
    if (!data?.contents) return null;

    // AllOrigins devuelve el contenido como string o como objeto JSON parseado
    const parsed = typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
    return parsed as T;
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

      if (!rawJson) throw new PodcastFetchError();

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
        `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`,
      );

      if (!rawJson) throw new PodcastDetailError(podcastId);

      return mapApiToPodcastDetail(rawJson, podcastId);
    } catch (error) {
      console.error(error);
      throw new PodcastDetailError(podcastId);
    }
  }
}
