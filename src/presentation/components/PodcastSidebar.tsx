import React from 'react';
import { Link } from 'react-router-dom';
import { Podcast } from '../../domain/Podcast';
import './PodcastSidebar.css';

/**
 * Componente común para todas las vistas de la Barra lateral en la App.
 * Muestra la imagen, Título, Autor y Descripción
 */
export const PodcastSidebar: React.FC<{ podcast: Podcast }> = ({ podcast }) => (
  <aside className="sidebar">
    <Link to={`/podcast/${podcast.id}`}>
      <img src={podcast.image} alt={podcast.title} />
    </Link>
    <Link to={`/podcast/${podcast.id}`} className="sidebar__title">
      {podcast.title}
    </Link>
    <p>by {podcast.author}</p>
    {podcast.summary && (
      <div className="sidebar__desc">
        <strong>Description:</strong>
        <p>{podcast.summary}</p>
      </div>
    )}
  </aside>
);
