
import React from "react";
import { motion } from "framer-motion";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";

interface PersonaSelectorProps {
  onSelect: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {
  const { setSelectedPersona, selectedPersona } = usePersona();

  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
    onSelect();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="py-16 bg-white dark:bg-gray-900"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="toyota-container">
        <motion.div variants={item} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            What Drives You? Let's Tailor Your Toyota Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Select your lifestyle and we'll personalize your browsing experience to match your needs and preferences.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={container}
        >
          {Object.values(personas).map((persona) => (
            <motion.div key={persona.id} variants={item}>
              <Card 
                className={`cursor-pointer h-full transition-all hover:shadow-lg ${
                  selectedPersona === persona.id ? 
                  "ring-2 ring-offset-2 ring-toyota-red" : 
                  "hover:scale-105"
                }`}
                onClick={() => handlePersonaSelect(persona.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <span className="text-4xl mb-3" role="img" aria-label={persona.title}>
                    {persona.icon}
                  </span>
                  <h3 className="font-bold text-lg mb-1">{persona.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {persona.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PersonaSelector;
