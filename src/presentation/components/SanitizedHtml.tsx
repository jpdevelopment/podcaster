import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHtmlProps {
  html: string;
}

/**
 * Muestra HTML interpretado (no escapado) tras sanitizarlo con DOMPurify.
 */
export const SanitizedHtml: React.FC<SanitizedHtmlProps> = ({ html }) => {
  const cleanHtml = useMemo(() => DOMPurify.sanitize(html), [html]);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
