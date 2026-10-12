import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePodcastContext } from '../../context/PodcastContext';
import './MainView.css';

/**
 * Componente con el listado de la vista principal.
 */
export const MainView: React.FC = () => {
  const { podcasts, error, fetchPodcasts } = usePodcastContext();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchPodcasts(filter);
  }, [filter, fetchPodcasts]);

  return (
    <div className="main-view">
      <div className="main-view__filter">
        <span>{podcasts.length}</span>
        <input
          type="text"
          placeholder="Filter podcasts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="main-view__grid">
        {podcasts.map((p) => (
          <Link key={p.id} to={`/podcast/${p.id}`} className="podcast-card">
            <img src={p.image} alt={p.title} />
            <h3>{p.title}</h3>
            <p>Author: {p.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
