
import { useWebWorker } from './use-web-worker';
import { useCallback } from 'react';

export const useVehicleSearchWorker = () => {
  const { postMessage, isSupported, isReady } = useWebWorker('/src/workers/vehicle-search-worker.ts');

  const searchVehicles = useCallback(async (vehicles: any[], searchTerm: string) => {
    if (!isReady) {
      // Fallback to main thread if worker not available
      return vehicles.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    try {
      const result = await postMessage('SEARCH_VEHICLES', { vehicles, searchTerm });
      return result;
    } catch (error) {
      // Fallback to main thread on error
      return vehicles.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [postMessage, isReady]);

  const filterVehicles = useCallback(async (vehicles: any[], filters: any) => {
    if (!isReady) {
      // Fallback filtering
      return vehicles.filter(vehicle => {
        if (filters.category && vehicle.category !== filters.category) return false;
        if (filters.priceRange && (vehicle.price < filters.priceRange.min || vehicle.price > filters.priceRange.max)) return false;
        return true;
      });
    }

    try {
      const result = await postMessage('FILTER_VEHICLES', { vehicles, filters });
      return result;
    } catch (error) {
      return vehicles; // Return all vehicles on error
    }
  }, [postMessage, isReady]);

  const processRecommendations = useCallback(async (userPreferences: any, vehicles: any[]) => {
    if (!isReady) {
      // Simple fallback recommendation
      return vehicles.slice(0, 6);
    }

    try {
      const result = await postMessage('PROCESS_RECOMMENDATIONS', { preferences: userPreferences, vehicles });
      return result;
    } catch (error) {
      return vehicles.slice(0, 6);
    }
  }, [postMessage, isReady]);

  return {
    searchVehicles,
    filterVehicles,
    processRecommendations,
    isWorkerSupported: isSupported,
    isWorkerReady: isReady
  };
};
