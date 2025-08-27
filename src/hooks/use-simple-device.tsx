
import { useState, useEffect, useMemo } from 'react';

export const useSimpleDevice = () => {
  const [screenWidth, setScreenWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const deviceInfo = useMemo(() => ({
    isDesktop: screenWidth >= 1024,
    isTablet: screenWidth >= 768 && screenWidth < 1024,
    isMobile: screenWidth < 768,
    screenWidth,
  }), [screenWidth]);

  return deviceInfo;
};
