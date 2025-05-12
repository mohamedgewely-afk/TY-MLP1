
import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonaContextType, PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";
import { toast } from "@/hooks/use-toast";

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
    const stored = localStorage.getItem("toyota-persona");
    return stored ? (stored as PersonaType) : null;
  });
  
  const [personaData, setPersonaData] = useState<Persona | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update personaData when selectedPersona changes
  useEffect(() => {
    if (selectedPersona) {
      // Start transition animation
      setIsTransitioning(true);
      
      // Set a slight delay to allow exit animations to complete
      setTimeout(() => {
        setPersonaData(personas[selectedPersona]);
        localStorage.setItem("toyota-persona", selectedPersona);
        
        // Track persona selection in analytics
        try {
          // Basic analytics tracking
          console.log("Analytics: Persona selected", selectedPersona);
          // If using a real analytics service, would push event here
        } catch (error) {
          console.error("Analytics error", error);
        }
        
        // Show success toast with appropriate styling
        toast({
          title: "Experience personalized!",
          description: `Now browsing as ${personas[selectedPersona].title}`,
          variant: "default",
          style: { 
            backgroundColor: personas[selectedPersona].colorScheme.primary,
            color: "#FFF"
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
        localStorage.removeItem("toyota-persona");
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
    localStorage.removeItem("toyota-persona");
    
    toast({
      title: "Personalization reset",
      description: "You're now viewing the default experience",
      variant: "default",
    });
  };

  const value = {
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
