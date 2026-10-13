import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PodcastDetailView } from './PodcastDetailView';
import * as PodcastContextModule from '../../context/PodcastContext';

describe('PodcastDetailView Component', () => {
  test('debe renderizar el detalle del podcast y sus episodios correctamente', async () => {
    // 1. Mockeamos el contexto adaptado a tu estructura de dominio exacta
    jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
      podcasts: [],
      isLoading: false,
      error: null,
      fetchPodcasts: jest.fn(),
      fetchPodcastDetail: jest.fn().mockResolvedValue({
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
            description: 'The story behind the song.',
            audioUrl: 'https://example.com/audio1.mp3',
            date: '2026-01-01',
            duration: '1800',
          },
        ],
        episodeCount: 42
      }),
    });

    // 2. Renderizamos usando MemoryRouter para inyectar el parámetro :podcastId en la URL
    render(
      <MemoryRouter initialEntries={['/podcast/1']}>
        <Routes>
          <Route path="/podcast/:podcastId" element={<PodcastDetailView />} />
        </Routes>
      </MemoryRouter>
    );

    // 3. Verificamos que los datos del detalle y los episodios aparecen en pantalla
    await waitFor(() => {
      expect(screen.getByText('Song Exploder')).toBeInTheDocument();
      expect(screen.getByText(/Hrishikesh Hirway/i)).toBeInTheDocument();
      expect(screen.getByText('An inside look at how music is made.')).toBeInTheDocument();
      expect(screen.getByText('Fleetwood Mac - Dreams')).toBeInTheDocument();
      expect(screen.getByText('Episodes: 42')).toBeInTheDocument();
    });
  });
});