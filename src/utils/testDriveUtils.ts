
import { VehicleModel } from "@/types/vehicle";

/**
 * Opens the Toyota test drive form in a new popup window
 * @param vehicle - The vehicle object to get model name from
 * @param fallbackModelName - Fallback model name if vehicle is not available
 */
export const openTestDrivePopup = (vehicle?: VehicleModel, fallbackModelName?: string) => {
  // Default model name if none provided
  const defaultModelName = "amuty0124-2025";
  
  // Determine model name from vehicle or use fallback
  let modelName = defaultModelName;
  if (vehicle?.name) {
    // Convert vehicle name to a URL-friendly format
    modelName = vehicle.name.toLowerCase().replace(/\s+/g, '-') + "-2025";
  } else if (fallbackModelName) {
    modelName = fallbackModelName;
  }

  const testDriveUrl = `https://www.toyota.ae/en/testdrive/?modelName=${modelName}`;
  
  try {
    // Open in a new popup window
    const popup = window.open(
      testDriveUrl,
      'toyota-test-drive',
      'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    // Focus the popup if it opened successfully
    if (popup) {
      popup.focus();
    }
  } catch (error) {
    // Fallback: open in new tab if popup is blocked
    window.open(testDriveUrl, '_blank');
  }
};
