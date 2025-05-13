
import React from "react";
import { usePersona } from "@/contexts/PersonaContext";
import { motion } from "framer-motion";
import { X, ChevronDown, PersonStanding, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PersonaBadge: React.FC = () => {
  const { personaData, resetPersona } = usePersona();

  if (!personaData) return null;

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="relative">
        {/* Badge main button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full pl-3 pr-4 py-6 flex items-center gap-3 shadow-lg"
              style={{
                background: personaData.colorScheme.accent,
                boxShadow: `0 10px 25px -5px ${personaData.colorScheme.accent}80`,
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <Star className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-medium">{personaData.title}</span>
              <ChevronDown className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 shadow-lg rounded-xl border-0"
          >
            <div className="p-4">
              <div
                className="w-full h-1.5 rounded-full mb-3"
                style={{ backgroundColor: personaData.colorScheme.accent }}
              />
              <DropdownMenuLabel className="flex items-center justify-between">
                <span className="text-lg">Personalized View</span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: personaData.colorScheme.accent }}
                />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Persona info */}
              <div className="py-2 px-2 mb-2">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: personaData.colorScheme.primary }}
                  >
                    <PersonStanding className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{personaData.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {personaData.description.slice(0, 60)}...
                    </p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              
              {/* Additional info and actions */}
              <div className="py-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                  Content and recommendations are tailored to your preferences
                </p>
              </div>
            </div>
            
            <DropdownMenuItem
              className="flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer font-medium"
              onClick={resetPersona}
            >
              <X className="h-4 w-4 mr-2" />
              Exit Personalized View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Animated effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: personaData.colorScheme.accent,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>
    </motion.div>
  );
};

export default PersonaBadge;
