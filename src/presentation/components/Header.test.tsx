import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as PodcastContextModule from '../../context/PodcastContext';
import { Header } from './Header';

const mockContext = (isLoading: boolean) =>
  jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
    podcasts: [],
    isLoading,
    error: null,
    fetchPodcasts: jest.fn(),
    fetchPodcastDetail: jest.fn(),
  });

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe('Header', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('el título de la aplicación enlaza a la vista principal', () => {
    mockContext(false);
    renderHeader();

    expect(screen.getByRole('link', { name: 'Podcaster' })).toHaveAttribute('href', '/');
  });

  test('muestra el indicador de carga mientras hay una navegación en curso', () => {
    mockContext(true);
    renderHeader();

    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });

  test('no muestra el indicador cuando no hay carga', () => {
    mockContext(false);
    renderHeader();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
