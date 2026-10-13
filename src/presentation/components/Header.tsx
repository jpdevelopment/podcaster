import React from 'react';
import { Link } from 'react-router-dom';
import { usePodcastContext } from '../../context/PodcastContext';
import './Header.css';

/**
 * Componente común para todas las vistas de la Cabecera de la App.
 */
export const Header: React.FC = () => {
  const { isLoading } = usePodcastContext();
  return (
    <header className="header">
      <Link to="/" className="header__title">
        Podcaster
      </Link>
      {isLoading && <div className="header__spinner" role="status" aria-label="Cargando" />}{' '}
    </header>
  );
};
