
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PersonalizedHero: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div 
      className="relative h-[70vh] overflow-hidden"
      style={{ backgroundColor: personaData.colorScheme.primary }}
    >
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      <img
        src={personaData.backgroundImage}
        alt={personaData.title}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg"
          >
            {personaData.headlineText}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto"
          >
            {personaData.subheadlineText}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-toyota-red hover:bg-toyota-darkred text-white rounded-full shadow-lg"
              style={{ backgroundColor: personaData.colorScheme.accent }}
            >
              <Link to="/new-cars" className="flex items-center gap-2">
                {personaData.ctaText}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedHero;
