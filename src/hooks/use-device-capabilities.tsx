
import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  supportsHaptics: boolean;
  batteryLevel: number | null;
  isLowPowerMode: boolean;
  connectionType: string;
  isSlowConnection: boolean;
  prefersReducedMotion: boolean;
}

export const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsHaptics: false,
    batteryLevel: null,
    isLowPowerMode: false,
    connectionType: 'unknown',
    isSlowConnection: false,
    prefersReducedMotion: false
  });

  useEffect(() => {
    const updateCapabilities = async () => {
      // Check for haptics support
      const supportsHaptics = 'vibrate' in navigator;

      // Check battery status
      let batteryLevel = null;
      let isLowPowerMode = false;
      
      try {
        // @ts-ignore - Battery API might not be available in all browsers
        const battery = await navigator.getBattery?.();
        if (battery) {
          batteryLevel = battery.level;
          isLowPowerMode = battery.level < 0.2;
        }
      } catch (error) {
        // Battery API not available
      }

      // Check connection type
      // @ts-ignore - Connection API might not be available
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || 'unknown';
      const isSlowConnection = ['slow-2g', '2g'].includes(connectionType);

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setCapabilities({
        supportsHaptics,
        batteryLevel,
        isLowPowerMode,
        connectionType,
        isSlowConnection,
        prefersReducedMotion
      });
    };

    updateCapabilities();

    // Listen for connection changes
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateCapabilities);
      return () => connection.removeEventListener('change', updateCapabilities);
    }
  }, []);

  return capabilities;
};
