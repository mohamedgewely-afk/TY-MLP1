
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { X, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";

const PersonaBadge: React.FC = () => {
  const { selectedPersona, resetPersona, setSelectedPersona } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!selectedPersona) return null;
  
  const persona = personas[selectedPersona];

  return (
    <div className="fixed bottom-16 md:bottom-8 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-2 w-64"
          >
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Change Your Experience</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(personas).map((p) => (
                  <Button
                    key={p.id}
                    variant={p.id === selectedPersona ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPersona(p.id as PersonaType)}
                    className="text-xs flex items-center justify-center"
                  >
                    <span className="mr-1">{p.icon}</span> {p.title}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetPersona} 
              className="w-full flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg cursor-pointer`}
        style={{ 
          backgroundColor: persona.colorScheme.primary,
          color: "#FFFFFF"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{persona.icon}</span>
        <span className="font-medium">Driving as: {persona.title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </motion.div>
    </div>
  );
};

export default PersonaBadge;
