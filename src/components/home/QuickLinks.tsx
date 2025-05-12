
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const QuickLinks: React.FC = () => {
  const { personaData, isTransitioning } = usePersona();
  
  if (!personaData) return null;

  const container = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  // Return different navbar styles based on persona.mobileNavStyle
  const getNavStyle = () => {
    switch (personaData.mobileNavStyle) {
      case "compact":
        return "py-2 shadow-md";
      case "floating":
        return "py-3 shadow-lg my-2 mx-4 rounded-xl";
      case "expanded":
        return "py-4 shadow-sm";
      case "tabbed":
        return "py-3 shadow-inner";
      case "drawer":
        return "py-3 shadow-lg";
      default:
        return "py-3 shadow-md";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={personaData.id}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={container}
        className={`sticky top-16 z-30 ${getNavStyle()}`}
        style={{ 
          backgroundColor: personaData.colorScheme.primary,
          backgroundImage: personaData.backgroundPattern,
        }}
      >
        <div className="toyota-container flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {personaData.quickLinks.map((link, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                to={link.href}
                className="px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                style={{ 
                  color: personaData.colorScheme.primary,
                  borderLeft: personaData.id === "tech-enthusiast" ? `4px solid ${personaData.colorScheme.accent}` : "",
                  borderRadius: personaData.id === "tech-enthusiast" ? "4px" : "9999px",
                }}
              >
                {/* Render persona-specific icon if available */}
                {personaData.iconSet && personaData.iconSet[index] && (
                  <span className="text-lg" style={{ color: personaData.colorScheme.primary }}>
                    {personaData.iconSet[index].name === "shield" && "🛡️"}
                    {personaData.iconSet[index].name === "users" && "👨‍👩‍👧‍👦"}
                    {personaData.iconSet[index].name === "home" && "🏠"}
                    {personaData.iconSet[index].name === "zap" && "⚡"}
                    {personaData.iconSet[index].name === "wifi" && "📶"}
                    {personaData.iconSet[index].name === "settings" && "⚙️"}
                    {personaData.iconSet[index].name === "leaf" && "🌿"}
                    {personaData.iconSet[index].name === "sun" && "☀️"}
                    {personaData.iconSet[index].name === "wind" && "💨"}
                    {personaData.iconSet[index].name === "map-pin" && "📍"}
                    {personaData.iconSet[index].name === "compass" && "🧭"}
                    {personaData.iconSet[index].name === "coffee" && "☕"}
                    {personaData.iconSet[index].name === "briefcase" && "💼"}
                    {personaData.iconSet[index].name === "clock" && "⏰"}
                    {personaData.iconSet[index].name === "phone" && "📱"}
                    {personaData.iconSet[index].name === "mountain" && "⛰️"}
                    {personaData.iconSet[index].name === "tent" && "⛺"}
                  </span>
                )}
                <span className="font-medium text-sm">
                  {link.title}
                </span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
          
          <motion.div 
            className="flex items-center text-xs font-medium ml-auto bg-white/20 px-3 py-1.5 rounded-full md:ml-6 text-white"
            variants={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
          >
            <motion.span 
              className="hidden md:inline mr-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Browsing as: 
            </motion.span>
            <motion.span 
              className="flex items-center gap-1 whitespace-nowrap"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="mr-1">{personaData.icon}</span> {personaData.title}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickLinks;
