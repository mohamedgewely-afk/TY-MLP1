
import { Variants, Transition } from 'framer-motion';

// Optimized spring configurations for better performance
export const performantSpringConfigs = {
  // Reduced calculation overhead
  fast: {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 0.6
  },
  smooth: {
    type: "spring",
    stiffness: 120,
    damping: 16,
    mass: 0.8
  },
  // Optimized luxury animations with lower overhead
  luxurious: {
    type: "spring",
    stiffness: 45,
    damping: 15,
    mass: 0.9
  },
  cinematic: {
    type: "spring",
    stiffness: 55,
    damping: 18,
    mass: 1.0
  }
} as const;

// GPU-accelerated animation variants
export const performantVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.97,
      // Force GPU layer
      transform: 'translate3d(0, 60px, 0) scale(0.97)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      willChange: 'auto',
      transition: performantSpringConfigs.luxurious
    }
  },
  fadeInScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      transform: 'translate3d(0, 0, 0) scale(0.9)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transform: 'translate3d(0, 0, 0) scale(1)',
      willChange: 'auto',
      transition: performantSpringConfigs.cinematic
    }
  },
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -80,
      transform: 'translate3d(-80px, 0, 0)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transform: 'translate3d(0, 0, 0)',
      willChange: 'auto',
      transition: performantSpringConfigs.luxurious
    }
  },
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 80,
      transform: 'translate3d(80px, 0, 0)',
      willChange: 'transform, opacity'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transform: 'translate3d(0, 0, 0)',
      willChange: 'auto',
      transition: performantSpringConfigs.luxurious
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Reduced from 0.25
        delayChildren: 0.3, // Reduced from 0.5
        ease: "easeOut"
      }
    }
  }
};

// Optimized micro-interactions with GPU acceleration
export const performantMicroAnimations = {
  buttonHover: {
    scale: 1.02,
    y: -2,
    transform: 'translate3d(0, -2px, 0) scale(1.02)',
    transition: performantSpringConfigs.fast
  },
  luxuryHover: {
    scale: 1.015,
    y: -3,
    transform: 'translate3d(0, -3px, 0) scale(1.015)',
    boxShadow: "0 15px 20px -5px rgba(0, 0, 0, 0.08)",
    transition: performantSpringConfigs.luxurious
  }
};

// Performance utilities
export const performanceUtils = {
  // Check if device prefers reduced motion
  prefersReducedMotion: () => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // GPU layer optimization
  forceGPULayer: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform'
  },
  
  // Clean up will-change
  cleanupGPULayer: {
    willChange: 'auto'
  }
};
