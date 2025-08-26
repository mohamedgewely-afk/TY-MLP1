
import { Variants, Transition } from 'framer-motion';

interface DeviceCapabilities {
  isMobile: boolean;
  isSlowScroll: boolean;
  prefersReducedMotion: boolean;
}

export const createAdaptiveVariants = (capabilities: DeviceCapabilities): Record<string, Variants> => {
  const { isMobile, isSlowScroll, prefersReducedMotion } = capabilities;

  // Base timing configurations
  const fastTiming = { duration: 0.3, ease: "easeOut" };
  const mediumTiming = { duration: 0.6, ease: "easeInOut" };
  const slowTiming = { duration: 0.8, ease: "easeInOut" };

  // Choose timing based on device and scroll speed
  const baseTiming = prefersReducedMotion 
    ? fastTiming 
    : isMobile 
      ? (isSlowScroll ? mediumTiming : fastTiming)
      : slowTiming;

  const staggerDelay = isMobile ? 0.08 : 0.15;
  const initialDelay = isMobile ? 0.1 : 0.3;

  return {
    fadeInUp: {
      hidden: { 
        opacity: 0, 
        y: isMobile ? 30 : 60,
        scale: isMobile ? 0.98 : 0.97,
        transform: `translate3d(0, ${isMobile ? 30 : 60}px, 0) scale(${isMobile ? 0.98 : 0.97})`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    fadeInScale: {
      hidden: { 
        opacity: 0, 
        scale: isMobile ? 0.95 : 0.9,
        transform: `translate3d(0, 0, 0) scale(${isMobile ? 0.95 : 0.9})`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    slideInLeft: {
      hidden: { 
        opacity: 0, 
        x: isMobile ? -40 : -80,
        transform: `translate3d(${isMobile ? -40 : -80}px, 0, 0)`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    slideInRight: {
      hidden: { 
        opacity: 0, 
        x: isMobile ? 40 : 80,
        transform: `translate3d(${isMobile ? 40 : 80}px, 0, 0)`,
        willChange: 'transform, opacity'
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        transition: baseTiming
      }
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
          ease: "easeOut"
        }
      }
    }
  };
};

export const createAdaptiveMicroAnimations = (capabilities: DeviceCapabilities) => {
  const { isMobile, prefersReducedMotion } = capabilities;

  if (prefersReducedMotion) {
    return {
      luxuryHover: { transition: { duration: 0.1 } },
      buttonHover: { transition: { duration: 0.1 } }
    };
  }

  return {
    luxuryHover: {
      scale: isMobile ? 1.01 : 1.015,
      y: isMobile ? -1 : -3,
      transform: `translate3d(0, ${isMobile ? -1 : -3}px, 0) scale(${isMobile ? 1.01 : 1.015})`,
      boxShadow: isMobile 
        ? "0 8px 15px -3px rgba(0, 0, 0, 0.06)" 
        : "0 15px 20px -5px rgba(0, 0, 0, 0.08)",
      transition: { duration: isMobile ? 0.2 : 0.3, ease: "easeOut" }
    },
    buttonHover: {
      scale: isMobile ? 1.01 : 1.02,
      y: isMobile ? -1 : -2,
      transform: `translate3d(0, ${isMobile ? -1 : -2}px, 0) scale(${isMobile ? 1.01 : 1.02})`,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };
};
