import { mapApiToPodcasts } from './podcastMappers';
import { ITunesTopPodcastsResponseDTO } from '../dtos/iTunesPodcastDTO';

describe('podcastMappers', () => {
  test('debe mapear correctamente el JSON de iTunes a entidades de Dominio Podcast', () => {
    const rawMock: ITunesTopPodcastsResponseDTO = {
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
    };

    const result = mapApiToPodcasts(rawMock);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: '123',
      title: 'Test Podcast',
      author: 'Test Author',
      image: 'large.jpg',
      summary: 'Test Summary',
    });
  });
});
