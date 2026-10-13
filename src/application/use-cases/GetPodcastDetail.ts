import { PodcastRepository } from '../ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';

/**
 * @name GetPodcastDetail
 * @param podcastRepository tipo Repository, que será realmente la implementación de un tipo de Adaptador.
 * Es la clase que ejecutará el código para obtener el detalle de un pocast dado su ID. En el constructor recibe un tipo Repository, que será realmente mediante la implementación en un tipo de Adaptador.
 * La descripción del podcast no la devuelve el endpoint de detalle, solo el listado del top 100,
 * así que se completa aquí combinando ambas fuentes.
 */
export class GetPodcastDetail {
  constructor(private podcastRepository: PodcastRepository) {}

  async execute(podcastId: string): Promise<PodcastDetail> {
    if (!podcastId) throw new Error('El ID del podcast es obligatorio');

    const [detail, topPodcasts] = await Promise.all([
      this.podcastRepository.getPodcastDetail(podcastId),
      // La descripción es un dato secundario: si el top no está disponible
      // no debe impedir que se muestre el detalle.
      this.podcastRepository.getTopPodcasts().catch((): Podcast[] => []),
    ]);

    const summary = topPodcasts.find((podcast) => podcast.id === podcastId)?.summary ?? '';

    return { ...detail, podcast: { ...detail.podcast, summary } };
  }
}