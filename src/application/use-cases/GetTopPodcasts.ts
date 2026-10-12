import { PodcastRepository } from '../ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';

/**
 * @name GetTopPodcasts
 * @param podcastRepository tipo Repository, que será realmente la implementación de un tipo de Adaptador.
 * Es la clase que ejecutará el código para obtener los 100 podcast a partir de una cadena que se pase como parámetro. En el constructor recibe un tipo Repository, que será realmente mediante la implementación en un tipo de Adaptador.
 * También filtra el resultado por título y autor en el podcast que recibe.
 */
export class GetTopPodcasts {
  constructor(private podcastRepository: PodcastRepository) {}

  async execute(filterTerm: string = ''): Promise<Podcast[]> {
    const podcasts = await this.podcastRepository.getTopPodcasts();
    if (!filterTerm.trim()) return podcasts;

    const term = filterTerm.toLowerCase().trim();
    return podcasts.filter(
      p => p.title.toLowerCase().includes(term) || p.author.toLowerCase().includes(term)
    );
  }
}