import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';

// Interfaz del puerto para comunicarse con los adaptadores. Contrato sobre qué hace este puerto de la aplicación y qué debe de reflejar cada adaptador posteriormente. 
export interface PodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>;
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>;
}