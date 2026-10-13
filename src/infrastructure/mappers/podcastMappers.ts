import { Podcast } from '../../domain/Podcast';
import { Episode, PodcastDetail } from '../../domain/Episode';
import { ITunesTopPodcastsResponseDTO, ITunesEntryDTO } from '../dtos/iTunesPodcastDTO';
import { ITunesEpisodesDTO, ITunesEpisodesResponseDTO } from '../dtos/iTunesEpisodeDTO';

// Funciones para el mapeo de DTOs de la API a interfaces del dominio

/**
 * Función que devuelve el array de Podcasts con interfaz del dominio a partir del DTO del JSON de la petición del top 100
 * @param rawJson Json en bruto de la petición
 * @returns array de Podcast
 */
export function mapApiToPodcasts(rawJson: ITunesTopPodcastsResponseDTO): Podcast[] {
  const entries: ITunesEntryDTO[] = rawJson?.feed?.entry || [];
  return entries.map((entry): Podcast => ({
    id: entry.id.attributes['im:id'],
    title: entry['im:name'].label,
    author: entry['im:artist'].label,
    image: entry['im:image'][2]?.label || entry['im:image'][0]?.label || '',
    summary: entry.summary?.label || 'Sin descripción disponible',
  }));
}

/**
 * Función que devuelve el detalle de un Podcast mapeado con la interfaz de dominio a partir del DTO del JSON de la petición de detalle
 * @param rawJson Json en bruto de la petición
 * @param podcastId string con el id del podcast
 * @returns detalle del podcast formateado en objeto de dominio
 */
export function mapApiToPodcastDetail(
  rawJson: ITunesEpisodesResponseDTO,
  podcastId: string,
): PodcastDetail {
  const results: ITunesEpisodesDTO[] = rawJson?.results || [];
  const podcastInfo = results.find((r) => r.wrapperType === 'track');
  const rawEpisodes = results.filter((r) => r.wrapperType === 'podcastEpisode');

  const podcast: Podcast = {
    id: podcastId,
    title: podcastInfo?.collectionName || 'Podcast',
    author: podcastInfo?.artistName || 'Autor desconocido',
    image: podcastInfo?.artworkUrl600 || podcastInfo?.artworkUrl100 || '',
    summary: '',
  };

  const episodes: Episode[] = rawEpisodes.map((ep): Episode => {
    const durationMs = ep.trackTimeMillis || 0;
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60);

    const formattedDuration =
      hours > 0
        ? `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${minutes}:${String(seconds).padStart(2, '0')}`;

    const date = ep.releaseDate ? new Date(ep.releaseDate) : new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return {
      id: String(ep.trackId || Math.random()),
      title: ep.trackName || 'Episodio sin título',
      date: formattedDate,
      duration: formattedDuration,
      description: ep.description || ep.shortDescription || 'Sin descripción.',
      audioUrl: ep.episodeUrl || ep.previewUrl || '',
    };
  });

  return { podcast, episodes, episodeCount: podcastInfo?.trackCount ?? episodes.length };
}
