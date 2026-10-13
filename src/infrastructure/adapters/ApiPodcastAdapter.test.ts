import { ApiPodcastAdapter } from './ApiPodcastAdapter';
import { PodcastFetchError, PodcastDetailError } from '../../domain/errors/Errors';

// allorigins (/get) envuelve la respuesta real de iTunes como texto dentro de `contents`.
const wrapInAllOrigins = (payload: unknown) => ({
  ok: true,
  json: async () => ({ contents: JSON.stringify(payload) }),
});

describe('ApiPodcastAdapter (Infrastructure Adapter)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Silenciamos console.log durante los tests de errores para mantener la terminal limpia
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('getTopPodcasts', () => {
    test('devuelve los podcasts mapeados cuando el proxy responde con contents', async () => {
      global.fetch = jest.fn().mockResolvedValue(
        wrapInAllOrigins({
          feed: {
            entry: [
              {
                id: { attributes: { 'im:id': '123' } },
                'im:name': { label: 'Test Podcast' },
                'im:artist': { label: 'Test Author' },
                'im:image': [{ label: 'small.jpg' }, { label: 'mid.jpg' }, { label: 'large.jpg' }],
                summary: { label: 'Test Summary' },
              },
            ],
          },
        }),
      );

      const result = await new ApiPodcastAdapter().getTopPodcasts();

      expect(result).toHaveLength(1);
      expect(result[0]?.title).toBe('Test Podcast');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'),
        ),
      );
    });

    test('lanza PodcastFetchError si la respuesta HTTP no es ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });

      await expect(new ApiPodcastAdapter().getTopPodcasts()).rejects.toThrow(PodcastFetchError);
    });

    test('lanza PodcastFetchError si el proxy no devuelve contents', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

      await expect(new ApiPodcastAdapter().getTopPodcasts()).rejects.toThrow(PodcastFetchError);
    });

    test('lanza PodcastFetchError si ocurre un fallo de red', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(new ApiPodcastAdapter().getTopPodcasts()).rejects.toThrow(PodcastFetchError);
    });
  });

  describe('getPodcastDetail', () => {
    test('devuelve el podcast y sus episodios mapeados', async () => {
      global.fetch = jest.fn().mockResolvedValue(
        wrapInAllOrigins({
          results: [
            {
              wrapperType: 'track',
              collectionName: 'Song Exploder',
              artistName: 'Song Exploder',
              artworkUrl600: 'cover.jpg',
            },
            {
              wrapperType: 'podcastEpisode',
              trackId: 1,
              trackName: 'Episode 1',
              releaseDate: '2016-03-01T00:00:00Z',
              trackTimeMillis: 840000,
              description: 'Description',
              episodeUrl: 'https://example.com/audio.mp3',
            },
          ],
        }),
      );

      const result = await new ApiPodcastAdapter().getPodcastDetail('123');

      expect(result.podcast.title).toBe('Song Exploder');
      expect(result.episodes).toHaveLength(1);
      expect(result.episodes[0]?.duration).toBe('14:00');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent(
            'https://itunes.apple.com/lookup?id=123&media=podcast&entity=podcastEpisode&limit=20',
          ),
        ),
      );
    });

    test('lanza PodcastDetailError si la respuesta HTTP no es ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });

      await expect(new ApiPodcastAdapter().getPodcastDetail('123')).rejects.toThrow(
        PodcastDetailError,
      );
    });

    test('lanza PodcastDetailError si el proxy no devuelve contents', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

      await expect(new ApiPodcastAdapter().getPodcastDetail('123')).rejects.toThrow(
        PodcastDetailError,
      );
    });
  });
});