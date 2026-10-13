import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PodcastSidebar } from './PodcastSidebar';
import { Podcast } from '../../domain/Podcast';

const podcast: Podcast = {
  id: '42',
  title: 'Song Exploder',
  author: 'Hrishikesh Hirway',
  image: 'https://example.com/cover.jpg',
  summary: 'Un podcast sobre cómo se hacen las canciones.',
};

const renderSidebar = (data: Podcast = podcast) =>
  render(
    <MemoryRouter>
      <PodcastSidebar podcast={data} />
    </MemoryRouter>,
  );

describe('PodcastSidebar', () => {
  test('la imagen, el título y el autor enlazan al detalle del podcast', () => {
    renderSidebar();

    // La imagen (por su alt) y el título comparten nombre accesible: son dos enlaces
    const imageAndTitleLinks = screen.getAllByRole('link', { name: 'Song Exploder' });
    const authorLink = screen.getByRole('link', { name: 'Hrishikesh Hirway' });

    expect(imageAndTitleLinks).toHaveLength(2);
    [...imageAndTitleLinks, authorLink].forEach((link) => {
      expect(link).toHaveAttribute('href', '/podcast/42');
    });
  });

  test('muestra la descripción del podcast cuando existe', () => {
    renderSidebar();

    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Un podcast sobre cómo se hacen las canciones.')).toBeInTheDocument();
  });

  test('no muestra el bloque de descripción si está vacía', () => {
    renderSidebar({ ...podcast, summary: '' });

    expect(screen.queryByText('Description:')).not.toBeInTheDocument();
  });
});