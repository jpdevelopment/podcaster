import { CachedPodcastAdapter } from './CachedPodcastAdapter';
import { PodcastRepository } from '../../application/ports/PodcastRepository';

describe('CachedPodcastAdapter', () => {
  let mockDecoratedRepo: PodcastRepository;
  let cachedAdapter: CachedPodcastAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockDecoratedRepo = {
      getTopPodcasts: jest.fn().mockResolvedValue([{ id: '1', title: 'Mock Podcast' }]),
      getPodcastDetail: jest.fn(),
    };
    cachedAdapter = new CachedPodcastAdapter(mockDecoratedRepo);
  });

  test('debe llamar al repositorio decorado si no hay datos en caché', async () => {
    const data = await cachedAdapter.getTopPodcasts();
    
    expect(data).toHaveLength(1);
    expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
  });

  test('debe devolver los datos desde localStorage sin volver a llamar a la red si la caché es reciente', async () => {
    // Primera llamada (guarda en caché)
    await cachedAdapter.getTopPodcasts();
    
    // Segunda llamada (debe leer de caché)
    const data = await cachedAdapter.getTopPodcasts();
    
    expect(data).toHaveLength(1);
    // El repositorio real solo debió llamarse 1 vez
    expect(mockDecoratedRepo.getTopPodcasts).toHaveBeenCalledTimes(1);
  });
});