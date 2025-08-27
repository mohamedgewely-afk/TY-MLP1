
import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonaContextType, PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";
import { toast } from "@/hooks/use-toast";
import { filterVehiclesByPersona } from "@/utils/personaUtils";
import { usePersonaStyles } from "@/hooks/usePersonaStyles";

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
  
  const [personaData, setPersonaData] = useState<Persona | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { applyPersonaStyles } = usePersonaStyles();

  // Update personaData when selectedPersona changes
  useEffect(() => {
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
        
        // Apply persona styles
        applyPersonaStyles(selectedPersona, currentPersona);
        
        // Filter and sort vehicles based on persona preferences
        const filteredVehicles = filterVehiclesByPersona(selectedPersona);
        window.dispatchEvent(new CustomEvent('persona-vehicles-filtered', { 
          detail: { vehicles: filteredVehicles } 
        }));
        
        // Track persona selection in analytics
        try {
          console.log("Analytics: Persona selected", selectedPersona);
          console.log("Analytics: Recommended vehicles", 
            filteredVehicles.map(v => v.name).join(', '));
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
        
        // Reset persona styles
        applyPersonaStyles(null, null);
        
        // Reset vehicle filtering
        window.dispatchEvent(new CustomEvent('persona-vehicles-filtered', { 
          detail: { vehicles: null } 
        }));
        
        setIsTransitioning(false);
      }, 200);
    }
  }, [selectedPersona, applyPersonaStyles]);

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

  const value: PersonaContextType = {
    selectedPersona,
    personaData,
    setSelectedPersona: handleSetSelectedPersona,
    resetPersona,
    isTransitioning,
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};
