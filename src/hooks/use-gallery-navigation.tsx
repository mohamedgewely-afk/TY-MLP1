
import { useCallback, useEffect, useRef } from 'react';

interface UseGalleryNavigationOptions<T> {
  items: T[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onItemSelect?: (item: T, index: number) => void;
  loop?: boolean;
  rtl?: boolean;
  enableKeyboard?: boolean;
}

export const useGalleryNavigation = <T,>({
  items,
  activeIndex,
  onIndexChange,
  onItemSelect,
  loop = true,
  rtl = false,
  enableKeyboard = true
}: UseGalleryNavigationOptions<T>) => {
  const justChangedByArrow = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    const nextIndex = loop 
      ? (activeIndex + 1) % items.length
      : Math.min(activeIndex + 1, items.length - 1);
    
    if (nextIndex !== activeIndex) {
      justChangedByArrow.current = true;
      onIndexChange(nextIndex);
    }
  }, [activeIndex, items.length, loop, onIndexChange]);

  const goPrevious = useCallback(() => {
    const prevIndex = loop
      ? (activeIndex - 1 + items.length) % items.length
      : Math.max(activeIndex - 1, 0);
    
    if (prevIndex !== activeIndex) {
      justChangedByArrow.current = true;
      onIndexChange(prevIndex);
    }
  }, [activeIndex, items.length, loop, onIndexChange]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length && index !== activeIndex) {
      onIndexChange(index);
    }
  }, [activeIndex, items.length, onIndexChange]);

  const selectCurrent = useCallback(() => {
    const currentItem = items[activeIndex];
    if (currentItem && onItemSelect) {
      onItemSelect(currentItem, activeIndex);
    }
  }, [items, activeIndex, onItemSelect]);

  // Center active item in track
  const centerActiveItem = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const activeChild = track.children[activeIndex] as HTMLElement;
    if (!activeChild) return;

    const trackWidth = track.clientWidth;
    const childWidth = activeChild.clientWidth;
    const childLeft = activeChild.offsetLeft;
    const scrollLeft = childLeft - (trackWidth - childWidth) / 2;

    track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if focus is on input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          rtl ? goPrevious() : goNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          rtl ? goNext() : goPrevious();
          break;
        case 'Home':
          e.preventDefault();
          goToIndex(0);
          break;
        case 'End':
          e.preventDefault();
          goToIndex(items.length - 1);
          break;
        case 'PageDown':
          e.preventDefault();
          rtl ? goPrevious() : goNext();
          break;
        case 'PageUp':
          e.preventDefault();
          rtl ? goNext() : goPrevious();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectCurrent();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard, rtl, goNext, goPrevious, goToIndex, selectCurrent, items.length]);

  // Focus management for roving tabindex
  useEffect(() => {
    if (!trackRef.current) return;

    const activeButton = trackRef.current.children[activeIndex]?.querySelector<HTMLButtonElement>('[data-card-trigger]');
    if (activeButton && justChangedByArrow.current) {
      activeButton.focus({ preventScroll: true });
      justChangedByArrow.current = false;
    }
  }, [activeIndex]);

  // Auto-center when active index changes
  useEffect(() => {
    centerActiveItem();
  }, [centerActiveItem]);

  return {
    trackRef,
    goNext,
    goPrevious,
    goToIndex,
    selectCurrent,
    centerActiveItem
  };
};
