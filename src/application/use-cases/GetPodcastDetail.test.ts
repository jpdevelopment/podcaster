import { GetPodcastDetail } from './GetPodcastDetail';
import { PodcastRepository } from '../ports/PodcastRepository';
import { Podcast } from '../../domain/Podcast';
import { PodcastDetail } from '../../domain/Episode';

const buildDetail = (podcastId: string): PodcastDetail => ({
  podcast: {
    id: podcastId,
    title: 'Detail Test Podcast',
    author: 'Test Author',
    image: 'https://example.com/image.jpg',
    summary: '',
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
  episodeCount: 1
});

const topPodcast: Podcast = {
  id: '123',
  title: 'Detail Test Podcast',
  author: 'Test Author',
  image: 'https://example.com/image.jpg',
  summary: 'Descripción que solo existe en el top 100',
};

const buildRepository = (overrides: Partial<PodcastRepository> = {}): PodcastRepository => ({
  getTopPodcasts: async () => [],
  getPodcastDetail: async (id) => buildDetail(id),
  ...overrides,
});

describe('GetPodcastDetail Use Case', () => {
  test('Debe devolver los detalles de un podcast correctamente', async () => {
    const useCase = new GetPodcastDetail(buildRepository());

    const result = await useCase.execute('123');

    expect(result.podcast.id).toBe('123');
    expect(result.podcast.title).toBe('Detail Test Podcast');
    expect(result.podcast.author).toBe('Test Author');
    expect(result.episodes).toHaveLength(1);
    expect(result.episodes[0]?.title).toBe('First Episode');
  });

  test('Debe completar la descripción con la del listado del top 100', async () => {
    const useCase = new GetPodcastDetail(
      buildRepository({ getTopPodcasts: async () => [topPodcast] }),
    );

    const result = await useCase.execute('123');

    expect(result.podcast.summary).toBe('Descripción que solo existe en el top 100');
  });

  test('Debe dejar la descripción vacía si el podcast no está en el top 100', async () => {
    const useCase = new GetPodcastDetail(
      buildRepository({ getTopPodcasts: async () => [{ ...topPodcast, id: '999' }] }),
    );

    const result = await useCase.execute('123');

    expect(result.podcast.summary).toBe('');
  });

  test('Debe devolver el detalle aunque falle la obtención del top', async () => {
    const useCase = new GetPodcastDetail(
      buildRepository({
        getTopPodcasts: async () => {
          throw new Error('top no disponible');
        },
      }),
    );

    const result = await useCase.execute('123');

    expect(result.podcast.title).toBe('Detail Test Podcast');
    expect(result.podcast.summary).toBe('');
  });

  test('Debe propagar el error si falla la obtención del detalle', async () => {
    const useCase = new GetPodcastDetail(
      buildRepository({
        getPodcastDetail: async () => {
          throw new Error('detalle no disponible');
        },
      }),
    );

    await expect(useCase.execute('123')).rejects.toThrow('detalle no disponible');
  });

  test('Debe lanzar un error si no se proporciona el ID', async () => {
    const useCase = new GetPodcastDetail(buildRepository());

    await expect(useCase.execute('')).rejects.toThrow('El ID del podcast es obligatorio');
  });
});