
// Performance Web Worker for heavy computations
interface WorkerMessage {
  id: string;
  type: 'VEHICLE_COMPARISON' | 'IMAGE_OPTIMIZATION' | 'RECOMMENDATION_ENGINE' | 'ANALYTICS_PROCESSING';
  data: any;
}

interface WorkerResponse {
  id: string;
  type: string;
  result?: any;
  error?: string;
}

// Vehicle comparison calculations
function calculateVehicleComparison(vehicles: any[]) {
  const metrics = ['price', 'fuelEfficiency', 'performance', 'safety', 'technology'];
  
  return vehicles.map(vehicle => {
    const scores = metrics.reduce((acc, metric) => {
      // Normalize scores to 0-100 scale
      let score = 0;
      switch (metric) {
        case 'price':
          score = Math.max(0, 100 - (vehicle.price / 1000)); // Lower price = higher score
          break;
        case 'fuelEfficiency':
          score = (vehicle.fuelEfficiency || 20) * 5; // MPG * 5
          break;
        case 'performance':
          score = Math.min(100, (vehicle.horsepower || 150) / 5); // HP / 5
          break;
        case 'safety':
          score = (vehicle.safetyRating || 4) * 20; // 5-star rating * 20
          break;
        case 'technology':
          score = (vehicle.techFeatures?.length || 5) * 10; // Features * 10
          break;
      }
      acc[metric] = Math.min(100, Math.max(0, score));
      return acc;
    }, {} as Record<string, number>);
    
    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / metrics.length;
    
    return {
      ...vehicle,
      comparisonScores: scores,
      overallScore: Math.round(overallScore)
    };
  });
}

// Image optimization calculations
function optimizeImageParameters(images: Array<{url: string, context: string}>, networkSpeed: string) {
  return images.map(img => {
    let quality = 80;
    let width = 1200;
    
    // Adjust based on network speed
    switch (networkSpeed) {
      case 'slow-2g':
      case '2g':
        quality = 60;
        width = 800;
        break;
      case '3g':
        quality = 70;
        width = 1000;
        break;
      case '4g':
      default:
        quality = 80;
        width = 1200;
        break;
    }
    
    // Adjust based on context
    if (img.context === 'hero') {
      quality = Math.min(90, quality + 10);
      width = Math.min(1600, width + 400);
    } else if (img.context === 'thumbnail') {
      quality = Math.max(60, quality - 10);
      width = Math.min(600, width - 200);
    }
    
    return {
      ...img,
      optimizedUrl: `${img.url}?q=${quality}&w=${width}&fm=webp`,
      quality,
      width
    };
  });
}

// AI recommendation engine (simplified)
function calculateRecommendations(userProfile: any, vehicles: any[]) {
  const preferences = userProfile.preferences || {};
  const budget = userProfile.budget || { min: 0, max: Infinity };
  
  return vehicles
    .filter(vehicle => vehicle.price >= budget.min && vehicle.price <= budget.max)
    .map(vehicle => {
      let score = 0;
      
      // Category preference
      if (preferences.category && vehicle.category === preferences.category) {
        score += 30;
      }
      
      // Fuel efficiency preference
      if (preferences.fuelEfficient && vehicle.type === 'Hybrid') {
        score += 25;
      }
      
      // Performance preference
      if (preferences.performance && vehicle.horsepower > 250) {
        score += 20;
      }
      
      // Luxury preference
      if (preferences.luxury && vehicle.category === 'Luxury') {
        score += 15;
      }
      
      // Price preference (closer to middle of budget = higher score)
      const budgetRange = budget.max - budget.min;
      const pricePosition = (vehicle.price - budget.min) / budgetRange;
      const priceScore = 10 * (1 - Math.abs(0.5 - pricePosition) * 2);
      score += priceScore;
      
      return {
        vehicle,
        recommendationScore: Math.round(score),
        reasons: generateRecommendationReasons(vehicle, preferences)
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 6);
}

function generateRecommendationReasons(vehicle: any, preferences: any) {
  const reasons = [];
  
  if (preferences.category && vehicle.category === preferences.category) {
    reasons.push(`Perfect match for ${preferences.category.toLowerCase()} category`);
  }
  
  if (preferences.fuelEfficient && vehicle.type === 'Hybrid') {
    reasons.push('Excellent fuel efficiency with hybrid technology');
  }
  
  if (vehicle.safetyRating >= 5) {
    reasons.push('Top safety ratings for peace of mind');
  }
  
  if (vehicle.techFeatures?.length > 8) {
    reasons.push('Advanced technology features');
  }
  
  return reasons.slice(0, 3); // Top 3 reasons
}

// Analytics data processing
function processAnalyticsData(events: any[]) {
  const processed = {
    pageViews: {},
    userInteractions: {},
    conversionFunnel: {
      vehicleViews: 0,
      testDriveRequests: 0,
      enquiries: 0,
      conversions: 0
    },
    popularVehicles: {},
    sessionMetrics: {
      averageSessionDuration: 0,
      bounceRate: 0,
      pagesPerSession: 0
    }
  };
  
  events.forEach(event => {
    // Page views
    if (event.type === 'page_view') {
      processed.pageViews[event.page] = (processed.pageViews[event.page] || 0) + 1;
    }
    
    // User interactions
    if (event.type === 'interaction') {
      processed.userInteractions[event.action] = (processed.userInteractions[event.action] || 0) + 1;
    }
    
    // Conversion funnel
    if (event.type === 'vehicle_view') {
      processed.conversionFunnel.vehicleViews++;
      processed.popularVehicles[event.vehicle] = (processed.popularVehicles[event.vehicle] || 0) + 1;
    }
    
    if (event.type === 'test_drive_request') {
      processed.conversionFunnel.testDriveRequests++;
    }
    
    if (event.type === 'enquiry') {
      processed.conversionFunnel.enquiries++;
    }
    
    if (event.type === 'conversion') {
      processed.conversionFunnel.conversions++;
    }
  });
  
  return processed;
}

// Main worker message handler
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { id, type, data } = event.data;
  
  try {
    let result;
    
    switch (type) {
      case 'VEHICLE_COMPARISON':
        result = calculateVehicleComparison(data.vehicles);
        break;
        
      case 'IMAGE_OPTIMIZATION':
        result = optimizeImageParameters(data.images, data.networkSpeed);
        break;
        
      case 'RECOMMENDATION_ENGINE':
        result = calculateRecommendations(data.userProfile, data.vehicles);
        break;
        
      case 'ANALYTICS_PROCESSING':
        result = processAnalyticsData(data.events);
        break;
        
      default:
        throw new Error(`Unknown worker task type: ${type}`);
    }
    
    const response: WorkerResponse = {
      id,
      type,
      result
    };
    
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      id,
      type,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    self.postMessage(response);
  }
});

// Export types for TypeScript
export type { WorkerMessage, WorkerResponse };
