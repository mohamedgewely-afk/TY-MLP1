import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronUp, Dot, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { contextualHaptic } from "@/utils/haptic";

interface NavigationSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  color?: string;
}

interface ModernSectionNavigationProps {
  className?: string;
}

const ModernSectionNavigation: React.FC<ModernSectionNavigationProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  // Define all actual sections with proper IDs and modern styling
  const sections: NavigationSection[] = useMemo(() => [
    { id: "hero", title: "Overview", color: "bg-gradient-to-r from-blue-500 to-purple-600" },
    { id: "virtual-showroom", title: "Experience", color: "bg-gradient-to-r from-purple-500 to-pink-600" },
    { id: "media-showcase", title: "Gallery", color: "bg-gradient-to-r from-pink-500 to-red-600" },
    { id: "story-performance", title: "Performance", color: "bg-gradient-to-r from-red-500 to-orange-600" },
    { id: "story-safety", title: "Safety", color: "bg-gradient-to-r from-orange-500 to-yellow-600" },
    { id: "story-connected", title: "Connected", color: "bg-gradient-to-r from-yellow-500 to-green-600" },
    { id: "story-sustainable", title: "Hybrid", color: "bg-gradient-to-r from-green-500 to-teal-600" },
    { id: "story-comfort", title: "Comfort", color: "bg-gradient-to-r from-teal-500 to-cyan-600" },
    { id: "story-ownership", title: "Ownership", color: "bg-gradient-to-r from-cyan-500 to-blue-600" },
    { id: "offers", title: "Offers", color: "bg-gradient-to-r from-indigo-500 to-purple-600" },
    { id: "tech-experience", title: "Technology", color: "bg-gradient-to-r from-purple-500 to-violet-600" },
    { id: "configuration", title: "Configure", color: "bg-gradient-to-r from-violet-500 to-pink-600" },
    { id: "related", title: "Similar Models", color: "bg-gradient-to-r from-pink-500 to-rose-600" },
    { id: "faq", title: "Support", color: "bg-gradient-to-r from-rose-500 to-red-600" }
  ], []);

  // Enhanced scroll behavior with smooth hiding/showing
  const controlNavigation = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 200) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 300) {
      // Scrolling down - hide
      setIsVisible(false);
      setIsExpanded(false);
    } else if (lastScrollY - currentScrollY > 10) {
      // Scrolling up - show
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // Advanced section tracking with intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          const sectionIndex = sections.findIndex(section => section.id === entry.target.id);
          if (sectionIndex !== -1) {
            setActiveSection(sectionIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavigation();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlNavigation]);

  // Smooth scroll to section with offset
  const scrollToSection = useCallback((sectionId: string, index: number) => {
    contextualHaptic.selectionChange();
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(index);
      setIsExpanded(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          style={{ opacity }}
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed right-6 top-1/2 transform -translate-y-1/2 z-50",
            "hidden xl:block",
            className
          )}
          role="navigation"
          aria-label="Section navigation"
        >
          {/* Main floating navigation */}
          <motion.div
            layout
            className={cn(
              "relative backdrop-blur-xl bg-white/10 dark:bg-black/10",
              "border border-white/20 dark:border-white/10",
              "rounded-2xl shadow-2xl",
              "transition-all duration-300 ease-out",
              isExpanded ? "p-4" : "p-2"
            )}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          >
            {/* Toggle button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-10 h-10 rounded-xl bg-white/20 dark:bg-white/10",
                "flex items-center justify-center",
                "hover:bg-white/30 dark:hover:bg-white/20",
                "transition-all duration-200",
                "border border-white/30 dark:border-white/20",
                "mb-2"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Dot className="w-6 h-6 text-white" />
              </motion.div>
            </motion.button>

            {/* Active section indicator */}
            <div className="relative">
              <motion.div
                className="w-10 h-1 rounded-full bg-white/60 mb-2"
                initial={false}
                animate={{
                  background: `linear-gradient(90deg, rgba(255,255,255,0.8) ${(activeSection / (sections.length - 1)) * 100}%, rgba(255,255,255,0.2) ${(activeSection / (sections.length - 1)) * 100}%)`
                }}
              />
              <div className="text-[10px] text-white/80 text-center font-medium">
                {activeSection + 1}/{sections.length}
              </div>
            </div>

            {/* Expanded navigation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                >
                  {sections.map((section, index) => {
                    const isActive = activeSection === index;
                    
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id, index)}
                        className={cn(
                          "relative w-full text-left px-3 py-2.5 rounded-xl text-xs",
                          "flex items-center gap-3 min-w-[160px]",
                          "transition-all duration-200",
                          "hover:bg-white/20 dark:hover:bg-white/10",
                          "focus:outline-none focus:ring-2 focus:ring-white/30",
                          isActive 
                            ? "bg-white/30 text-white shadow-lg" 
                            : "text-white/80 hover:text-white"
                        )}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={false}
                        animate={{
                          backgroundColor: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"
                        }}
                        aria-label={`Go to ${section.title} section`}
                        aria-current={isActive ? "location" : undefined}
                      >
                        {/* Section indicator dot */}
                        <motion.div
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            isActive ? "bg-white" : "bg-white/40"
                          )}
                          animate={{
                            scale: isActive ? 1.2 : 1,
                            opacity: isActive ? 1 : 0.6
                          }}
                        />
                        
                        <span className={cn(
                          "font-medium transition-all duration-200",
                          isActive ? "text-white" : "text-white/80"
                        )}>
                          {section.title}
                        </span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeExpandedIndicator"
                            className="absolute right-2 w-1 h-4 bg-white rounded-full"
                            initial={false}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                  
                  {/* Scroll to top */}
                  <motion.button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsExpanded(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-3 py-2.5",
                      "text-xs text-white/80 hover:text-white rounded-xl",
                      "hover:bg-white/20 transition-all duration-200",
                      "border-t border-white/20 mt-2 pt-4"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Scroll to top"
                  >
                    <ChevronUp className="w-3 h-3" />
                    <span>Back to Top</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Minimal dots for collapsed state */}
          {!isExpanded && (
            <motion.div 
              className="mt-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {sections.slice(0, 5).map((section, index) => {
                const isActive = activeSection === index;
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      "hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/30",
                      isActive ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                    )}
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      opacity: isActive ? 1 : 0.6
                    }}
                    aria-label={`Go to ${section.title} section`}
                  />
                );
              })}
              
              {sections.length > 5 && (
                <motion.div 
                  className="text-[8px] text-white/60 text-center mt-2"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{sections.length - 5}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default ModernSectionNavigation;