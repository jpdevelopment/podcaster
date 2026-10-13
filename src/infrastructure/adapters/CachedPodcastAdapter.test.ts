import { CachedPodcastAdapter } from './CachedPodcastAdapter';
import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { PodcastDetail } from '../../domain/Episode';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildDetail = (podcastId: string): PodcastDetail => ({
  podcast: { id: podcastId, title: `Podcast ${podcastId}`, author: 'Autor', image: '', summary: '' },
  episodes: [],
  episodeCount: 0
});

describe('CachedPodcastAdapter', () => {
  let mockDecoratedRepo: PodcastRepository;
  let cachedAdapter: CachedPodcastAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockDecoratedRepo = {
      getTopPodcasts: jest.fn().mockResolvedValue([{ id: '1', title: 'Mock Podcast' }]),
      getPodcastDetail: jest.fn().mockImplementation(async (id: string) => buildDetail(id)),
    };
    cachedAdapter = new CachedPodcastAdapter(mockDecoratedRepo);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getTopPodcasts', () => {
    test('debe llamar al repositorio decorado si no hay datos en caché', async () => {
      const data = await cachedAdapter.getTopPodcasts();

      expect(data).toHaveLength(1);
      expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
    });

    test('debe devolver los datos desde localStorage sin volver a llamar a la red si la caché es reciente', async () => {
      await cachedAdapter.getTopPodcasts();
      const data = await cachedAdapter.getTopPodcasts();

      expect(data).toHaveLength(1);
      expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
    });

    test('no vuelve a pedir los datos si no ha pasado un día', async () => {
      const start = Date.now();
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(start);
      await cachedAdapter.getTopPodcasts();

      nowSpy.mockReturnValue(start + DAY_IN_MS - 1000);
      await cachedAdapter.getTopPodcasts();

      expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
    });

    test('vuelve a pedir los datos cuando ha pasado más de un día', async () => {
      const start = Date.now();
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(start);
      await cachedAdapter.getTopPodcasts();

      nowSpy.mockReturnValue(start + DAY_IN_MS + 1);
      await cachedAdapter.getTopPodcasts();

      expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(2);
    });

    test('ignora una entrada de caché corrupta y vuelve a pedir los datos', async () => {
      localStorage.setItem('podcaster_top_100', 'esto no es JSON');

      const data = await cachedAdapter.getTopPodcasts();

      expect(data).toHaveLength(1);
      expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
    });

    test('devuelve los datos aunque no se pueda escribir en localStorage', async () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      const data = await cachedAdapter.getTopPodcasts();

      expect(data).toHaveLength(1);
      expect(console.warn).toHaveBeenCalled();
    });   
  });

  describe('getPodcastDetail', () => {
    test('guarda en caché cada detalle por separado según el id del podcast', async () => {
      await cachedAdapter.getPodcastDetail('1');
      await cachedAdapter.getPodcastDetail('1');
      await cachedAdapter.getPodcastDetail('2');

      expect(mockDecoratedRepo.getPodcastDetail).toHaveBeenCalledTimes(2);
      expect(mockDecoratedRepo.getPodcastDetail).toHaveBeenCalledWith('1');
      expect(mockDecoratedRepo.getPodcastDetail).toHaveBeenCalledWith('2');
    });
  });
});