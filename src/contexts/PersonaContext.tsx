import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonaContextType, PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";
import { toast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";

// Debug React availability in PersonaContext
console.log('PersonaContext.tsx React hooks check:', { 
  useState: React.useState, 
  useEffect: React.useEffect,
  useContext: React.useContext,
  createContext: React.createContext
});

// Create context with default values
const defaultContextValue: PersonaContextType = {
  selectedPersona: null,
  personaData: null,
  setSelectedPersona: () => {},
  resetPersona: () => {},
  isTransitioning: false,
};

const PersonaContext = createContext<PersonaContextType>(defaultContextValue);

export const usePersona = () => useContext(PersonaContext);

interface PersonaProviderProps {
  children: React.ReactNode;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  console.log('PersonaProvider initializing...');
  
  try {
    // Initialize state, check localStorage for previously selected persona
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>(() => {
      try {
        const stored = localStorage.getItem("toyota-persona");
        return stored ? (stored as PersonaType) : null;
      } catch (error) {
        console.warn('localStorage access failed:', error);
        return null;
      }
    });
    
    console.log('PersonaProvider useState successful, selectedPersona:', selectedPersona);
    
    const [personaData, setPersonaData] = useState<Persona | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Update personaData when selectedPersona changes
    useEffect(() => {
      console.log('PersonaProvider useEffect triggered, selectedPersona:', selectedPersona);
      
      if (selectedPersona) {
        // Start transition animation
        setIsTransitioning(true);
        
        // Set a slight delay to allow exit animations to complete
        setTimeout(() => {
          const currentPersona = personas[selectedPersona];
          setPersonaData(currentPersona);
          
          try {
            localStorage.setItem("toyota-persona", selectedPersona);
          } catch (error) {
            console.warn('localStorage write failed:', error);
          }
          
          // Apply persona-specific CSS variables to the document root
          const root = document.documentElement;
          
          // Clear any previous persona-specific styles
          root.classList.remove('persona-family', 'persona-tech', 'persona-eco', 
                              'persona-urban', 'persona-business', 'persona-adventure');
                              
          // Add persona-specific class
          if (selectedPersona === 'family-first') root.classList.add('persona-family');
          if (selectedPersona === 'tech-enthusiast') root.classList.add('persona-tech');
          if (selectedPersona === 'eco-warrior') root.classList.add('persona-eco');
          if (selectedPersona === 'urban-explorer') root.classList.add('persona-urban');
          if (selectedPersona === 'business-commuter') root.classList.add('persona-business');
          if (selectedPersona === 'weekend-adventurer') root.classList.add('persona-adventure');
          
          // Set CSS custom properties for this persona
          root.style.setProperty('--persona-primary', currentPersona.colorScheme.primary);
          root.style.setProperty('--persona-secondary', currentPersona.colorScheme.secondary);
          root.style.setProperty('--persona-accent', currentPersona.colorScheme.accent);
          root.style.setProperty('--persona-primary-rgb', hexToRgb(currentPersona.colorScheme.primary));
          
          // Set cursor style if specified
          if (currentPersona.cursorStyle) {
            document.body.style.cursor = currentPersona.cursorStyle;
          } else {
            document.body.style.cursor = '';
          }
          
          // Set font family if specified
          if (currentPersona.fontFamily) {
            document.body.style.fontFamily = currentPersona.fontFamily;
          } else {
            document.body.style.fontFamily = '';
          }
          
          // Filter and sort vehicles based on persona preferences
          const filteredVehicles = filterVehiclesByPersona(selectedPersona);
          window.dispatchEvent(new CustomEvent('persona-vehicles-filtered', { 
            detail: { vehicles: filteredVehicles } 
          }));
          
          // Track persona selection in analytics
          try {
            // Basic analytics tracking
            console.log("Analytics: Persona selected", selectedPersona);
            console.log("Analytics: Recommended vehicles", 
              filteredVehicles.map(v => v.name).join(', '));
            // If using a real analytics service, would push event here
          } catch (error) {
            console.error("Analytics error", error);
          }
          
          // Play sound effect if specified
          if (currentPersona.soundEffect) {
            const audio = new Audio(currentPersona.soundEffect);
            audio.volume = 0.2;
            audio.play().catch(e => console.log('Audio playback prevented:', e));
          }
          
          // Show success toast with appropriate styling
          toast({
            title: "Experience personalized!",
            description: `Now browsing as ${personas[selectedPersona].title}`,
            variant: "default",
            style: { 
              backgroundColor: currentPersona.colorScheme.primary,
              color: "#FFF",
              borderRadius: currentPersona.borderStyle.includes('rounded') ? '1rem' : '0.25rem',
              boxShadow: `0 10px 25px -5px ${currentPersona.colorScheme.primary}40`,
              border: currentPersona.borderStyle.includes('border') ? 
                `2px solid ${currentPersona.colorScheme.accent}` : 'none'
            },
          });
          
          // End transition after animation completes
          setTimeout(() => {
            setIsTransitioning(false);
          }, 800);
        }, 200);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setPersonaData(null);
          try {
            localStorage.removeItem("toyota-persona");
          } catch (error) {
            console.warn('localStorage remove failed:', error);
          }
          
          // Reset all persona-specific styles
          const root = document.documentElement;
          root.classList.remove('persona-family', 'persona-tech', 'persona-eco', 
                            'persona-urban', 'persona-business', 'persona-adventure');
          root.style.removeProperty('--persona-primary');
          root.style.removeProperty('--persona-secondary');
          root.style.removeProperty('--persona-accent');
          root.style.removeProperty('--persona-primary-rgb');
          document.body.style.cursor = '';
          document.body.style.fontFamily = '';
          
          // Reset vehicle filtering
          window.dispatchEvent(new CustomEvent('persona-vehicles-filtered', { 
            detail: { vehicles: null } 
          }));
          
          setIsTransitioning(false);
        }, 200);
      }
    }, [selectedPersona]);

    const handleSetSelectedPersona = (persona: PersonaType) => {
      // Only set if different from current selection
      if (persona !== selectedPersona) {
        setSelectedPersona(persona);
      }
    };

    const resetPersona = () => {
      setSelectedPersona(null);
      try {
        localStorage.removeItem("toyota-persona");
      } catch (error) {
        console.warn('localStorage remove failed:', error);
      }
      
      toast({
        title: "Personalization reset",
        description: "You're now viewing the default experience",
        variant: "default",
      });
    };

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    };
    
    // Filter vehicles based on persona preferences
    const filterVehiclesByPersona = (personaType: PersonaType) => {
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
    
    const calculatePersonaRelevance = (vehicle: any, persona: Persona) => {
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

    const value = {
      selectedPersona,
      personaData,
      setSelectedPersona: handleSetSelectedPersona,
      resetPersona,
      isTransitioning,
    };

    console.log('PersonaProvider rendering context provider');
    return (
      <PersonaContext.Provider value={value}>
        {children}
      </PersonaContext.Provider>
    );
  } catch (error) {
    console.error('PersonaProvider error:', error);
    throw error;
  }
};
