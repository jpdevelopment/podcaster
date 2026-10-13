import { GetTopPodcasts } from './GetTopPodcasts';
import { PodcastRepository } from '../ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';

describe('GetTopPodcastsUseCase', () => {
  const mockPodcasts: Podcast[] = [
    { id: '1', title: 'Song Exploder', author: 'Song Exploder', image: '', summary: '' },
    { id: '2', title: 'KEXP Song of the Day', author: 'KEXP', image: '', summary: '' },
  ];

  const mockRepository: PodcastRepository = {
    getTopPodcasts: jest.fn().mockResolvedValue(mockPodcasts),
    getPodcastDetail: jest.fn(),
  };

  it('debe devolver todos los podcasts si el filtro está vacío', async () => {
    const useCase = new GetTopPodcasts(mockRepository);
    const result = await useCase.execute('');
    expect(result).toHaveLength(2);
  });

  it('debe filtrar correctamente los podcasts por título o autor (case-insensitive)', async () => {
    const useCase = new GetTopPodcasts(mockRepository);
    const result = await useCase.execute('kexp');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('KEXP Song of the Day');
  });
});