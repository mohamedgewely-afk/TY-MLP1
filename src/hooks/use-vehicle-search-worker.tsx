
import { useCallback, useRef, useEffect } from 'react';

interface UseVehicleSearchWorkerReturn {
  searchVehicles: (vehicles: any[], query: string) => Promise<any[]>;
  filterVehicles: (vehicles: any[], filters: any) => Promise<any[]>;
  sortVehicles: (vehicles: any[], sortBy: string, sortOrder: 'asc' | 'desc') => Promise<any[]>;
  isWorkerSupported: boolean;
}

export const useVehicleSearchWorker = (): UseVehicleSearchWorkerReturn => {
  const workerRef = useRef<Worker | null>(null);
  const taskIdRef = useRef(0);
  const pendingTasks = useRef<Map<number, { resolve: Function; reject: Function }>>(new Map());

  const isWorkerSupported = typeof Worker !== 'undefined';

  useEffect(() => {
    if (!isWorkerSupported) return;

    // Initialize worker
    try {
      workerRef.current = new Worker(
        new URL('../workers/vehicle-search-worker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (event) => {
        const { type, payload } = event.data;
        const taskId = event.data.taskId;
        
        const task = pendingTasks.current.get(taskId);
        if (task) {
          pendingTasks.current.delete(taskId);
          
          if (type === 'ERROR') {
            task.reject(new Error(payload.message));
          } else {
            task.resolve(payload);
          }
        }
      };

      workerRef.current.onerror = (error) => {
        console.error('Web Worker error:', error);
        // Reject all pending tasks
        pendingTasks.current.forEach(task => {
          task.reject(new Error('Worker error'));
        });
        pendingTasks.current.clear();
      };
    } catch (error) {
      console.warn('Failed to initialize Web Worker:', error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      pendingTasks.current.clear();
    };
  }, [isWorkerSupported]);

  const postMessage = useCallback(
    <T = any>(type: string, payload: any): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          // Fallback to synchronous execution if worker not available
          reject(new Error('Worker not available'));
          return;
        }

        const taskId = ++taskIdRef.current;
        pendingTasks.current.set(taskId, { resolve, reject });

        workerRef.current.postMessage({
          type,
          payload,
          taskId
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (pendingTasks.current.has(taskId)) {
            pendingTasks.current.delete(taskId);
            reject(new Error('Worker task timeout'));
          }
        }, 10000);
      });
    },
    []
  );

  const searchVehicles = useCallback(
    async (vehicles: any[], query: string): Promise<any[]> => {
      if (!isWorkerSupported || !workerRef.current) {
        // Fallback to main thread
        const normalizedQuery = query.toLowerCase().trim();
        return vehicles.filter(vehicle =>
          vehicle.name.toLowerCase().includes(normalizedQuery) ||
          vehicle.category.toLowerCase().includes(normalizedQuery)
        );
      }

      return postMessage('SEARCH_VEHICLES', { vehicles, query });
    },
    [postMessage, isWorkerSupported]
  );

  const filterVehicles = useCallback(
    async (vehicles: any[], filters: any): Promise<any[]> => {
      if (!isWorkerSupported || !workerRef.current) {
        // Fallback to main thread
        return vehicles.filter(vehicle => {
          if (filters.category && filters.category !== 'all') {
            if (vehicle.category !== filters.category) return false;
          }
          return true;
        });
      }

      return postMessage('FILTER_VEHICLES', { vehicles, filters });
    },
    [postMessage, isWorkerSupported]
  );

  const sortVehicles = useCallback(
    async (vehicles: any[], sortBy: string, sortOrder: 'asc' | 'desc'): Promise<any[]> => {
      if (!isWorkerSupported || !workerRef.current) {
        // Fallback to main thread
        return [...vehicles].sort((a, b) => {
          const comparison = sortBy === 'price' ? a.price - b.price : a.name.localeCompare(b.name);
          return sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      return postMessage('SORT_VEHICLES', { vehicles, sortBy, sortOrder });
    },
    [postMessage, isWorkerSupported]
  );

  return {
    searchVehicles,
    filterVehicles,
    sortVehicles,
    isWorkerSupported
  };
};
