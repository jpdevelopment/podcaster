import { GetPodcastDetail } from './GetPodcastDetail';
import { PodcastRepository } from '../../application/ports/PodcastRepository';
import { PodcastDetail } from '../../domain/Episode';

class MockPodcastRepository implements PodcastRepository {
  async getTopPodcasts() {
    return [];
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    return {
      podcast: {
        id: podcastId,
        title: 'Detail Test Podcast',
        author: 'Test Author',
        image: 'https://example.com/image.jpg',
        summary: 'Test Description for detail view',
      },
      episodes: [
        {
          id: 'ep-1',
          title: 'First Episode',
          description: 'Episode description',
          audioUrl: 'https://example.com/audio.mp3',
          date: '2026-01-01',
          duration: '1800',
        },
      ],
    };
  }
}

describe('GetPodcastDetail Use Case', () => {
  test('Debe devolver los detalles de un podcast correctamente', async () => {
    const repository = new MockPodcastRepository();
    const useCase = new GetPodcastDetail(repository);

    const result = await useCase.execute('123');

    expect(result).toBeDefined();
    expect(result?.podcast.id).toBe('123');
    expect(result?.podcast.title).toBe('Detail Test Podcast');
    expect(result?.podcast.author).toBe('Test Author');
    expect(result?.episodes).toHaveLength(1);
    expect(result?.episodes[0]?.title).toBe('First Episode');
  });
});
