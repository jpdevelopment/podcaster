import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '../../context/PodcastContext';
import { PodcastDetail } from '../../domain/Episode';
import { PodcastSidebar } from '../components/PodcastSidebar';

/**
 * Componente con la vista detalle de un episodio con un reproductor de audio.
 */
export const EpisodeDetailView: React.FC = () => {
  const { podcastId, episodeId } = useParams<{ podcastId: string; episodeId: string }>();
  const { fetchPodcastDetail } = usePodcastContext();
  const [detail, setDetail] = useState<PodcastDetail | null>(null);

  useEffect(() => {
    if (podcastId) fetchPodcastDetail(podcastId).then(setDetail);
  }, [podcastId, fetchPodcastDetail]);

  if (!detail) return null;
  const episode = detail.episodes.find((e) => e.id === episodeId);
  
  if (!episode) return <p>Episodio no encontrado</p>;

  return (
    <div className="layout">
      <PodcastSidebar podcast={detail.podcast} />
      <main>
        <h2>{episode.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: episode.description }} />
        <audio controls src={episode.audioUrl} />
      </main>
    </div>
  );
};
