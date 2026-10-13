import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Podcast } from '../domain/Podcast';
import { PodcastDetail } from '../domain/Episode';
import { getTopPodcasts, getPodcastDetail } from '../composition-root/container';

// Interfaz del contexto con las props que se inyectan
interface PodcastContextType {
  podcasts: Podcast[];
  isLoading: boolean;
  error: string | null;
  fetchPodcasts: (filter?: string) => Promise<void>;
  fetchPodcastDetail: (id: string) => Promise<PodcastDetail | null>;
}

// Creación del Contexto
const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// Creación del Context Provider para envolver los componentes
export const PodcastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función global para obtener el top100 de podcasts. Se usa la instancia creada en el composition-root.
  // También se usa useCallback como optimización dado que va a ser usada en varos sitios y no queremos que se creen varias instancias al renderizar el contexto.
  const fetchPodcasts = useCallback(async (filter: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTopPodcasts.execute(filter);
      setPodcasts(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error desconocido al obtener los podcasts';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función global para obtener el el detalle de un podcast. Se usa la instancia creada en el composition-root.
  // También se usa useCallback como optimización dado que va a ser usada en varos sitios y no queremos que se creen nuevas instancias al re-renderizar el contexto.
  const fetchPodcastDetail = useCallback(async (id: string): Promise<PodcastDetail | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getPodcastDetail.execute(id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error desconocido al obtener el detalle del podcast';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PodcastContext.Provider
      value={{ podcasts, isLoading, error, fetchPodcasts, fetchPodcastDetail }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

// Definición del hook del Context para usarlo importando en otros componentes. Control de errores incluido.
export const usePodcastContext = () => {
  const context = useContext(PodcastContext);
  if (!context) throw new Error('usePodcastContext debe usarse dentro de un PodcastProvider');
  return context;
};
