
import { useCallback } from 'react';
import { PersonaType, Persona } from "@/types/persona";
import { personas } from "@/data/personas";
import { hexToRgb } from "@/utils/personaUtils";

export const usePersonaStyles = () => {
  const applyPersonaStyles = useCallback((selectedPersona: PersonaType, currentPersona: Persona | null) => {
    if (!selectedPersona || !currentPersona) {
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
      return;
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
  }, []);

  return { applyPersonaStyles };
};
