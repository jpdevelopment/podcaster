import { PodcastRepository } from '../ports/PodcastRepository';
import { PodcastDetail } from '../../domain/Episode';

/**
 * @name GetPodcastDetailUseCase
 * @param podcastRepository tipo Repository, que será realmente la implementación de un tipo de Adaptador.
 * Es la clase que ejecutará el código para obtener el detalle de un pocast dado su ID. En el constructor recibe un tipo Repository, que será realmente mediante la implementación en un tipo de Adaptador.
 */
export class GetPodcastDetailUseCase {
  constructor(private podcastRepository: PodcastRepository) {}

  async execute(podcastId: string): Promise<PodcastDetail> {
    if (!podcastId) throw new Error('El ID del podcast es obligatorio');
    return await this.podcastRepository.getPodcastDetail(podcastId);
  }
}