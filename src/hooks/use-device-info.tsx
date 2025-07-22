
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

// Breakpoints for different device categories
const BREAKPOINTS = {
  smallMobile: { min: 0, max: 375 },
  standardMobile: { min: 375, max: 414 },
  largeMobile: { min: 414, max: 430 },
  tablet: { min: 430, max: 768 },
  desktop: { min: 768, max: Infinity }
};

// Initial mobile-first state to prevent hydration mismatches
const getInitialState = (): DeviceInfo => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      isMobile: true, // Default to mobile for SSR
      isTablet: false,
      isDesktop: false,
      deviceCategory: 'standardMobile',
      screenSize: { width: 375, height: 667 },
      touchDevice: true,
      hasNotch: false,
      isInitialized: false
    };
  }

  // Get actual dimensions immediately if available
  const width = window.innerWidth;
  const height = window.innerHeight;
  const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Detect notch/dynamic island (iPhone X and newer)
  const hasNotch = CSS.supports('padding-top: env(safe-area-inset-top)') && 
                  window.screen.height >= 812 && 
                  width <= 430;

  let deviceCategory: DeviceCategory = 'desktop';
  
  if (width <= BREAKPOINTS.smallMobile.max) {
    deviceCategory = 'smallMobile';
  } else if (width <= BREAKPOINTS.standardMobile.max) {
    deviceCategory = 'standardMobile';
  } else if (width <= BREAKPOINTS.largeMobile.max) {
    deviceCategory = 'largeMobile';
  } else if (width <= BREAKPOINTS.tablet.max) {
    deviceCategory = 'tablet';
  }

  const isMobile = deviceCategory === 'smallMobile' || deviceCategory === 'standardMobile' || deviceCategory === 'largeMobile';
  const isTablet = deviceCategory === 'tablet';
  const isDesktop = deviceCategory === 'desktop';

  console.log('🔍 Device Detection:', { width, deviceCategory, isMobile, touchDevice });

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
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(getInitialState);

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect notch/dynamic island (iPhone X and newer)
      const hasNotch = CSS.supports('padding-top: env(safe-area-inset-top)') && 
                      window.screen.height >= 812 && 
                      width <= 430;

      let deviceCategory: DeviceCategory = 'desktop';
      
      if (width <= BREAKPOINTS.smallMobile.max) {
        deviceCategory = 'smallMobile';
      } else if (width <= BREAKPOINTS.standardMobile.max) {
        deviceCategory = 'standardMobile';
      } else if (width <= BREAKPOINTS.largeMobile.max) {
        deviceCategory = 'largeMobile';
      } else if (width <= BREAKPOINTS.tablet.max) {
        deviceCategory = 'tablet';
      }

      const isMobile = deviceCategory === 'smallMobile' || deviceCategory === 'standardMobile' || deviceCategory === 'largeMobile';
      const isTablet = deviceCategory === 'tablet';
      const isDesktop = deviceCategory === 'desktop';

      console.log('📱 Device Update:', { width, deviceCategory, isMobile, touchDevice });

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceCategory,
        screenSize: { width, height },
        touchDevice,
        hasNotch,
        isInitialized: true
      });
    };

    // Initial update
    updateDeviceInfo();
    
    const handleResize = () => updateDeviceInfo();
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(updateDeviceInfo, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

// Helper hook for responsive sizing
export function useResponsiveSize() {
  const { deviceCategory } = useDeviceInfo();
  
  return React.useMemo(() => ({
    containerPadding: deviceCategory === 'smallMobile' ? 'px-2' : 
                     deviceCategory === 'standardMobile' ? 'px-3' : 
                     deviceCategory === 'largeMobile' ? 'px-4' : 'px-6',
    
    buttonSize: deviceCategory === 'smallMobile' ? 'text-sm py-2.5 px-3' :
                deviceCategory === 'standardMobile' ? 'text-sm py-3 px-4' :
                'text-base py-3 px-6',
    
    cardSpacing: deviceCategory === 'smallMobile' ? 'gap-2' :
                 deviceCategory === 'standardMobile' ? 'gap-3' :
                 'gap-4',
    
    textSize: {
      xs: deviceCategory === 'smallMobile' ? 'text-xs' : 'text-sm',
      sm: deviceCategory === 'smallMobile' ? 'text-sm' : 'text-base',
      base: deviceCategory === 'smallMobile' ? 'text-base' : 'text-lg',
      lg: deviceCategory === 'smallMobile' ? 'text-lg' : 'text-xl',
      xl: deviceCategory === 'smallMobile' ? 'text-xl' : 'text-2xl'
    }
  }), [deviceCategory]);
}
