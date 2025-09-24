import { useState, useEffect } from 'react';

/**
 * Hook to safely detect user's motion preferences
 * Returns true if user prefers reduced motion
 */
export function useReducedMotionSafe(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Motion-safe animation variants for Framer Motion
 */
export const motionSafeVariants = {
  initial: (prefersReducedMotion: boolean) => ({
    opacity: 0,
    ...(prefersReducedMotion ? {} : { y: 20, scale: 0.95 })
  }),
  animate: (prefersReducedMotion: boolean) => ({
    opacity: 1,
    ...(prefersReducedMotion ? {} : { y: 0, scale: 1 })
  }),
  exit: (prefersReducedMotion: boolean) => ({
    opacity: 0,
    ...(prefersReducedMotion ? {} : { y: -20, scale: 0.95 })
  }),
  transition: (prefersReducedMotion: boolean) => ({
    duration: prefersReducedMotion ? 0.1 : 0.3,
    ease: prefersReducedMotion ? 'linear' : [0.4, 0, 0.2, 1]
  })
};

/**
 * Motion-safe spring configuration
 */
export const motionSafeSpring = (prefersReducedMotion: boolean) => ({
  type: prefersReducedMotion ? 'tween' : 'spring',
  duration: prefersReducedMotion ? 0.1 : undefined,
  stiffness: prefersReducedMotion ? undefined : 300,
  damping: prefersReducedMotion ? undefined : 30
});