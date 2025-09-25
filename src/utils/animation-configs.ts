
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
  },
  // New luxurious spring configs for slower, premium animations
  luxurious: {
    type: "spring",
    stiffness: 60,
    damping: 18,
    mass: 1.2
  },
  cinematic: {
    type: "spring",
    stiffness: 80,
    damping: 22,
    mass: 1.4
  }
} as const;

// Enhanced animation variants
export const enhancedVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.95,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: springConfigs.luxurious
    }
  },
  fadeInScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      filter: 'blur(6px)',
      rotateY: -5
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      rotateY: 0,
      transition: springConfigs.cinematic
    }
  },
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: -120,
      rotateY: -15,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: springConfigs.luxurious
    }
  },
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: 120,
      rotateY: 15,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: springConfigs.luxurious
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4
      }
    }
  },
  // New cinematic stagger for storytelling sections
  cinematicStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.5,
        ease: "easeOut"
      }
    }
  }
};

// Micro-interaction animations
export const microAnimations = {
  buttonPress: {
    scale: 0.95,
    transition: { duration: 0.15 }
  },
  buttonHover: {
    scale: 1.05,
    y: -3,
    transition: springConfigs.luxurious
  },
  cardHover: {
    scale: 1.03,
    y: -6,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
    transition: springConfigs.cinematic
  },
  // New luxury hover effects
  luxuryHover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: springConfigs.luxurious
  }
};
