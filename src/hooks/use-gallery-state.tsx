
import { useState } from 'react';

export type GalleryMode = 'cinematic' | 'grid' | 'split' | 'slideshow';
export type ViewMode = 'mobile' | 'tablet' | 'desktop';

export interface GalleryState {
  mode: GalleryMode;
  currentChapter: number;
  currentImage: number;
  favorites: string[];
  viewMode: ViewMode;
  isFullscreen: boolean;
}

export const useGalleryState = (initialChapter: number = 0) => {
  const [state, setState] = useState<GalleryState>({
    mode: 'cinematic',
    currentChapter: initialChapter,
    currentImage: 0,
    favorites: [],
    viewMode: 'desktop',
    isFullscreen: false,
  });

  const updateState = (updates: Partial<GalleryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setMode = (mode: GalleryMode) => {
    updateState({ mode });
  };

  const setChapter = (chapter: number) => {
    updateState({ currentChapter: chapter, currentImage: 0 });
  };

  const setImage = (image: number) => {
    updateState({ currentImage: image });
  };

  const toggleFavorite = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(imageUrl)
        ? prev.favorites.filter(url => url !== imageUrl)
        : [...prev.favorites, imageUrl]
    }));
  };

  const setViewMode = (viewMode: ViewMode) => {
    updateState({ viewMode });
  };

  const setFullscreen = (isFullscreen: boolean) => {
    updateState({ isFullscreen });
  };

  return {
    state,
    setMode,
    setChapter,
    setImage,
    toggleFavorite,
    setViewMode,
    setFullscreen,
    updateState,
  };
};
