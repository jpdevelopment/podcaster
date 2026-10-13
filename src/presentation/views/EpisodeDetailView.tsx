import React from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastDetail } from '../hooks/usePodcastDetail';
import { PodcastSidebar } from '../components/PodcastSidebar';
import { SanitizedHtml } from '../components/SanitizedHtml';

/**
 * Componente con la vista detalle de un episodio con un reproductor de audio.
 */
export const EpisodeDetailView: React.FC = () => {
  const { podcastId, episodeId } = useParams<{ podcastId: string; episodeId: string }>();
  const detail = usePodcastDetail(podcastId);

  if (!detail) return null;
  const episode = detail.episodes.find((e) => e.id === episodeId);

  if (!episode) return <p>Episodio no encontrado</p>;

  return (
    <div className="layout">
      <PodcastSidebar podcast={detail.podcast} />
      <main>
        <h2>{episode.title}</h2>
        <SanitizedHtml html={episode.description} />
        <audio controls src={episode.audioUrl} />
      </main>
    </div>
  );
};
