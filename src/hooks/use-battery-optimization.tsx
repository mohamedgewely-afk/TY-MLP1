
import { useState, useEffect, useCallback } from 'react';

interface BatteryManager {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

export const useBatteryOptimization = () => {
  const [batteryInfo, setBatteryInfo] = useState({
    isLowBattery: false,
    isCharging: false,
    level: 1,
    shouldOptimize: false
  });

  const updateBatteryInfo = useCallback((battery: BatteryManager) => {
    const isLowBattery = battery.level < 0.2; // Below 20%
    const shouldOptimize = isLowBattery && !battery.charging;
    
    setBatteryInfo({
      isLowBattery,
      isCharging: battery.charging,
      level: battery.level,
      shouldOptimize
    });
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: BatteryManager) => {
        updateBatteryInfo(battery);

        const handleBatteryChange = () => updateBatteryInfo(battery);
        
        battery.addEventListener('chargingchange', handleBatteryChange);
        battery.addEventListener('levelchange', handleBatteryChange);

        return () => {
          battery.removeEventListener('chargingchange', handleBatteryChange);
          battery.removeEventListener('levelchange', handleBatteryChange);
        };
      });
    }
  }, [updateBatteryInfo]);

  const getOptimizedAnimationConfig = useCallback(() => {
    if (batteryInfo.shouldOptimize) {
      return {
        duration: 0.1, // Faster animations
        complexity: 'minimal' as const,
        reduceAnimations: true
      };
    }
    return {
      duration: 0.3,
      complexity: 'standard' as const,
      reduceAnimations: false
    };
  }, [batteryInfo.shouldOptimize]);

  return {
    batteryInfo,
    getOptimizedAnimationConfig,
    shouldReduceAnimations: batteryInfo.shouldOptimize
  };
};
