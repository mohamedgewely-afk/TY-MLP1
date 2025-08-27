
import { PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";
import { vehicles } from "@/data/vehicles";

// Helper function to convert hex to RGB
export const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

// Calculate persona relevance score for vehicle sorting
export const calculatePersonaRelevance = (vehicle: any, persona: Persona) => {
  let score = 0;
  
  // Category match is highest priority
  if (persona.recommendedVehicleTypes.some(type => 
    vehicle.category.toLowerCase().includes(type.toLowerCase()))) {
    score += 10;
  }
  
  // Feature matches
  persona.recommendedFeatures.forEach(feature => {
    if (vehicle.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
      score += 5;
    }
  });
  
  // Hybrid preference for eco-warrior
  if (persona.id === "eco-warrior" && vehicle.category === "Hybrid") {
    score += 15;
  }
  
  // SUV preference for family-first
  if (persona.id === "family-first" && vehicle.category === "SUV") {
    score += 15;
  }
  
  return score;
};

// Filter vehicles based on persona preferences
export const filterVehiclesByPersona = (personaType: PersonaType) => {
  if (!personaType) return vehicles;
  
  const persona = personas[personaType];
  
  // Apply detailed persona-based filtering logic
  const filteredVehicles = vehicles.filter(vehicle => {
    // Check if vehicle category matches any recommended types
    const categoryMatch = persona.recommendedVehicleTypes.some(type => 
      vehicle.category.toLowerCase().includes(type.toLowerCase())
    );
    
    // Check for feature matches
    const featureMatch = persona.recommendedFeatures.some(feature => 
      vehicle.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
    );
    
    // Different personas have different priorities
    switch (personaType) {
      case "family-first":
        return vehicle.category === "SUV" || vehicle.category === "Hybrid" || 
               vehicle.features.some(f => f.includes("Seating") || f.includes("Safety"));
      case "tech-enthusiast":
        return vehicle.category === "GR Performance" || vehicle.category === "Hybrid" ||
               vehicle.features.some(f => f.includes("Tech") || f.includes("Connect"));
      case "eco-warrior":
        return vehicle.category === "Hybrid" || 
               vehicle.features.some(f => f.includes("Eco") || f.includes("Hybrid") || f.includes("Efficiency"));
      case "urban-explorer":
        return vehicle.category === "Sedan" || vehicle.category === "Hybrid" ||
               vehicle.features.some(f => f.includes("Compact") || f.includes("City"));
      case "business-commuter":
        return vehicle.category === "Sedan" || 
               vehicle.features.some(f => f.includes("Luxury") || f.includes("Audio") || f.includes("Comfort"));
      case "weekend-adventurer":
        return vehicle.category === "SUV" || vehicle.category === "GR Performance" ||
               vehicle.features.some(f => f.includes("Off") || f.includes("AWD") || f.includes("Terrain"));
      default:
        return categoryMatch || featureMatch;
    }
  });
  
  // Sort vehicles by relevance to the persona
  return filteredVehicles.sort((a, b) => {
    // Calculate a relevance score for each vehicle based on persona preferences
    const scoreA = calculatePersonaRelevance(a, persona);
    const scoreB = calculatePersonaRelevance(b, persona);
    return scoreB - scoreA; // Higher score first
  });
};
