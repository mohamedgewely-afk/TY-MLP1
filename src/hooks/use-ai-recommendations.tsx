
import { useState, useEffect } from 'react';
import { VehicleModel } from '@/types/vehicle';
import { vehicles } from '@/data/vehicles';

interface UsagePattern {
  dailyCommute: string;
  weekendActivities: string[];
  familySize: number;
  budgetRange: [number, number];
  fuelPreference: string;
  priorityFeatures: string[];
}

interface RecommendationScore {
  vehicle: VehicleModel;
  score: number;
  reasons: string[];
}

export const useAIRecommendations = (usagePattern?: UsagePattern) => {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRecommendationScore = (vehicle: VehicleModel, pattern: UsagePattern): RecommendationScore => {
    let score = 0;
    const reasons: string[] = [];

    // Budget matching (30% weight)
    if (vehicle.price >= pattern.budgetRange[0] && vehicle.price <= pattern.budgetRange[1]) {
      score += 30;
      reasons.push('Within your budget range');
    } else if (vehicle.price < pattern.budgetRange[1] * 1.1) {
      score += 20;
      reasons.push('Slightly above budget but great value');
    }

    // Family size matching (25% weight)
    const seatCapacity = 5; // Default seating capacity since specifications doesn't have seating info
    if (seatCapacity >= pattern.familySize) {
      score += 25;
      reasons.push(`Accommodates your family of ${pattern.familySize}`);
    }

    // Fuel preference (20% weight)
    if (pattern.fuelPreference === 'hybrid' && vehicle.category.toLowerCase().includes('hybrid')) {
      score += 20;
      reasons.push('Matches your hybrid preference');
    } else if (pattern.fuelPreference === 'efficiency' && vehicle.specifications?.fuelEconomy) {
      score += 15;
      reasons.push('Excellent fuel efficiency');
    }

    // Commute matching (15% weight)
    if (pattern.dailyCommute === 'city' && vehicle.category.toLowerCase().includes('sedan')) {
      score += 15;
      reasons.push('Perfect for city commuting');
    } else if (pattern.dailyCommute === 'highway' && vehicle.category.toLowerCase().includes('suv')) {
      score += 15;
      reasons.push('Great for highway driving');
    }

    // Weekend activities (10% weight)
    if (pattern.weekendActivities.includes('outdoor') && vehicle.category.toLowerCase().includes('suv')) {
      score += 10;
      reasons.push('Ideal for outdoor adventures');
    }

    return { vehicle, score, reasons };
  };

  const generateRecommendations = (pattern: UsagePattern) => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const scored = vehicles.map(vehicle => calculateRecommendationScore(vehicle, pattern))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      
      setRecommendations(scored);
      setIsLoading(false);
    }, 1500);
  };

  return {
    recommendations,
    isLoading,
    generateRecommendations
  };
};
