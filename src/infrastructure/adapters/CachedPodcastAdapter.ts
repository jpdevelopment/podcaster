import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

/**
 * Aplicación del Patrón Decorador para gestionar la estrategia de caché local sin modificar la lógica
 */
export class CachedPodcastAdapter implements PodcastRepository {
  private DAY_TO_MS = 24 * 60 * 60 * 1000;

  /**
   * @param decoratedAdapter Adaptador al que se le añadirá este decorador para acceder a la gestión de caché local
   */
  constructor(private decoratedAdapter: PodcastRepository) {}

  /**
   * Función que comprueba en el localStorage previamente y obtiene el resultado de top 100 Podcasts
   * @returns Promesa con Array de Podcast
   */
  async getTopPodcasts(): Promise<Podcast[]> {
    const key = 'podcaster_top_100';
    const cached = this.getCache<Podcast[]>(key);
    if (cached) return cached;

    const data = await this.decoratedAdapter.getTopPodcasts();
    this.setCache(key, data);
    return data;
  }

  /**
   * Función que comprueba en el localStorage previamente y obtiene el resultado de top 100 Podcasts
   * @returns Promesa con Detalles de Podcast
   * @param podcastId string con Id de Podcast
   */
  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const key = `podcaster_detail_${podcastId}`;
    const cached = this.getCache<PodcastDetail>(key);
    if (cached) return cached;

    const data = await this.decoratedAdapter.getPodcastDetail(podcastId);
    this.setCache(key, data);
    return data;
  }

  // Métodos para la gestión de caché local

  /**
   * Obtiene el valor de localStorage a través de la clave proporcionada
   * @param key string de la clave a obtener
   * @returns Objeto de tipo proporcionado o null en caso de fallo
   */
  private getCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed: CacheItem<T> = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > this.DAY_TO_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  /**
   * Almacena el valor en localStorage con una clave proporcionada
   * @param key string de la clave a guardar
   * @param data objeto a guardar del tipo T
   */
  private setCache<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {
      console.warn(e);
    }
  }
}
