// DTOs para el detalle de los podcasts

export interface ITunesEpisodesDTO {
  wrapperType: 'track' | 'podcastEpisode';
  artistName?: string;
  collectionName?: string;
  trackName?: string;
  trackId?: number;
  trackCount?: number;
  artworkUrl600?: string;
  artworkUrl100?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  description?: string;
  shortDescription?: string;
  episodeUrl?: string;
  previewUrl?: string;
}

export interface ITunesEpisodesResponseDTO {
  results: ITunesEpisodesDTO[];
}