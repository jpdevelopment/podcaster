import { useEffect, useState } from 'react';
import { usePodcastContext } from '../../context/PodcastContext';
import { PodcastDetail } from '../../domain/Episode';

/**
 * Obtiene el detalle de un podcast (con sus episodios) a partir de su id.
 * Devuelve null mientras no está disponible o si no hay id.
 */
export function usePodcastDetail(podcastId: string | undefined): PodcastDetail | null {
  const { fetchPodcastDetail } = usePodcastContext();
  const [detail, setDetail] = useState<PodcastDetail | null>(null);

  useEffect(() => {
    if (!podcastId) return;

    // Evita que una respuesta tardía de una petición anterior sobrescriba el estado actual
    let isCurrent = true;

    fetchPodcastDetail(podcastId).then((result) => {
      if (isCurrent) setDetail(result);
    });

    return () => {
      isCurrent = false;
    };
  }, [podcastId, fetchPodcastDetail]);

  return detail;
}
