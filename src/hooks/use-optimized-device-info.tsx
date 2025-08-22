
import { useState, useEffect, useMemo, useCallback } from 'react';

// Define types locally since we can't import from use-device-info
export type DeviceCategory = 'smallMobile' | 'standardMobile' | 'largeMobile' | 'extraLargeMobile' | 'tablet' | 'laptop' | 'largeDesktop';
export type DeviceModel = 'iPhoneMini' | 'iPhoneStandard' | 'iPhonePro' | 'iPhoneProMax' | 'iPad' | 'iPadPro' | 'android' | 'macbook' | 'windows' | 'unknown';

// Throttle function for performance
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const useOptimizedDeviceInfo = () => {
  const [screenSize, setScreenSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844
  }));

  const [isInitialized, setIsInitialized] = useState(false);

  // Throttled resize handler
  const handleResize = useMemo(
    () => throttle(() => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 150),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsInitialized(true);
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Memoized device detection
  const deviceInfo = useMemo(() => {
    const { width, height } = screenSize;
    const aspectRatio = width / height;
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    // Device model detection
    const isIPhone = /iPhone/.test(userAgent);
    const isIPad = /iPad/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMac = /Mac/.test(userAgent);
    const isWindows = /Windows/.test(userAgent);
    
    let deviceModel: DeviceModel = 'unknown';
    if (isIPhone) {
      if (width >= 414) deviceModel = 'iPhoneProMax';
      else if (width >= 390) deviceModel = 'iPhonePro';
      else if (width >= 375) deviceModel = 'iPhoneStandard';
      else deviceModel = 'iPhoneMini';
    } else if (isIPad) {
      deviceModel = width >= 1024 ? 'iPadPro' : 'iPad';
    } else if (isAndroid) {
      deviceModel = 'android';
    } else if (isMac) {
      deviceModel = 'macbook';
    } else if (isWindows) {
      deviceModel = 'windows';
    }

    // Device category detection
    let deviceCategory: DeviceCategory;
    if (width < 375) deviceCategory = 'smallMobile';
    else if (width < 430) deviceCategory = 'standardMobile';
    else if (width < 640) deviceCategory = 'largeMobile';
    else if (width < 768) deviceCategory = 'extraLargeMobile';
    else if (width < 1024) deviceCategory = 'tablet';
    else if (width < 1400) deviceCategory = 'laptop';
    else deviceCategory = 'largeDesktop';

    const isMobile = deviceCategory.includes('Mobile') || deviceCategory === 'smallMobile';
    const isTablet = deviceCategory === 'tablet' || deviceCategory === 'extraLargeMobile';

    return {
      screenSize,
      deviceCategory,
      deviceModel,
      isMobile,
      isTablet,
      isIPhone,
      isIPad,
      isAndroid,
      aspectRatio,
      isInitialized
    };
  }, [screenSize, isInitialized]);

  return deviceInfo;
};
