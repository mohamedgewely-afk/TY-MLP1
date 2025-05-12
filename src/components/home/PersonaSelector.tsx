
import React from "react";
import { motion } from "framer-motion";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";
import { TriangleIcon } from "lucide-react";

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
          <motion.span 
            className="inline-block text-4xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, -5, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 5 
            }}
          >
            👋
          </motion.span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            What Drives You? Let's Tailor Your Toyota Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Select your lifestyle and we'll personalize your browsing experience to match your needs and preferences.
          </p>
          <motion.div 
            className="mt-4 flex justify-center items-center space-x-1 text-toyota-red"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <TriangleIcon size={16} className="transform rotate-180" />
            <span className="text-sm">Select below</span>
            <TriangleIcon size={16} className="transform rotate-180" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={container}
        >
          {Object.values(personas).map((persona) => (
            <motion.div 
              key={persona.id} 
              variants={item}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 10px 25px -5px rgba(0, 0, 0, 0.1)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer h-full transition-all hover:shadow-xl overflow-hidden relative
                  ${selectedPersona === persona.id ? 
                  "ring-2 ring-offset-2" : 
                  ""}`}
                onClick={() => handlePersonaSelect(persona.id)}
                style={{ 
                  borderColor: selectedPersona === persona.id ? persona.colorScheme.primary : "",
                  background: `${selectedPersona === persona.id ? 
                    `linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.9)), ${persona.backgroundPattern || ''}` : 
                    `linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.95)), ${persona.backgroundPattern || ''}`}` 
                }}
              >
                {selectedPersona === persona.id && (
                  <div className="absolute top-0 right-0">
                    <div 
                      className="w-16 h-16 overflow-hidden"
                      style={{ 
                        position: 'relative',
                        backgroundColor: persona.colorScheme.primary
                      }}
                    >
                      <div 
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%) rotate(45deg)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        SELECTED
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <motion.div 
                    className="text-4xl mb-3 p-4 rounded-full"
                    style={{ 
                      backgroundColor: `${selectedPersona === persona.id ? 
                        persona.colorScheme.primary : 'rgba(0,0,0,0.05)'}`
                    }}
                    animate={selectedPersona === persona.id ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -5, 5, -5, 0],
                      backgroundColor: persona.colorScheme.primary,
                      color: "#FFFFFF"
                    } : {}}
                    transition={{ duration: 1, repeat: selectedPersona === persona.id ? Infinity : 0, repeatDelay: 3 }}
                  >
                    <span role="img" aria-label={persona.title}>{persona.icon}</span>
                  </motion.div>
                  <h3 
                    className="font-bold text-lg mb-1"
                    style={{ 
                      color: selectedPersona === persona.id ? persona.colorScheme.primary : "" 
                    }}
                  >
                    {persona.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {persona.description}
                  </p>
                  
                  <motion.div 
                    className={`w-full mt-4 h-1 rounded-full ${
                      selectedPersona === persona.id ? "bg-opacity-100" : "bg-opacity-0"
                    }`}
                    style={{ backgroundColor: persona.colorScheme.primary }}
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: selectedPersona === persona.id ? "100%" : "0%",
                      backgroundColor: persona.colorScheme.primary
                    }}
                    transition={{ duration: 0.5 }}
                  />
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
