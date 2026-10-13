import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { EpisodeDetailView } from './EpisodeDetailView';
import * as PodcastContextModule from '../../context/PodcastContext';
import { PodcastDetail } from '../../domain/Episode';

const detail: PodcastDetail = {
  podcast: {
    id: '1',
    title: 'Song Exploder',
    author: 'Hrishikesh Hirway',
    image: 'https://example.com/image.jpg',
    summary: 'An inside look at how music is made.',
  },
  episodes: [
    {
      id: 'ep-1',
      title: 'Fleetwood Mac - Dreams',
      description:
        '<p>La historia de la canción. Patrocinado por <a href="https://example.com">Example</a></p>' +
        '<script>window.hacked = true</script>',
      audioUrl: 'https://example.com/audio1.mp3',
      date: '1/3/2016',
      duration: '14:00',
    },
  ],
  episodeCount: 1,
};

const renderEpisodeView = (episodeId: string) =>
  render(
    <MemoryRouter initialEntries={[`/podcast/1/episode/${episodeId}`]}>
      <Routes>
        <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailView />} />
      </Routes>
    </MemoryRouter>,
  );

describe('EpisodeDetailView Component', () => {
  beforeEach(() => {
    jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
      podcasts: [],
      isLoading: false,
      error: null,
      fetchPodcasts: jest.fn(),
      fetchPodcastDetail: jest.fn().mockResolvedValue(detail),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('muestra el título del episodio y el reproductor de audio nativo', async () => {
    const { container } = renderEpisodeView('ep-1');

    expect(
      await screen.findByRole('heading', { name: 'Fleetwood Mac - Dreams' }),
    ).toBeInTheDocument();

    const audio = container.querySelector('audio');
    expect(audio).toHaveAttribute('src', 'https://example.com/audio1.mp3');
    expect(audio).toHaveAttribute('controls');
  });

  test('muestra la barra lateral con enlaces al detalle del podcast', async () => {
    renderEpisodeView('ep-1');

    const authorLink = await screen.findByRole('link', { name: 'Hrishikesh Hirway' });
    expect(authorLink).toHaveAttribute('href', '/podcast/1');
    expect(screen.getByText('An inside look at how music is made.')).toBeInTheDocument();
  });

  test('interpreta el HTML de la descripción en lugar de mostrarlo escapado', async () => {
    renderEpisodeView('ep-1');

    const link = await screen.findByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('sanitiza el HTML peligroso de la descripción', async () => {
    const { container } = renderEpisodeView('ep-1');
    await screen.findByRole('heading', { name: 'Fleetwood Mac - Dreams' });

    expect(container.innerHTML).not.toContain('<script');
  });

  test('muestra un mensaje si el episodio no existe', async () => {
    renderEpisodeView('inexistente');

    expect(await screen.findByText('Episodio no encontrado')).toBeInTheDocument();
  });
});
