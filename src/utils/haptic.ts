
export const hapticFeedback = {
  // Basic feedback patterns
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  },
  
  // Enhanced contextual patterns
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 100]);
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  },
  
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },

  // Premium luxury patterns
  luxuryPress: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 60, 10, 30]);
    }
  },

  premiumConfirm: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 40, 30, 60]);
    }
  },

  elegantSwipe: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([15, 10, 25, 10, 15]);
    }
  },

  sophisticatedHover: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  luxuryComplete: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 70, 30, 50, 30, 100]);
    }
  },

  premiumError: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 80, 40, 80]);
    }
  },

  progressiveIntensity: (intensity: number) => {
    if ('vibrate' in navigator) {
      const basePattern = 30;
      const adjustedIntensity = Math.min(Math.max(intensity, 0.1), 3);
      navigator.vibrate(basePattern * adjustedIntensity);
    }
  },

  // New luxury patterns for enhanced experience
  cinematicEntry: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 150, 50, 200]);
    }
  },

  luxuryTransition: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 20, 60, 20, 40]);
    }
  },

  premiumSelection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 30, 10, 20]);
    }
  }
};

export const addHapticToButton = (element: HTMLElement, type: keyof typeof hapticFeedback = 'light') => {
  element.addEventListener('touchstart', () => {
    hapticFeedback[type]();
  }, { passive: true });
};

export const addLuxuryHapticToButton = (element: HTMLElement, options: {
  type?: keyof typeof hapticFeedback;
  onPress?: boolean;
  onRelease?: boolean;
  onHover?: boolean;
}) => {
  const { type = 'luxuryPress', onPress = true, onRelease = false, onHover = false } = options;

  if (onPress) {
    element.addEventListener('touchstart', () => {
      hapticFeedback[type]();
    }, { passive: true });
  }

  if (onRelease) {
    element.addEventListener('touchend', () => {
      hapticFeedback.selection();
    }, { passive: true });
  }

  if (onHover) {
    element.addEventListener('touchmove', () => {
      hapticFeedback.sophisticatedHover();
    }, { passive: true });
  }
};

// Performance optimized haptic with throttling
let lastHapticTime = 0;
const HAPTIC_THROTTLE = 50; // ms

export const throttledHaptic = (type: keyof typeof hapticFeedback) => {
  const now = Date.now();
  if (now - lastHapticTime > HAPTIC_THROTTLE) {
    hapticFeedback[type]();
    lastHapticTime = now;
  }
};

// Context-aware haptic feedback
export const contextualHaptic = {
  stepProgress: () => throttledHaptic('premiumConfirm'),
  optionSelect: () => throttledHaptic('luxuryPress'),
  swipeNavigation: () => throttledHaptic('elegantSwipe'),
  configComplete: () => throttledHaptic('luxuryComplete'),
  invalidAction: () => throttledHaptic('premiumError'),
  hoverFeedback: () => throttledHaptic('sophisticatedHover'),
  cinematicEntry: () => throttledHaptic('cinematicEntry'),
  luxuryTransition: () => throttledHaptic('luxuryTransition'),
  premiumSelection: () => throttledHaptic('premiumSelection'),
  resetAction: () => throttledHaptic('premiumError'),
  exitAction: () => throttledHaptic('luxuryPress')
};

// Enhanced haptic effects for luxury experience
export const luxuryHapticEffects = {
  onStepEnter: () => throttledHaptic('cinematicEntry'),
  onOptionHover: () => throttledHaptic('sophisticatedHover'),
  onSelectionMade: () => throttledHaptic('premiumSelection'),
  onTransition: () => throttledHaptic('luxuryTransition'),
  onComplete: () => throttledHaptic('luxuryComplete')
};

// Gesture-based haptic patterns
export const gestureHaptics = {
  swipeStart: () => hapticFeedback.selection(),
  swipeProgress: () => hapticFeedback.sophisticatedHover(),
  swipeComplete: () => hapticFeedback.elegantSwipe(),
  longPress: () => hapticFeedback.luxuryPress(),
  multiTouch: () => hapticFeedback.premiumConfirm()
};

// Animation-synchronized haptic feedback
export const animationHaptics = {
  fadeIn: () => throttledHaptic('selection'),
  scaleUp: () => hapticFeedback.luxuryPress(),
  slideTransition: () => hapticFeedback.elegantSwipe(),
  morphing: () => hapticFeedback.luxuryTransition(),
  completion: () => hapticFeedback.luxuryComplete()
};
