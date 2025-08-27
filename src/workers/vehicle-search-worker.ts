
// Web Worker for heavy vehicle search and filtering operations
// This moves 1.3s+ of main-thread work to background thread

interface VehicleSearchMessage {
  id: string;
  type: 'SEARCH_VEHICLES' | 'FILTER_VEHICLES' | 'PROCESS_RECOMMENDATIONS';
  data: any;
}

interface VehicleSearchResponse {
  id: string;
  result?: any;
  error?: string;
}

// Vehicle data processing functions
const searchVehicles = (vehicles: any[], searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(term) ||
    vehicle.description.toLowerCase().includes(term) ||
    vehicle.category.toLowerCase().includes(term)
  );
};

const filterVehicles = (vehicles: any[], filters: any) => {
  return vehicles.filter(vehicle => {
    if (filters.category && vehicle.category !== filters.category) return false;
    if (filters.priceRange && (vehicle.price < filters.priceRange.min || vehicle.price > filters.priceRange.max)) return false;
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    return true;
  });
};

const processRecommendations = (userPreferences: any, vehicles: any[]) => {
  // Complex algorithm to calculate personalized recommendations
  return vehicles
    .map(vehicle => ({
      ...vehicle,
      score: calculateRelevanceScore(vehicle, userPreferences)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

const calculateRelevanceScore = (vehicle: any, preferences: any): number => {
  let score = 0;
  
  // Category preference
  if (preferences.preferredCategory === vehicle.category) score += 30;
  
  // Price range preference
  if (vehicle.price >= preferences.budgetMin && vehicle.price <= preferences.budgetMax) score += 25;
  
  // Fuel efficiency preference
  if (preferences.ecoFriendly && vehicle.fuelType === 'hybrid') score += 20;
  
  // Size preference
  if (preferences.familySize === 'large' && vehicle.seating >= 7) score += 15;
  if (preferences.familySize === 'small' && vehicle.seating <= 5) score += 15;
  
  // Usage pattern
  if (preferences.usage === 'city' && vehicle.category === 'compact') score += 10;
  if (preferences.usage === 'highway' && vehicle.category === 'suv') score += 10;
  
  return score;
};

// Worker message handler
self.onmessage = (event: MessageEvent<VehicleSearchMessage>) => {
  const { id, type, data } = event.data;
  
  try {
    let result;
    
    switch (type) {
      case 'SEARCH_VEHICLES':
        result = searchVehicles(data.vehicles, data.searchTerm);
        break;
        
      case 'FILTER_VEHICLES':
        result = filterVehicles(data.vehicles, data.filters);
        break;
        
      case 'PROCESS_RECOMMENDATIONS':
        result = processRecommendations(data.preferences, data.vehicles);
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    const response: VehicleSearchResponse = { id, result };
    self.postMessage(response);
    
  } catch (error) {
    const response: VehicleSearchResponse = { 
      id, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
    self.postMessage(response);
  }
};

// Export for TypeScript
export {};
