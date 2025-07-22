
import * as React from "react"

// Device category types
export type DeviceCategory = 'smallMobile' | 'standardMobile' | 'largeMobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceCategory: DeviceCategory;
  screenSize: { width: number; height: number };
  touchDevice: boolean;
  hasNotch: boolean;
  isInitialized: boolean;
}

// Enhanced breakpoints with better edge case handling
const BREAKPOINTS = {
  smallMobile: { min: 0, max: 375 },
  standardMobile: { min: 375, max: 414 },
  largeMobile: { min: 414, max: 430 },
  tablet: { min: 430, max: 768 },
  desktop: { min: 768, max: Infinity }
};

const getDeviceCategory = (width: number): DeviceCategory => {
  // Handle exact breakpoint values properly
  if (width < 375) return 'smallMobile';
  if (width < 414) return 'standardMobile';  
  if (width < 430) return 'largeMobile';
  if (width < 768) return 'tablet';
  return 'desktop';
};

const detectDevice = (): DeviceInfo => {
  // Server-side or initial render - default to mobile-first
  if (typeof window === 'undefined') {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      deviceCategory: 'standardMobile',
      screenSize: { width: 375, height: 667 },
      touchDevice: true,
      hasNotch: false,
      isInitialized: false
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Enhanced notch detection
  const hasNotch = CSS.supports('padding-top: env(safe-area-inset-top)') && 
                  (window.screen.height >= 812 || height >= 812) && 
                  width <= 430;

  const deviceCategory = getDeviceCategory(width);
  const isMobile = ['smallMobile', 'standardMobile', 'largeMobile'].includes(deviceCategory);
  const isTablet = deviceCategory === 'tablet';
  const isDesktop = deviceCategory === 'desktop';

  // Enhanced debugging for real device testing
  console.log('📱 Device Detection Details:', {
    width,
    height,
    deviceCategory,
    isMobile,
    isTablet,
    isDesktop,
    touchDevice,
    hasNotch,
    userAgent: navigator.userAgent.substring(0, 50),
    viewport: `${width}x${height}`,
    pixelRatio: window.devicePixelRatio
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceCategory,
    screenSize: { width, height },
    touchDevice,
    hasNotch,
    isInitialized: true
  };
};

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(() => detectDevice());

  React.useEffect(() => {
    // Immediate detection on mount
    const initialDetection = detectDevice();
    setDeviceInfo(initialDetection);

    const updateDeviceInfo = () => {
      const newInfo = detectDevice();
      setDeviceInfo(newInfo);
    };

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDeviceInfo, 100);
    };

    // Orientation change with delay
    const handleOrientationChange = () => {
      setTimeout(updateDeviceInfo, 200);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

// Helper hook for responsive sizing with enhanced mobile support
export function useResponsiveSize() {
  const { deviceCategory } = useDeviceInfo();
  
  return React.useMemo(() => ({
    containerPadding: deviceCategory === 'smallMobile' ? 'px-3 safe-area-inset' : 
                     deviceCategory === 'standardMobile' ? 'px-4 safe-area-inset' : 
                     deviceCategory === 'largeMobile' ? 'px-4 safe-area-inset' : 'px-6',
    
    buttonSize: deviceCategory === 'smallMobile' ? 'text-sm py-3 px-4 touch-target' :
                deviceCategory === 'standardMobile' ? 'text-sm py-3.5 px-4 touch-target' :
                deviceCategory === 'largeMobile' ? 'text-base py-3.5 px-5 touch-target' :
                'text-base py-4 px-6',
    
    cardSpacing: deviceCategory === 'smallMobile' ? 'gap-3' :
                 deviceCategory === 'standardMobile' ? 'gap-4' :
                 'gap-6',
    
    textSize: {
      xs: deviceCategory === 'smallMobile' ? 'text-xs' : 'text-sm',
      sm: deviceCategory === 'smallMobile' ? 'text-sm' : 'text-base',
      base: deviceCategory === 'smallMobile' ? 'text-base' : 'text-lg',
      lg: deviceCategory === 'smallMobile' ? 'text-lg' : 'text-xl',
      xl: deviceCategory === 'smallMobile' ? 'text-xl' : 'text-2xl'
    },

    mobilePadding: {
      xs: deviceCategory === 'smallMobile' ? 'p-2' : 'p-3',
      sm: deviceCategory === 'smallMobile' ? 'p-3' : 'p-4',
      md: deviceCategory === 'smallMobile' ? 'p-4' : 'p-6',
      lg: deviceCategory === 'smallMobile' ? 'p-6' : 'p-8'
    }
  }), [deviceCategory]);
}
