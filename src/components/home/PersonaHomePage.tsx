
import React from "react";
import { usePersona } from "@/contexts/PersonaContext";
import { FamilyFirstHomePage } from "./personas/FamilyFirstHomePage";
import { TechEnthusiastHomePage } from "./personas/TechEnthusiastHomePage";
import { EcoWarriorHomePage } from "./personas/EcoWarriorHomePage";
import { UrbanExplorerHomePage } from "./personas/UrbanExplorerHomePage";
import { BusinessCommuterHomePage } from "./personas/BusinessCommuterHomePage";
import { WeekendAdventurerHomePage } from "./personas/WeekendAdventurerHomePage";

export const PersonaHomePage: React.FC = () => {
  const { personaData } = usePersona();

  if (!personaData) return null;

  // Return the appropriate homepage component based on persona type
  switch (personaData.id) {
    case "family-first":
      return <FamilyFirstHomePage />;
    case "tech-enthusiast":
      return <TechEnthusiastHomePage />;
    case "eco-warrior":
      return <EcoWarriorHomePage />;
    case "urban-explorer":
      return <UrbanExplorerHomePage />;
    case "business-commuter":
      return <BusinessCommuterHomePage />;
    case "weekend-adventurer":
      return <WeekendAdventurerHomePage />;
    default:
      return null;
  }
};

export default PersonaHomePage;
