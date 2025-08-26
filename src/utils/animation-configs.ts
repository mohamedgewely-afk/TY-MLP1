
import { Variants, Transition } from 'framer-motion';

// Physics-based spring configurations
export const springConfigs = {
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1
  },
  bouncy: {
    type: "spring",
    stiffness: 200,
    damping: 10,
    mass: 0.8
  },
  snappy: {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 0.5
  },
  smooth: {
    type: "spring",
    stiffness: 120,
    damping: 14,
    mass: 1
  }
} as const;

// Enhanced animation variants
export const enhancedVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: springConfigs.gentle
    }
  },
  fadeInScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: springConfigs.smooth
    }
  },
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -100,
      rotateY: -10
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: springConfigs.bouncy
    }
  },
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 100,
      rotateY: 10
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: springConfigs.bouncy
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
};

// Micro-interaction animations
export const microAnimations = {
  buttonPress: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  buttonHover: {
    scale: 1.05,
    y: -2,
    transition: springConfigs.snappy
  },
  cardHover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: springConfigs.gentle
  }
};
