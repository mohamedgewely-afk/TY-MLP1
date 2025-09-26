import { Variants, Transition } from 'framer-motion';

// Luxury animation configurations
export const luxurySpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8
};

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1
};

export const quickSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 0.6
};

// Common animation variants
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxurySpring
  }
};

export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: smoothSpring
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -60
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: luxurySpring
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 60
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: luxurySpring
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: luxurySpring
  }
};

// Hover animations
export const luxuryHover = {
  scale: 1.02,
  y: -4,
  transition: quickSpring
};

export const buttonHover = {
  scale: 1.05,
  transition: quickSpring
};

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: smoothSpring
};

// Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: luxurySpring
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Responsive motion utilities
export const getResponsiveVariant = (isMobile: boolean, variant: Variants): Variants => {
  if (isMobile) {
    // Reduce motion intensity on mobile
    return Object.keys(variant).reduce((acc, key) => {
      const value = variant[key];
      if (typeof value === 'object' && value !== null) {
        acc[key] = {
          ...value,
          y: typeof value.y === 'number' ? value.y * 0.5 : value.y,
          x: typeof value.x === 'number' ? value.x * 0.5 : value.x,
          scale: typeof value.scale === 'number' ? 1 - (1 - value.scale) * 0.5 : value.scale
        };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Variants);
  }
  return variant;
};

// Accessibility-aware motion
export const getA11yVariant = (prefersReducedMotion: boolean, variant: Variants): Variants => {
  if (prefersReducedMotion) {
    return Object.keys(variant).reduce((acc, key) => {
      const value = variant[key];
      if (typeof value === 'object' && value !== null) {
        acc[key] = {
          opacity: value.opacity || 1,
          transition: { duration: 0.1 }
        };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Variants);
  }
  return variant;
};