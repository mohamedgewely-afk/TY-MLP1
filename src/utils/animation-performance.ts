// Optimized animation utilities for better performance
import { useCallback, useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

// High-performance CSS-based animations for simple transitions
export const cssAnimations = {
  // Fast fade transitions
  fadeIn: 'animate-[fadeIn_0.3s_ease-out_forwards]',
  fadeOut: 'animate-[fadeOut_0.3s_ease-out_forwards]',
  
  // Optimized slide animations
  slideInUp: 'animate-[slideInUp_0.4s_ease-out_forwards]',
  slideInDown: 'animate-[slideInDown_0.4s_ease-out_forwards]',
  
  // Scale animations
  scaleIn: 'animate-[scaleIn_0.2s_ease-out_forwards]',
  scaleOut: 'animate-[scaleOut_0.2s_ease-out_forwards]',
  
  // Hover effects
  buttonHover: 'hover:scale-105 transition-transform duration-200 ease-out',
  cardHover: 'hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out'
};

// Reduced motion variants
export const getReducedMotionVariant = (normalVariant: any, reducedVariant?: any) => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? (reducedVariant || { opacity: 1 }) : normalVariant;
};

// Performance-optimized spring configs
export const optimizedSprings = {
  fast: { type: 'spring', stiffness: 400, damping: 40, mass: 1 },
  smooth: { type: 'spring', stiffness: 300, damping: 35, mass: 1 },
  gentle: { type: 'spring', stiffness: 200, damping: 30, mass: 1 },
  snappy: { type: 'spring', stiffness: 500, damping: 45, mass: 0.8 }
};

// Animation performance monitor
export const useAnimationPerformance = () => {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const frameCountRef = useRef<number>(0);

  const startMonitoring = useCallback((animationName: string) => {
    startTimeRef.current = performance.now();
    frameCountRef.current = 0;

    const monitorFrame = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const duration = currentTime - (startTimeRef.current || 0);

      // Monitor if animation is taking too long (>16ms per frame for 60fps)
      if (duration > 16) {
        console.warn(`🚗 Animation Performance Warning: ${animationName} - Frame ${frameCountRef.current} took ${duration.toFixed(2)}ms`);
      }

      if (frameCountRef.current < 60) { // Monitor for 1 second max
        animationFrameRef.current = requestAnimationFrame(monitorFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(monitorFrame);
  }, []);

  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    return stopMonitoring;
  }, [stopMonitoring]);

  return { startMonitoring, stopMonitoring };
};

// Optimized variants for common animations
export const performanceVariants = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 20,
      willChange: 'opacity, transform'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      willChange: 'auto',
      transition: optimizedSprings.fast
    }
  },
  
  fadeInScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      willChange: 'opacity, transform'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      willChange: 'auto',
      transition: optimizedSprings.smooth
    }
  },
  
  slideInLeft: {
    hidden: { 
      x: -20, 
      opacity: 0,
      willChange: 'transform, opacity'
    },
    visible: { 
      x: 0, 
      opacity: 1,
      willChange: 'auto',
      transition: optimizedSprings.fast
    }
  },
  
  slideInRight: {
    hidden: { 
      x: 20, 
      opacity: 0,
      willChange: 'transform, opacity'
    },
    visible: { 
      x: 0, 
      opacity: 1,
      willChange: 'auto',
      transition: optimizedSprings.fast
    }
  },
  
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};

// GPU-optimized styles
export const gpuOptimized = {
  // Force GPU layer
  forceLayer: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const
  },
  
  // Remove GPU layer after animation
  removeLayer: {
    willChange: 'auto'
  }
};

// Intersection-based animation trigger
export const useIntersectionAnimation = (threshold = 0.1) => {
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          element.classList.add('animate-in');
          hasAnimated.current = true;
          observerRef.current?.unobserve(element);
        }
      },
      { 
        threshold,
        rootMargin: '50px 0px'
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  return elementRef;
};