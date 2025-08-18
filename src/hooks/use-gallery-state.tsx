
import { useState, useCallback, useEffect } from 'react';
import { useDeviceInfo } from './use-device-info';

export type GalleryMode = 'cinematic' | 'grid' | 'split' | 'slideshow';
export type ViewMode = 'mobile' | 'tablet' | 'desktop';

interface GalleryState {
  mode: GalleryMode;
  currentChapter: number;
  currentImage: number;
  viewMode: ViewMode;
  isFullscreen: boolean;
  showDetails: boolean;
  favorites: string[];
  zoom: number;
  pan: { x: number; y: number };
}

export const useGalleryState = (totalChapters: number) => {
  const { isMobile, isTablet, isDesktop } = useDeviceInfo();
  
  const [state, setState] = useState<GalleryState>({
    mode: 'cinematic',
    currentChapter: 0,
    currentImage: 0,
    viewMode: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    isFullscreen: false,
    showDetails: false,
    favorites: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
  });

  const setMode = useCallback((mode: GalleryMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setCurrentChapter = useCallback((chapter: number) => {
    const validChapter = Math.max(0, Math.min(chapter, totalChapters - 1));
    setState(prev => ({ ...prev, currentChapter: validChapter, currentImage: 0 }));
  }, [totalChapters]);

  const nextChapter = useCallback(() => {
    setCurrentChapter(state.currentChapter + 1);
  }, [state.currentChapter, setCurrentChapter]);

  const prevChapter = useCallback(() => {
    setCurrentChapter(state.currentChapter - 1);
  }, [state.currentChapter, setCurrentChapter]);

  const toggleFavorite = useCallback((imageUrl: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(imageUrl)
        ? prev.favorites.filter(url => url !== imageUrl)
        : [...prev.favorites, imageUrl]
    }));
  }, []);

  const setFullscreen = useCallback((isFullscreen: boolean, imageIndex?: number) => {
    setState(prev => ({
      ...prev,
      isFullscreen,
      currentImage: imageIndex ?? prev.currentImage,
      zoom: 1,
      pan: { x: 0, y: 0 }
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.5, Math.min(zoom, 5)) }));
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  // Update view mode when device info changes
  useEffect(() => {
    const newViewMode = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    setState(prev => ({ ...prev, viewMode: newViewMode }));
  }, [isMobile, isTablet, isDesktop]);

  return {
    ...state,
    setMode,
    setCurrentChapter,
    nextChapter,
    prevChapter,
    toggleFavorite,
    setFullscreen,
    setZoom,
    setPan,
    totalChapters,
  };
};
