import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PodcastProvider } from '../../context/PodcastContext';
import { MainView } from './MainView';
import * as PodcastContextModule from '../../context/PodcastContext';
import userEvent from '@testing-library/user-event';

// Mockeamos el contenedor de composition root para controlar la respuesta en el componente
jest.mock('../../composition-root/container', () => ({
  getTopPodcasts: {
    execute: jest.fn().mockResolvedValue([
      {
        id: '1',
        title: 'Song Exploder',
        author: 'Hrishikesh Hirway',
        image: 'https://example.com/image.jpg',
        description: 'Test Description',
      },
    ]),
  },
  getPodcastDetail: {
    execute: jest.fn().mockResolvedValue(null),
  },
}));

describe('MainView Component', () => {
  // Test unitario del componente:
  test('debe renderizar la lista de podcasts correctamente desde el Contexto', async () => {
    render(
      <PodcastProvider>
        <BrowserRouter>
          <MainView />
        </BrowserRouter>
      </PodcastProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Song Exploder')).toBeInTheDocument();
      expect(screen.getByText(/Author:\s*Hrishikesh Hirway/i)).toBeInTheDocument();
    });
  });

  // Test de prueba de filtrado:

  test('debe llamar a fetchPodcasts con el filtro introducido por el usuario', async () => {
    const user = userEvent.setup();
    const mockFetchPodcasts = jest.fn();

    jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
      podcasts: [
        {
          id: '1',
          title: 'Song Exploder',
          author: 'Hrishikesh',
          image: 'img1.jpg',
          summary: 'desc',
        },
        {
          id: '2',
          title: 'The Daily',
          author: 'New York Times',
          image: 'img2.jpg',
          summary: 'desc',
        },
      ],
      isLoading: false,
      error: null,
      fetchPodcasts: mockFetchPodcasts,
      fetchPodcastDetail: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MainView />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText(/filter podcasts/i);
    await user.type(input, 'Song');

    // Verificamos que el componente ejecutó la función del contexto pasándole el filtro
    await waitFor(() => {
      expect(mockFetchPodcasts).toHaveBeenCalledWith('Song');
    });
  });

  // Tests de estados de carga y error:
  test('debe mostrar un mensaje de error si el contexto devuelve un error', () => {
    jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
      podcasts: [],
      isLoading: false,
      error: 'Error al conectar con el servidor',
      fetchPodcasts: jest.fn(),
      fetchPodcastDetail: jest.fn(),
    });

    render(
      <BrowserRouter>
        <MainView />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Error al conectar con el servidor/i)).toBeInTheDocument();
  });
});
