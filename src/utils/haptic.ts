
export const hapticFeedback = {
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
  }
};

export const addHapticToButton = (element: HTMLElement, type: keyof typeof hapticFeedback = 'light') => {
  element.addEventListener('touchstart', () => {
    hapticFeedback[type]();
  }, { passive: true });
};
