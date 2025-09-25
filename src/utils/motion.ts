import { Variants, Transition } from 'framer-motion';

// Luxury automotive motion configurations
export const luxuryMotion = {
  // Cinematic entrance animations
  cinematic: {
    initial: { opacity: 0, y: 100, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 1.1 },
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Smooth fade transitions
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: "easeInOut" }
  },

  // Elegant slide animations
  slideUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Scale with depth
  scaleDepth: {
    initial: { opacity: 0, scale: 0.8, z: -100 },
    animate: { opacity: 1, scale: 1, z: 0 },
    exit: { opacity: 0, scale: 1.2, z: 100 },
    transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
  },

  // Stagger container for multiple elements
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  },

  // Individual stagger items
  staggerItem: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Premium spring configurations
export const luxurySprings = {
  gentle: { type: "spring", stiffness: 100, damping: 15, mass: 1 },
  responsive: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
  snappy: { type: "spring", stiffness: 300, damping: 25, mass: 0.6 },
  bouncy: { type: "spring", stiffness: 400, damping: 30, mass: 0.5 }
} as const;

// Hover animations for interactive elements
export const hoverAnimations = {
  lift: {
    whileHover: { y: -8, scale: 1.02 },
    transition: luxurySprings.responsive
  },
  
  glow: {
    whileHover: { 
      boxShadow: "0 20px 40px rgba(235, 10, 30, 0.3)",
      scale: 1.05 
    },
    transition: luxurySprings.gentle
  },
  
  tilt: {
    whileHover: { rotateY: 5, scale: 1.02 },
    transition: luxurySprings.responsive
  },
  
  expand: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: luxurySprings.snappy
  }
};

// Page transition variants
export const pageTransitions: Record<string, Variants> = {
  slideLeft: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  },
  
  slideRight: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 }
  },
  
  fadeScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  }
};

// Utility function to create reduced motion variants
export const createReducedMotionVariant = (
  normalVariant: any,
  reducedVariant?: any
) => {
  return {
    ...normalVariant,
    transition: {
      ...normalVariant.transition,
      duration: 0.1,
      ease: "linear"
    }
  };
};

// Scroll-triggered animation variants
export const scrollAnimations = {
  parallax: (offset: number = 0.5) => ({
    initial: { y: 0 },
    animate: { y: offset * -100 },
    transition: { ease: "linear" }
  }),
  
  reveal: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  staggerReveal: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Modal animation variants
export const modalAnimations = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 50 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};