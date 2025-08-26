
import React from "react";
import { motion } from "framer-motion";

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
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-2">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => {
            onSectionClick(index, section.id);
            document.getElementById(`story-${section.id}`)?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'center'
            });
          }}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            activeSection === index 
              ? 'bg-primary border-primary scale-125' 
              : 'bg-transparent border-gray-400 hover:border-gray-600'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </div>
  );
};

export default NavigationDots;
