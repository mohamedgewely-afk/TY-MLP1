
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Link } from "react-router-dom";

const QuickLinks: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-16 z-30 ${personaData.colorScheme.background} shadow-md py-3`}
    >
      <div className="toyota-container flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {personaData.quickLinks.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow text-sm font-medium flex items-center"
            style={{ color: personaData.colorScheme.primary }}
          >
            {link.title}
          </Link>
        ))}
        
        <div className="flex items-center text-sm font-medium ml-auto">
          <span className="hidden md:inline text-gray-500 dark:text-gray-400">
            Browsing as: 
          </span>
          <span 
            className="ml-2 px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: personaData.colorScheme.primary }}
          >
            {personaData.icon} {personaData.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickLinks;
