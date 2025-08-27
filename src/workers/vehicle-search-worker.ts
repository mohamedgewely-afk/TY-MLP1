
// Web Worker for heavy vehicle search and filtering operations
interface VehicleSearchMessage {
  type: 'SEARCH_VEHICLES' | 'FILTER_VEHICLES' | 'SORT_VEHICLES';
  payload: any;
}

interface VehicleSearchResponse {
  type: 'SEARCH_RESULT' | 'FILTER_RESULT' | 'SORT_RESULT' | 'ERROR';
  payload: any;
}

// Vehicle search logic moved to worker thread
const searchVehicles = (vehicles: any[], query: string) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return vehicles.filter(vehicle => {
    return (
      vehicle.name.toLowerCase().includes(normalizedQuery) ||
      vehicle.category.toLowerCase().includes(normalizedQuery) ||
      vehicle.fuelType?.toLowerCase().includes(normalizedQuery) ||
      vehicle.features?.some((feature: string) => 
        feature.toLowerCase().includes(normalizedQuery)
      )
    );
  });
};

// Vehicle filtering logic
const filterVehicles = (vehicles: any[], filters: any) => {
  return vehicles.filter(vehicle => {
    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (vehicle.category !== filters.category) return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (vehicle.price < min || vehicle.price > max) return false;
    }
    
    // Fuel type filter
    if (filters.fuelType && filters.fuelType !== 'all') {
      if (vehicle.fuelType !== filters.fuelType) return false;
    }
    
    // Transmission filter
    if (filters.transmission && filters.transmission !== 'all') {
      if (vehicle.transmission !== filters.transmission) return false;
    }
    
    return true;
  });
};

// Vehicle sorting logic
const sortVehicles = (vehicles: any[], sortBy: string, sortOrder: 'asc' | 'desc') => {
  return [...vehicles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'popularity':
        comparison = (b.popularity || 0) - (a.popularity || 0);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Message handler
self.onmessage = (event: MessageEvent<VehicleSearchMessage>) => {
  const { type, payload } = event.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'SEARCH_VEHICLES':
        result = searchVehicles(payload.vehicles, payload.query);
        self.postMessage({ type: 'SEARCH_RESULT', payload: result });
        break;
        
      case 'FILTER_VEHICLES':
        result = filterVehicles(payload.vehicles, payload.filters);
        self.postMessage({ type: 'FILTER_RESULT', payload: result });
        break;
        
      case 'SORT_VEHICLES':
        result = sortVehicles(payload.vehicles, payload.sortBy, payload.sortOrder);
        self.postMessage({ type: 'SORT_RESULT', payload: result });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      payload: { message: (error as Error).message } 
    });
  }
};
