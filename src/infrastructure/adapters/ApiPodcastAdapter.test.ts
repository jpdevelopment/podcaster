import { ApiPodcastAdapter } from './ApiPodcastAdapter';
import { PodcastFetchError, PodcastDetailError } from '../../domain/errors/Errors';

describe('ApiPodcastAdapter (Infrastructure Adapter)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    // Silenciamos el console.log intencionalmente durante los tests de errores para mantener la terminal limpia
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    // Restaura el console.log original después de cada test
    jest.restoreAllMocks(); 
  });

  describe('getTopPodcasts', () => {
    test('debe retornar la lista de podcasts cuando la respuesta es exitosa', async () => {
      const mockResponseData = {
        feed: { entry: [] },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponseData,
      });

      const adapter = new ApiPodcastAdapter();
      const result = await adapter.getTopPodcasts();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]); // O la lista mapeada que devuelva tu mapper
    });

    test('debe lanzar PodcastFetchError si la respuesta de la API no es ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      const adapter = new ApiPodcastAdapter();

      await expect(adapter.getTopPodcasts()).rejects.toThrow(PodcastFetchError);
    });

    test('debe lanzar PodcastFetchError si ocurre un fallo de red', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const adapter = new ApiPodcastAdapter();

      await expect(adapter.getTopPodcasts()).rejects.toThrow(PodcastFetchError);
    });
  });

  describe('getPodcastDetail', () => {
    test('debe lanzar PodcastDetailError si la petición de detalle falla', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      const adapter = new ApiPodcastAdapter();

      await expect(adapter.getPodcastDetail('123')).rejects.toThrow(PodcastDetailError);
    });
  });
});
