
import { useDeviceInfo } from "./use-device-info";

// Backward compatibility hook that maintains the original API
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceInfo();
  return isMobile;
}
