
import { useState, useEffect, useCallback } from 'react';

interface NetworkInfo {
  isOnline: boolean;
  effectiveType: string;
  saveData: boolean;
  downlink: number;
  rtt: number;
}

export const useNetworkAware = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine,
    effectiveType: 'unknown',
    saveData: false,
    downlink: 0,
    rtt: 0
  });

  const updateNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    setNetworkInfo({
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      saveData: connection?.saveData || false,
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    });
  }, []);

  useEffect(() => {
    updateNetworkInfo();

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();
    const handleConnectionChange = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateNetworkInfo]);

  const getOptimalImageQuality = useCallback(() => {
    if (networkInfo.saveData) return 'low';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'high';
    }
  }, [networkInfo]);

  const shouldPreloadContent = useCallback(() => {
    return networkInfo.isOnline && 
           !networkInfo.saveData && 
           ['3g', '4g'].includes(networkInfo.effectiveType);
  }, [networkInfo]);

  return {
    networkInfo,
    getOptimalImageQuality,
    shouldPreloadContent,
    isSlowConnection: ['slow-2g', '2g'].includes(networkInfo.effectiveType),
    isFastConnection: networkInfo.effectiveType === '4g'
  };
};
