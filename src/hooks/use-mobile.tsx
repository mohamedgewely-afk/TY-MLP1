
import { useDeviceInfo } from "./use-device-info";

// Updated backward compatibility hook that uses the enhanced device detection
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceInfo();
  return isMobile;
}
