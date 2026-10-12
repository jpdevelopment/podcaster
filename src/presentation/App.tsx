import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PodcastProvider } from '../context/PodcastContext';
import { Header } from './components/Header';
import { MainView } from './views/MainView';
import { PodcastDetailView } from './views/PodcastDetailView';
import { EpisodeDetailView } from './views/EpisodeDetailView';

export const App: React.FC = () => {
  return (
    <PodcastProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/podcast/:podcastId" element={<PodcastDetailView />} />
          <Route path="/podcast/:podcastId/episode/:episodeId" element={<EpisodeDetailView />} />
        </Routes>
      </BrowserRouter>
    </PodcastProvider>
  );
};
