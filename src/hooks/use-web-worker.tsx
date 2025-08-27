
import { useRef, useCallback, useEffect } from 'react';

interface UseWebWorkerOptions {
  timeout?: number;
}

interface WorkerTask {
  id: string;
  resolve: (result: any) => void;
  reject: (error: Error) => void;
  timeoutId?: NodeJS.Timeout;
}

export const useWebWorker = (workerUrl: string, options: UseWebWorkerOptions = {}) => {
  const workerRef = useRef<Worker | null>(null);
  const tasksRef = useRef<Map<string, WorkerTask>>(new Map());
  const { timeout = 30000 } = options;

  // Initialize worker
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker(new URL(workerUrl, import.meta.url));
        
        workerRef.current.onmessage = (event) => {
          const { id, result, error } = event.data;
          const task = tasksRef.current.get(id);
          
          if (task) {
            if (task.timeoutId) {
              clearTimeout(task.timeoutId);
            }
            tasksRef.current.delete(id);
            
            if (error) {
              task.reject(new Error(error));
            } else {
              task.resolve(result);
            }
          }
        };
        
        workerRef.current.onerror = (error) => {
          console.error('Web Worker error:', error);
          // Reject all pending tasks
          tasksRef.current.forEach(task => {
            if (task.timeoutId) {
              clearTimeout(task.timeoutId);
            }
            task.reject(new Error('Worker error'));
          });
          tasksRef.current.clear();
        };
      } catch (error) {
        console.warn('Web Worker not supported or failed to initialize');
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      // Clear all pending tasks
      tasksRef.current.forEach(task => {
        if (task.timeoutId) {
          clearTimeout(task.timeoutId);
        }
        task.reject(new Error('Worker terminated'));
      });
      tasksRef.current.clear();
    };
  }, [workerUrl]);

  const postMessage = useCallback(<T = any>(type: string, data: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not available'));
        return;
      }

      const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const timeoutId = setTimeout(() => {
        tasksRef.current.delete(id);
        reject(new Error('Worker task timeout'));
      }, timeout);

      const task: WorkerTask = {
        id,
        resolve,
        reject,
        timeoutId
      };

      tasksRef.current.set(id, task);
      
      workerRef.current.postMessage({
        id,
        type,
        data
      });
    });
  }, [timeout]);

  const isSupported = typeof Worker !== 'undefined';
  const isReady = workerRef.current !== null;

  return {
    postMessage,
    isSupported,
    isReady
  };
};
