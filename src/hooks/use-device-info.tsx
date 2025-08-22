import * as React from "react"

// Enhanced device category types with laptop and large desktop support
export type DeviceCategory = 'smallMobile' | 'standardMobile' | 'largeMobile' | 'extraLargeMobile' | 'tablet' | 'laptop' | 'largeDesktop';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceCategory: DeviceCategory;
  screenSize: { width: number; height: number };
  touchDevice: boolean;
  hasNotch: boolean;
  isInitialized: boolean;
  deviceModel?: string;
  isIPhone?: boolean;
}

// Enhanced breakpoints to cover ALL modern devices including laptops and large desktops
const BREAKPOINTS = {
  smallMobile: { min: 0, max: 360 },        // Very small phones
  standardMobile: { min: 360, max: 390 },   // iPhone 12 mini, 13 mini, standard phones
  largeMobile: { min: 390, max: 430 },      // iPhone 12, 13, 14 Pro, most modern phones
  extraLargeMobile: { min: 430, max: 600 }, // iPhone 14 Pro Max, Plus models, fold phones
  tablet: { min: 600, max: 1024 },          // Tablets
  laptop: { min: 1024, max: 1400 },         // Laptops 13"-15"
  largeDesktop: { min: 1400, max: Infinity } // Large desktops 17"+
};

const getDeviceCategory = (width: number): DeviceCategory => {
  if (width < 360) return 'smallMobile';
  if (width < 390) return 'standardMobile';  
  if (width < 430) return 'largeMobile';
  if (width < 600) return 'extraLargeMobile';
  if (width < 1024) return 'tablet';
  if (width < 1400) return 'laptop';
  return 'largeDesktop';
};

// Enhanced iPhone detection
const detectiPhone = (): { isIPhone: boolean; deviceModel: string } => {
  if (typeof window === 'undefined') return { isIPhone: false, deviceModel: 'unknown' };
  
  const userAgent = navigator.userAgent;
  const isIPhone = /iPhone/.test(userAgent);
  
  let deviceModel = 'unknown';
  if (isIPhone) {
    // Detect iPhone model based on screen dimensions and user agent
    const { width, height } = window.screen;
    const viewport = Math.min(window.innerWidth, window.innerHeight);
    
    if (viewport <= 320) deviceModel = 'iPhone SE/5s';
    else if (viewport <= 375 && height <= 667) deviceModel = 'iPhone 6/7/8';
    else if (viewport <= 375 && height > 800) deviceModel = 'iPhone 12 mini/13 mini';
    else if (viewport <= 390) deviceModel = 'iPhone 12/13 Pro';
    else if (viewport <= 414) deviceModel = 'iPhone 6 Plus/7 Plus/8 Plus';
    else if (viewport <= 430) deviceModel = 'iPhone 14 Pro Max/15 Pro Max';
    else deviceModel = `iPhone (${viewport}px)`;
  }
  
  return { isIPhone, deviceModel };
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
      isInitialized: false,
      isIPhone: false,
      deviceModel: 'unknown'
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const { isIPhone, deviceModel } = detectiPhone();
  
  // Enhanced notch detection for all large phones
  const hasNotch = CSS.supports('padding-top: env(safe-area-inset-top)') && 
                  (window.screen.height >= 812 || height >= 812) && 
                  width <= 500;

  const deviceCategory = getDeviceCategory(width);
  
  // Enhanced mobile/desktop detection
  const isMobile = ['smallMobile', 'standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory);
  const isTablet = deviceCategory === 'tablet';
  const isDesktop = ['laptop', 'largeDesktop'].includes(deviceCategory);

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceCategory,
    screenSize: { width, height },
    touchDevice,
    hasNotch,
    isInitialized: true,
    isIPhone,
    deviceModel
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
      setDeviceInfo(prev => {
        // Only update if there's a meaningful change
        if (prev.deviceCategory !== newInfo.deviceCategory || 
            prev.screenSize.width !== newInfo.screenSize.width ||
            prev.isInitialized !== newInfo.isInitialized) {
          return newInfo;
        }
        return prev;
      });
    };

    // Optimized resize handler with throttling
    let timeoutId: NodeJS.Timeout;
    let lastWidth = window.innerWidth;
    
    const throttledResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - lastWidth) > 10) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateDeviceInfo();
          lastWidth = currentWidth;
        }, 150);
      }
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        const newInfo = detectDevice();
        setDeviceInfo(newInfo);
      }, 300);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && deviceInfo.isMobile) {
        setTimeout(updateDeviceInfo, 100);
      }
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return deviceInfo;
}

// Enhanced helper hook for responsive sizing with laptop and large desktop support
export function useResponsiveSize() {
  const { deviceCategory } = useDeviceInfo();
  
  return React.useMemo(() => ({
    containerPadding: deviceCategory === 'smallMobile' ? 'px-3 safe-area-inset' : 
                     deviceCategory === 'standardMobile' ? 'px-4 safe-area-inset' :
                     ['largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'px-4 safe-area-inset' : 
                     deviceCategory === 'tablet' ? 'px-6 safe-area-inset' : 
                     deviceCategory === 'laptop' ? 'px-8' : 'px-10',
    
    buttonSize: deviceCategory === 'smallMobile' ? 'text-sm py-2.5 px-3 min-h-[44px] min-w-[44px]' :
                deviceCategory === 'standardMobile' ? 'text-sm py-3 px-4 min-h-[44px] min-w-[44px]' :
                ['largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-sm py-3.5 px-4 min-h-[48px] min-w-[48px]' :
                deviceCategory === 'tablet' ? 'text-base py-4 px-6 min-h-[48px] min-w-[48px]' : 
                deviceCategory === 'laptop' ? 'text-base py-4 px-8 min-h-[52px] min-w-[52px]' : 'text-lg py-5 px-10 min-h-[56px] min-w-[56px]',
    
    cardSpacing: ['smallMobile', 'standardMobile'].includes(deviceCategory) ? 'gap-3' :
                 ['largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'gap-4' : 
                 deviceCategory === 'tablet' ? 'gap-6' : 
                 deviceCategory === 'laptop' ? 'gap-8' : 'gap-10',
    
    textSize: {
      xs: deviceCategory === 'smallMobile' ? 'text-xs' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-sm' : 
          deviceCategory === 'tablet' ? 'text-sm' :
          deviceCategory === 'laptop' ? 'text-base' : 'text-lg',
      sm: deviceCategory === 'smallMobile' ? 'text-sm' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-base' : 
          deviceCategory === 'tablet' ? 'text-base' :
          deviceCategory === 'laptop' ? 'text-lg' : 'text-xl',
      base: deviceCategory === 'smallMobile' ? 'text-base' : 
            ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-lg' : 
            deviceCategory === 'tablet' ? 'text-lg' :
            deviceCategory === 'laptop' ? 'text-xl' : 'text-2xl',
      lg: deviceCategory === 'smallMobile' ? 'text-lg' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-xl' : 
          deviceCategory === 'tablet' ? 'text-xl' :
          deviceCategory === 'laptop' ? 'text-2xl' : 'text-3xl',
      xl: deviceCategory === 'smallMobile' ? 'text-xl' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'text-2xl' : 
          deviceCategory === 'tablet' ? 'text-2xl' :
          deviceCategory === 'laptop' ? 'text-3xl' : 'text-4xl'
    },

    mobilePadding: {
      xs: deviceCategory === 'smallMobile' ? 'p-2' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'p-2' : 
          deviceCategory === 'tablet' ? 'p-3' :
          deviceCategory === 'laptop' ? 'p-4' : 'p-5',
      sm: deviceCategory === 'smallMobile' ? 'p-3' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'p-3' : 
          deviceCategory === 'tablet' ? 'p-4' :
          deviceCategory === 'laptop' ? 'p-6' : 'p-8',
      md: deviceCategory === 'smallMobile' ? 'p-4' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'p-4' : 
          deviceCategory === 'tablet' ? 'p-6' :
          deviceCategory === 'laptop' ? 'p-8' : 'p-10',
      lg: deviceCategory === 'smallMobile' ? 'p-5' : 
          ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'p-6' : 
          deviceCategory === 'tablet' ? 'p-8' :
          deviceCategory === 'laptop' ? 'p-10' : 'p-12'
    },

    // Enhanced responsive utilities with laptop and large desktop support
    imageHeight: deviceCategory === 'smallMobile' ? 'h-36' :
                 deviceCategory === 'standardMobile' ? 'h-40' :
                 ['largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'h-48' : 
                 deviceCategory === 'tablet' ? 'h-56' : 
                 deviceCategory === 'laptop' ? 'h-64' : 'h-72',
    
    touchTarget: deviceCategory === 'smallMobile' ? 'min-h-[44px] min-w-[44px]' :
                 ['standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'min-h-[48px] min-w-[48px]' :
                 deviceCategory === 'tablet' ? 'min-h-[52px] min-w-[52px]' :
                 'min-h-[56px] min-w-[56px]',
    
    maxWidth: deviceCategory === 'smallMobile' ? 'max-w-xs' :
              deviceCategory === 'standardMobile' ? 'max-w-sm' :
              ['largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 'max-w-md' : 
              deviceCategory === 'tablet' ? 'max-w-2xl' : 
              deviceCategory === 'laptop' ? 'max-w-4xl' : 'max-w-6xl'
  }), [deviceCategory]);
}
