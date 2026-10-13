import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePodcastDetail } from '../hooks/usePodcastDetail';
import { PodcastSidebar } from '../components/PodcastSidebar';
import './PodcastDetailView.css';

/**
 * Componente con la vista detalle de un podcast con los episodios de en un listado
 */
export const PodcastDetailView: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const detail = usePodcastDetail(podcastId);

  if (!detail) return null;

  return (
    <div className="layout">
      <PodcastSidebar podcast={detail.podcast} />
      <main>
        <h2>Episodes: {detail.episodes.length}</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {detail.episodes.map((ep) => (
              <tr key={ep.id}>
                <td>
                  <Link to={`/podcast/${podcastId}/episode/${ep.id}`}>{ep.title}</Link>
                </td>
                <td>{ep.date}</td>
                <td>{ep.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};