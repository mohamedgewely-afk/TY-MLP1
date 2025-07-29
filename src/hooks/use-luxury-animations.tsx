
import { useCallback } from 'react';

// Luxury animation timing curves inspired by premium automotive brands
export const LUXURY_CURVES = {
  luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  premium: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  cinematic: 'cubic-bezier(0.77, 0, 0.175, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

export const LUXURY_DURATIONS = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  cinematic: '500ms'
} as const;

interface LuxuryAnimationOptions {
  duration?: keyof typeof LUXURY_DURATIONS;
  curve?: keyof typeof LUXURY_CURVES;
  delay?: string;
}

export function useLuxuryAnimations() {
  const createAnimation = useCallback((
    property: string,
    options: LuxuryAnimationOptions = {}
  ) => {
    const {
      duration = 'normal',
      curve = 'luxury',
      delay = '0ms'
    } = options;

    return {
      transition: `${property} ${LUXURY_DURATIONS[duration]} ${LUXURY_CURVES[curve]} ${delay}`,
      willChange: property
    };
  }, []);

  const shrinkAnimation = useCallback(() => ({
    ...createAnimation('all', { duration: 'normal', curve: 'cinematic' }),
    transformOrigin: 'center bottom'
  }), [createAnimation]);

  const elevationAnimation = useCallback(() => ({
    ...createAnimation('transform, box-shadow', { duration: 'fast', curve: 'smooth' })
  }), [createAnimation]);

  const morphAnimation = useCallback(() => ({
    ...createAnimation('all', { duration: 'slow', curve: 'premium' })
  }), [createAnimation]);

  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  return {
    createAnimation,
    shrinkAnimation,
    elevationAnimation,
    morphAnimation,
    hapticFeedback,
    curves: LUXURY_CURVES,
    durations: LUXURY_DURATIONS,
    luxuryEase: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
    premiumBounce: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] },
    cinematicSlide: { duration: 0.5, ease: [0.77, 0, 0.175, 1] }
  };
}
