
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { personas } from "@/data/personas";
import { cn } from "@/lib/utils";
import {
  Users,
  Laptop,
  Leaf,
  Building,
  MapPin,
  Mountain,
  Car,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface PersonaSelectorProps {
  onSelect: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ onSelect }) => {
  const { setSelectedPersona } = usePersona();
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
  
  const getPersonaIcon = (id: string) => {
    switch (id) {
      case "family-first":
        return <Users className="h-6 w-6" />; // Using Users icon instead of Family
      case "tech-enthusiast":
        return <Laptop className="h-6 w-6" />;
      case "eco-warrior":
        return <Leaf className="h-6 w-6" />;
      case "urban-explorer":
        return <MapPin className="h-6 w-6" />;
      case "business-commuter":
        return <Building className="h-6 w-6" />;
      case "weekend-adventurer":
        return <Mountain className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  // Define card colors as a properly typed object
  type PersonaId = "family-first" | "tech-enthusiast" | "eco-warrior" | "urban-explorer" | "business-commuter" | "weekend-adventurer";
  
  const cardColors: Record<PersonaId, {
    bg: string;
    hover: string;
    light: string;
    accent: string;
  }> = {
    "family-first": {
      bg: "bg-persona-family-primary",
      hover: "bg-persona-family-primary/90",
      light: "bg-persona-family-secondary/20",
      accent: "bg-persona-family-accent",
    },
    "tech-enthusiast": {
      bg: "bg-persona-tech-primary",
      hover: "bg-persona-tech-primary/90",
      light: "bg-persona-tech-secondary/20",
      accent: "bg-persona-tech-accent",
    },
    "eco-warrior": {
      bg: "bg-persona-eco-primary",
      hover: "bg-persona-eco-primary/90",
      light: "bg-persona-eco-secondary/20",
      accent: "bg-persona-eco-accent",
    },
    "urban-explorer": {
      bg: "bg-persona-urban-primary",
      hover: "bg-persona-urban-primary/90",
      light: "bg-persona-urban-secondary/20",
      accent: "bg-persona-urban-accent",
    },
    "business-commuter": {
      bg: "bg-persona-business-primary",
      hover: "bg-persona-business-primary/90",
      light: "bg-persona-business-secondary/20",
      accent: "bg-persona-business-accent",
    },
    "weekend-adventurer": {
      bg: "bg-persona-adventure-primary",
      hover: "bg-persona-adventure-primary/90",
      light: "bg-persona-adventure-secondary/20",
      accent: "bg-persona-adventure-accent",
    },
  };

  const handleSelectPersona = (personaId: string) => {
    // Convert string to PersonaType before passing to setSelectedPersona
    setSelectedPersona(personaId as PersonaId);
    onSelect();
  };

  return (
    <section className="py-20 relative overflow-hidden" id="personalize">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg 
          className="h-full w-full opacity-5"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="toyotaGrid"
              patternUnits="userSpaceOnUse"
              width="20"
              height="20"
            >
              <rect width="20" height="20" fill="none" />
              <path 
                d="M 0 10 H 20 M 10 0 V 20"
                stroke="#E50000"
                strokeWidth="0.5"
                strokeLinecap="square"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#toyotaGrid)" />
        </svg>
      </div>
      
      {/* Toyota ellipse logo design element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[400px] -left-[400px] w-[800px] h-[800px] rounded-full border-[40px] border-toyota-red/5" />
        <div className="absolute -bottom-[300px] -right-[300px] w-[600px] h-[600px] rounded-full border-[30px] border-toyota-red/5" />
      </div>

      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-toyota-red/10 rounded-full px-4 py-1 mb-4">
            <span className="text-toyota-red font-medium text-sm">Personalize Your Experience</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Do You Toyota?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the option that best matches your lifestyle and needs. We'll personalize your Toyota experience accordingly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(personas).map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredPersona(persona.id)}
              onMouseLeave={() => setHoveredPersona(null)}
              className="h-full"
            >
              <Card className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg border-0 group">
                <div 
                  className={cn(
                    "relative h-40 overflow-hidden",
                    cardColors[persona.id as PersonaId]?.light
                  )}
                >
                  {/* Background pattern based on persona */}
                  <div className="absolute inset-0 opacity-20">
                    {persona.id === "family-first" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="20" cy="20" r="5" fill="#4A6DA7" />
                        <circle cx="50" cy="50" r="8" fill="#4A6DA7" />
                        <circle cx="80" cy="80" r="6" fill="#4A6DA7" />
                        <circle cx="80" cy="20" r="4" fill="#4A6DA7" />
                        <circle cx="20" cy="80" r="7" fill="#4A6DA7" />
                      </svg>
                    )}
                    {persona.id === "tech-enthusiast" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <React.Fragment key={i}>
                            <line
                              x1="0" y1={20 * i} x2="100" y2={20 * i}
                              stroke="#6B38FB" strokeWidth="0.5"
                            />
                            <line
                              x1={20 * i} y1="0" x2={20 * i} y2="100"
                              stroke="#6B38FB" strokeWidth="0.5"
                            />
                          </React.Fragment>
                        ))}
                      </svg>
                    )}
                    {persona.id === "eco-warrior" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d="M0,80 Q25,60 50,80 T100,80"
                          fill="none"
                          stroke="#2E7D32"
                          strokeWidth="1"
                        />
                        <path
                          d="M0,60 Q25,40 50,60 T100,60"
                          fill="none"
                          stroke="#2E7D32"
                          strokeWidth="1"
                        />
                        <path
                          d="M0,40 Q25,20 50,40 T100,40"
                          fill="none"
                          stroke="#2E7D32"
                          strokeWidth="1"
                        />
                      </svg>
                    )}
                    {persona.id === "urban-explorer" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <rect
                            key={i}
                            x={Math.random() * 90}
                            y={Math.random() * 90}
                            width={5 + Math.random() * 10}
                            height={5 + Math.random() * 10}
                            fill="#455A64"
                          />
                        ))}
                      </svg>
                    )}
                    {persona.id === "business-commuter" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line
                          x1="0" y1="50" x2="100" y2="50"
                          stroke="#263238" strokeWidth="1"
                        />
                        {Array.from({ length: 10 }).map((_, i) => (
                          <line
                            key={i}
                            x1={i * 10} y1="0" x2={i * 10} y2="100"
                            stroke="#263238" strokeWidth="0.5"
                          />
                        ))}
                      </svg>
                    )}
                    {persona.id === "weekend-adventurer" && (
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d="M0,80 L20,60 L30,65 L40,40 L50,45 L60,20 L70,40 L80,30 L100,10"
                          fill="none"
                          stroke="#BF360C"
                          strokeWidth="1"
                        />
                        <path
                          d="M0,90 L30,80 L50,85 L70,70 L100,60"
                          fill="none"
                          stroke="#BF360C"
                          strokeWidth="1"
                        />
                      </svg>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div className="h-full flex items-center justify-center">
                    <div 
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        cardColors[persona.id as PersonaId]?.bg,
                        "text-white",
                      )}
                    >
                      {getPersonaIcon(persona.id)}
                    </div>
                  </div>
                  
                  {/* Accent elements */}
                  <div 
                    className={cn(
                      "absolute -bottom-2 -left-2 w-6 h-6 rounded-full transition-all duration-300 group-hover:scale-150",
                      cardColors[persona.id as PersonaId]?.accent
                    )}
                  />
                  <div 
                    className={cn(
                      "absolute -top-2 -right-2 w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-150",
                      cardColors[persona.id as PersonaId]?.accent
                    )}
                  />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-toyota-red transition-colors">
                    {persona.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{persona.description}</p>
                  
                  <Button
                    onClick={() => handleSelectPersona(persona.id)}
                    className={cn(
                      "w-full flex items-center justify-between transition-all",
                      cardColors[persona.id as PersonaId]?.bg,
                      cardColors[persona.id as PersonaId]?.hover
                    )}
                  >
                    <span>Personalize For Me</span>
                    <AnimatePresence>
                      {hoveredPersona === persona.id ? (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Toyota brand emblem */}
        <div className="flex justify-center mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-20 h-10 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 50"
                className="w-full h-full"
              >
                <ellipse
                  cx="50"
                  cy="25"
                  rx="22"
                  ry="12"
                  fill="#E50000"
                />
                <ellipse
                  cx="50"
                  cy="25"
                  rx="12"
                  ry="22"
                  fill="#E50000"
                />
                <ellipse
                  cx="50"
                  cy="25"
                  rx="30"
                  ry="18"
                  stroke="#E50000"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Let's Go Places, Together
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PersonaSelector;
