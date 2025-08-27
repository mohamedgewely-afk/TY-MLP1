
import { Variants, Transition } from 'framer-motion';

// Simplified, high-performance spring configurations
export const performantSpringConfigs = {
  // Fast, lightweight animations
  fast: {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 0.5
  },
  // Smooth, balanced animations
  smooth: {
    type: "spring",
    stiffness: 150,
    damping: 18,
    mass: 0.7
  },
  // Gentle, elegant animations
  gentle: {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 0.8
  }
} as const;

// Optimized animation variants with reduced complexity
export const performantVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: performantSpringConfigs.smooth
    }
  },
  fadeInScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: performantSpringConfigs.gentle
    }
  },
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -30,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: performantSpringConfigs.smooth
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: "easeOut"
      }
    }
  }
};

// Simplified micro-animations
export const performantMicroAnimations = {
  buttonHover: {
    scale: 1.02,
    transition: performantSpringConfigs.fast
  },
  cardHover: {
    y: -4,
    scale: 1.01,
    transition: performantSpringConfigs.smooth
  }
};

// Performance utilities
export const performanceUtils = {
  // Check if device prefers reduced motion
  prefersReducedMotion: () => 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // Minimal GPU optimization
  forceGPULayer: {
    willChange: 'transform'
  },
  
  // Clean up will-change
  cleanupGPULayer: {
    willChange: 'auto'
  }
};
