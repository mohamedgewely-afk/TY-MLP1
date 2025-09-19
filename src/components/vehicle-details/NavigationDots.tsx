
import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { performantSpringConfigs } from "@/utils/performance-animations";
import { contextualHaptic } from "@/utils/haptic";

interface NavigationDotsProps {
  sections: Array<{ id: string; subtitle: string }>;
  activeSection: number;
  onSectionClick: (index: number) => void;
  isVisible?: boolean;
}

const NavigationDots: React.FC<NavigationDotsProps> = React.memo(({
  sections,
  activeSection,
  onSectionClick,
  isVisible = true
}) => {
  const handleSectionClick = useCallback((index: number, sectionId: string) => {
    contextualHaptic.selectionChange();
    onSectionClick(index);
    
    const element = document.getElementById(`story-${sectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [onSectionClick]);

  // Memoized animation configs for better performance
  const containerAnimation = useMemo(() => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: performantSpringConfigs.smooth
  }), []);

  const hoverAnimation = useMemo(() => ({ 
    scale: 1.3,
    transition: performantSpringConfigs.fast
  }), []);

  const tapAnimation = useMemo(() => ({ 
    scale: 0.9,
    transition: { duration: 0.1 }
  }), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-3"
          {...containerAnimation}
        >
          {sections.map((section, index) => {
            const isActive = activeSection === index;
            
            return (
              <div key={section.id} className="relative group">
                <motion.button
                  onClick={() => handleSectionClick(index, section.id)}
                  className={`relative w-3 h-3 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive 
                      ? 'bg-primary border-primary' 
                      : 'bg-transparent border-gray-400 hover:border-gray-600'
                  }`}
                  whileHover={hoverAnimation}
                  whileTap={tapAnimation}
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    transition: performantSpringConfigs.smooth
                  }}
                  aria-label={`Go to ${section.subtitle} section`}
                  role="tab"
                  aria-selected={isActive}
                  style={{ 
                    willChange: 'transform',
                    transform: 'translate3d(0, 0, 0)'
                  }}
                >
                  {/* Active indicator */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1.5 : 0,
                      opacity: isActive ? 1 : 0
                    }}
                    transition={performantSpringConfigs.smooth}
                  />
                </motion.button>
                
                {/* Tooltip */}
                <motion.div
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap shadow-lg pointer-events-none"
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 10,
                    scale: isActive ? 1 : 0.9
                  }}
                  transition={performantSpringConfigs.fast}
                >
                  {section.subtitle}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-background/95 border-l border-b border-border rotate-45"></div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

NavigationDots.displayName = 'NavigationDots';

export default NavigationDots;
