
import { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LuxuryAnimationOptions {
  duration?: number;
  curve?: 'luxury' | 'premium' | 'cinematic';
  performanceMode?: boolean;
}

export const useLuxuryAnimations = () => {
  const isMobile = useIsMobile();

  // Luxury timing curves inspired by premium brands
  const curves = {
    luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    premium: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cinematic: 'cubic-bezier(0.77, 0, 0.175, 1)'
  };

  const durations = {
    fast: '150ms',
    medium: '300ms',
    slow: '600ms',
    cinematic: '800ms'
  };

  // Enhanced GPU-accelerated animations
  const createAnimation = (property: string, options: LuxuryAnimationOptions = {}) => {
    const { duration = 300, curve = 'luxury', performanceMode = true } = options;
    
    return {
      transition: `${property} ${duration}ms ${curves[curve]}`,
      willChange: performanceMode ? property : 'auto'
    };
  };

  // Specific animation presets
  const shrinkAnimation = () => ({
    transformOrigin: 'center bottom',
    transition: `transform ${durations.medium} ${curves.cinematic}, box-shadow ${durations.medium} ${curves.luxury}`,
    willChange: 'transform, box-shadow'
  });

  const elevationAnimation = () => ({
    transition: `box-shadow ${durations.medium} ${curves.luxury}, transform ${durations.fast} ${curves.cinematic}`,
    willChange: 'box-shadow, transform'
  });

  const morphAnimation = () => ({
    transition: `all ${durations.medium} ${curves.premium}`,
    willChange: 'transform, opacity, background-color'
  });

  const cinematicSlide = (direction: 'left' | 'right' | 'up' | 'down' = 'right') => ({
    transition: `transform ${durations.cinematic} ${curves.cinematic}, opacity ${durations.slow} ${curves.luxury}`,
    willChange: 'transform, opacity'
  });

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator && isMobile) {
      const patterns = { light: 10, medium: 50, heavy: 100 };
      navigator.vibrate(patterns[type]);
    }
  };

  return {
    createAnimation,
    shrinkAnimation,
    elevationAnimation,
    morphAnimation,
    cinematicSlide,
    hapticFeedback,
    curves,
    durations
  };
};

// Enhanced scroll direction hook with luxury animations
export const useLuxuryScrollDirection = () => {
  const scrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');
  const isScrolling = useRef(false);
  const isAtTop = useRef(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const direction = currentScrollY > scrollY.current ? 'down' : 'up';
          
          scrollDirection.current = direction;
          scrollY.current = currentScrollY;
          isScrolling.current = true;
          isAtTop.current = currentScrollY < 10;
          
          // Clear scrolling state after animation frame
          setTimeout(() => {
            isScrolling.current = false;
          }, 150);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrollDirection: scrollDirection.current,
    isScrolling: isScrolling.current,
    scrollY: scrollY.current,
    isAtTop: isAtTop.current,
    isScrollingDown: scrollDirection.current === 'down',
    isScrollingUp: scrollDirection.current === 'up'
  };
};
