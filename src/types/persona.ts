
export type PersonaType = 
  | "family-first" 
  | "tech-enthusiast" 
  | "eco-warrior" 
  | "urban-explorer" 
  | "business-commuter" 
  | "weekend-adventurer" 
  | null;

export interface Persona {
  id: PersonaType;
  title: string;
  icon: string;
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  headlineText: string;
  subheadlineText: string;
  ctaText: string;
  backgroundImage: string;
  quickLinks: Array<{
    title: string;
    href: string;
  }>;
  highlightedSections: string[];
  buttonTextStyle: string;
}

export interface PersonaContextType {
  selectedPersona: PersonaType;
  personaData: Persona | null;
  setSelectedPersona: (persona: PersonaType) => void;
  resetPersona: () => void;
}
