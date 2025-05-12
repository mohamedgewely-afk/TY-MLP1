
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
  // Enhanced properties for superior personalization
  fontFamily?: string;
  animationStyle: "fade" | "slide" | "zoom" | "bounce" | "flip";
  borderStyle: string;
  iconSet: Array<{
    name: string;
    color: string;
  }>;
  soundEffect?: string;
  cursorStyle?: string;
  backgroundPattern?: string;
  headerStyle: "minimal" | "bold" | "sophisticated" | "playful" | "technical" | "natural";
  mobileNavStyle: "compact" | "expanded" | "floating" | "tabbed" | "drawer";
  cardStyle: "rounded" | "sharp" | "floating" | "bordered" | "minimal" | "glass";
  
  // New properties for deep personalization and filtering
  recommendedVehicleTypes: string[];
  recommendedFeatures: string[];
  valuePropositions: string[];
  personalityTraits: string[];
  interactionStyle: "playful" | "efficient" | "detailed" | "minimalist" | "supportive" | "technical";
  contentDensity: "sparse" | "balanced" | "dense";
  preferredColors: string[];
  terminology: {
    vehicle: string;
    features: string;
    power: string;
    efficiency: string;
    technology: string;
    design: string;
    comfort: string;
  };
}

export interface PersonaContextType {
  selectedPersona: PersonaType;
  personaData: Persona | null;
  setSelectedPersona: (persona: PersonaType) => void;
  resetPersona: () => void;
  isTransitioning: boolean;
}
