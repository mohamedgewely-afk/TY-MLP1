
import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonaContextType, PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";

// Create context with default values
const defaultContextValue: PersonaContextType = {
  selectedPersona: null,
  personaData: null,
  setSelectedPersona: () => {},
  resetPersona: () => {},
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

  // Update personaData when selectedPersona changes
  useEffect(() => {
    if (selectedPersona) {
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
    } else {
      setPersonaData(null);
      localStorage.removeItem("toyota-persona");
    }
  }, [selectedPersona]);

  const handleSetSelectedPersona = (persona: PersonaType) => {
    setSelectedPersona(persona);
  };

  const resetPersona = () => {
    setSelectedPersona(null);
    localStorage.removeItem("toyota-persona");
  };

  const value = {
    selectedPersona,
    personaData,
    setSelectedPersona: handleSetSelectedPersona,
    resetPersona,
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};
