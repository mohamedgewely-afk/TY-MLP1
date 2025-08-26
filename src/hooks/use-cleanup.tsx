
import { useEffect, useRef, useCallback } from 'react';

interface CleanupFunction {
  (): void;
}

export const useCleanup = () => {
  const cleanupFunctions = useRef<CleanupFunction[]>([]);

  const addCleanup = useCallback((cleanupFn: CleanupFunction) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    cleanupFunctions.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { addCleanup, cleanup };
};
