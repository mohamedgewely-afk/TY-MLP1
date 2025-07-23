
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
  }
};

export const addHapticToButton = (element: HTMLElement, type: keyof typeof hapticFeedback = 'light') => {
  element.addEventListener('touchstart', () => {
    hapticFeedback[type]();
  }, { passive: true });
};

// Enhanced haptic integration with animation states
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

// Context-aware haptic feedback
export const contextualHaptic = {
  stepProgress: () => hapticFeedback.premiumConfirm(),
  optionSelect: () => hapticFeedback.luxuryPress(),
  swipeNavigation: () => hapticFeedback.elegantSwipe(),
  configComplete: () => hapticFeedback.luxuryComplete(),
  invalidAction: () => hapticFeedback.premiumError(),
  hoverFeedback: () => hapticFeedback.sophisticatedHover()
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
