import { render, screen } from '@testing-library/react';
import { SanitizedHtml } from './SanitizedHtml';

describe('SanitizedHtml', () => {
  test('interpreta el HTML permitido en lugar de escaparlo', () => {
    render(
      <SanitizedHtml html='<p>Patrocinado por <a href="https://example.com">Example</a></p>' />,
    );

    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('elimina scripts y manejadores de eventos peligrosos', () => {
    const { container } = render(
      <SanitizedHtml
        html={'<p>Texto</p><script>window.hacked = true</script><img src="x" onerror="window.hacked = true">'}
      />,
    );

    expect(container).toHaveTextContent('Texto');
    expect(container.innerHTML).not.toContain('<script');
    expect(container.innerHTML).not.toContain('onerror');
  });
});