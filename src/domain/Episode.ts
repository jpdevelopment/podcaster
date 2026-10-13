import { Podcast } from './Podcast';

export interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  audioUrl: string;
}

export interface PodcastDetail {
  podcast: Podcast;
  episodes: Episode[];
  episodeCount: number;
}
