
import React from "react";
import { motion } from "framer-motion";
import { springConfigs } from "@/utils/animation-configs";
import { contextualHaptic } from "@/utils/haptic";

interface NavigationDotsProps {
  sections: Array<{ id: string; subtitle: string }>;
  activeSection: number;
  onSectionClick: (index: number, sectionId: string) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({
  sections,
  activeSection,
  onSectionClick
}) => {
  const handleSectionClick = (index: number, sectionId: string) => {
    contextualHaptic.selectionChange();
    onSectionClick(index, sectionId);
    
    const element = document.getElementById(`story-${sectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-3">
      {sections.map((section, index) => (
        <div key={section.id} className="relative group">
          <motion.button
            onClick={() => handleSectionClick(index, section.id)}
            className={`relative w-3 h-3 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              activeSection === index 
                ? 'bg-primary border-primary' 
                : 'bg-transparent border-gray-400 hover:border-gray-600'
            }`}
            whileHover={{ 
              scale: 1.3,
              transition: springConfigs.snappy
            }}
            whileTap={{ 
              scale: 0.9,
              transition: { duration: 0.1 }
            }}
            animate={{
              scale: activeSection === index ? 1.25 : 1,
              transition: springConfigs.gentle
            }}
            aria-label={`Go to ${section.subtitle} section`}
            role="tab"
            aria-selected={activeSection === index}
          >
            {/* Active indicator */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: activeSection === index ? 1.5 : 0,
                opacity: activeSection === index ? 1 : 0
              }}
              transition={springConfigs.gentle}
            />
          </motion.button>
          
          {/* Tooltip */}
          <motion.div
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap shadow-lg pointer-events-none"
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{
              opacity: activeSection === index ? 1 : 0,
              x: activeSection === index ? 0 : 10,
              scale: activeSection === index ? 1 : 0.9
            }}
            transition={springConfigs.smooth}
          >
            {section.subtitle}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-b border-border rotate-45"></div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default NavigationDots;
