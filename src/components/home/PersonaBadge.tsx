
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { X, ChevronUp, ChevronDown, RefreshCw, UserCog, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaType } from "@/types/persona";
import { personas } from "@/data/personas";
import { toast } from "@/hooks/use-toast";

const PersonaBadge: React.FC = () => {
  const { selectedPersona, resetPersona, setSelectedPersona, isTransitioning } = usePersona();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"personas" | "preferences">("personas");
  const [animation, setAnimation] = useState<"idle" | "pulse" | "bounce">("idle");
  
  if (!selectedPersona) return null;
  
  const persona = personas[selectedPersona];

  // Create a wobble animation every 30 seconds to remind user they can change persona
  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimation("bounce");
      setTimeout(() => setAnimation("idle"), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const handlePersonaChange = (id: PersonaType) => {
    if (id === selectedPersona) return;
    
    setSelectedPersona(id);
    setIsOpen(false);
    
    toast({
      title: "Experience personalized!",
      description: `Now browsing as ${personas[id].title}`,
      variant: "default",
      style: { 
        backgroundColor: personas[id].colorScheme.primary,
        color: "#FFF"
      },
    });
  };

  const drawerVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 }
  };

  const badgeVariants = {
    idle: {},
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    },
    bounce: {
      y: [0, -10, 0],
      transition: { 
        times: [0, 0.5, 1],
        duration: 0.5 
      }
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 mb-3 w-64 md:w-80"
            style={{ 
              borderLeft: `5px solid ${persona.colorScheme.primary}`,
              boxShadow: `0 10px 25px -5px ${persona.colorScheme.primary}30`
            }}
          >
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="font-bold text-lg">
                {selectedTab === "personas" ? "Change Experience" : "Preferences"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex border rounded-lg mb-3">
              <Button
                variant={selectedTab === "personas" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab("personas")}
                className="flex-1 rounded-r-none"
                style={selectedTab === "personas" ? { backgroundColor: persona.colorScheme.primary } : {}}
              >
                Personas
              </Button>
              <Button
                variant={selectedTab === "preferences" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab("preferences")}
                className="flex-1 rounded-l-none"
                style={selectedTab === "preferences" ? { backgroundColor: persona.colorScheme.primary } : {}}
              >
                Preferences
              </Button>
            </div>
            
            {selectedTab === "personas" ? (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.values(personas).map((p) => (
                    <motion.button
                      key={p.id}
                      className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                        p.id === selectedPersona ? "bg-opacity-10" : "bg-white dark:bg-gray-800"
                      }`}
                      style={{ 
                        borderColor: p.id === selectedPersona ? p.colorScheme.primary : "transparent",
                        backgroundColor: p.id === selectedPersona ? `${p.colorScheme.primary}15` : ""
                      }}
                      onClick={() => handlePersonaChange(p.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-1 relative">
                        {p.icon}
                        {p.id === selectedPersona && (
                          <motion.div 
                            className="absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center">{p.title}</span>
                    </motion.button>
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={resetPersona} 
                  className="w-full flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Visual Preferences</h4>
                  <div className="flex flex-col space-y-1">
                    <label className="flex items-center justify-between text-sm">
                      <span>Animation Speed</span>
                      <select className="text-xs p-1 border rounded">
                        <option>Normal</option>
                        <option>Reduced</option>
                        <option>Off</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between text-sm">
                      <span>Contrast</span>
                      <select className="text-xs p-1 border rounded">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Maximum</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between text-sm">
                      <span>Font Size</span>
                      <select className="text-xs p-1 border rounded">
                        <option>Normal</option>
                        <option>Large</option>
                        <option>Larger</option>
                      </select>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Privacy Settings</h4>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Remember my persona</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Personalize recommendations</span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={animation}
        variants={badgeVariants}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg cursor-pointer transition-all`}
        style={{ 
          backgroundColor: persona.colorScheme.primary,
          color: "#FFFFFF",
          boxShadow: `0 10px 25px -5px ${persona.colorScheme.primary}80`,
          border: "2px solid rgba(255,255,255,0.3)"
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span 
          className="text-xl"
          animate={{ rotate: isOpen ? [0, 15, -15, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          {persona.icon}
        </motion.span>
        <span className="font-medium mr-1">Browsing as: {persona.title}</span>
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
