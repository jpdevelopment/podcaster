import { act, renderHook, waitFor } from '@testing-library/react';
import * as PodcastContextModule from '../../context/PodcastContext';
import { PodcastDetail } from '../../domain/Episode';
import { usePodcastDetail } from './usePodcastDetail';

const buildDetail = (id: string): PodcastDetail => ({
  podcast: { id, title: `Podcast ${id}`, author: 'Autor', image: '', summary: '' },
  episodes: [],
  episodeCount: 0,
});

const mockContext = (fetchPodcastDetail: jest.Mock) =>
  jest.spyOn(PodcastContextModule, 'usePodcastContext').mockReturnValue({
    podcasts: [],
    isLoading: false,
    error: null,
    fetchPodcasts: jest.fn(),
    fetchPodcastDetail,
  });

describe('usePodcastDetail', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('devuelve null mientras carga y el detalle cuando llega', async () => {
    const fetchPodcastDetail = jest.fn().mockResolvedValue(buildDetail('1'));
    mockContext(fetchPodcastDetail);

    const { result } = renderHook(() => usePodcastDetail('1'));

    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toEqual(buildDetail('1')));
    expect(fetchPodcastDetail).toHaveBeenCalledWith('1');
  });

  test('no pide nada si no hay id de podcast', () => {
    const fetchPodcastDetail = jest.fn();
    mockContext(fetchPodcastDetail);

    const { result } = renderHook(() => usePodcastDetail(undefined));

    expect(result.current).toBeNull();
    expect(fetchPodcastDetail).not.toHaveBeenCalled();
  });

  test('vuelve a pedir el detalle cuando cambia el id', async () => {
    const fetchPodcastDetail = jest.fn().mockImplementation(async (id: string) => buildDetail(id));
    mockContext(fetchPodcastDetail);

    const { result, rerender } = renderHook(({ id }) => usePodcastDetail(id), {
      initialProps: { id: '1' },
    });
    await waitFor(() => expect(result.current?.podcast.id).toBe('1'));

    rerender({ id: '2' });

    await waitFor(() => expect(result.current?.podcast.id).toBe('2'));
    expect(fetchPodcastDetail).toHaveBeenCalledTimes(2);
  });

  test('descarta una respuesta tardía de un id anterior', async () => {
    const resolvers: Record<string, (detail: PodcastDetail) => void> = {};
    const fetchPodcastDetail = jest.fn().mockImplementation(
      (id: string) =>
        new Promise<PodcastDetail>((resolve) => {
          resolvers[id] = resolve;
        }),
    );
    mockContext(fetchPodcastDetail);

    const { result, rerender } = renderHook(({ id }) => usePodcastDetail(id), {
      initialProps: { id: '1' },
    });
    rerender({ id: '2' });

    // La respuesta del id 2 llega primero y la del id 1 (obsoleta) después
    await act(async () => {
      resolvers['2']?.(buildDetail('2'));
    });
    await act(async () => {
      resolvers['1']?.(buildDetail('1'));
    });

    expect(result.current?.podcast.id).toBe('2');
  });
});
