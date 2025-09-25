import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { contextualHaptic } from "@/utils/haptic";

interface NavigationSection {
  id: string;
  title: string;
  subtitle: string;
}

interface SectionNavigationProps {
  className?: string;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Define all main sections in the vehicle details page
  const sections: NavigationSection[] = useMemo(() => [
    { id: "hero", title: "Overview", subtitle: "Vehicle Hero" },
    { id: "virtual-showroom", title: "Experience", subtitle: "Virtual Showroom" },
    { id: "media-showcase", title: "Media", subtitle: "Showcase" },
    { id: "story-performance", title: "Performance", subtitle: "Drive Dynamics" },
    { id: "story-safety", title: "Safety", subtitle: "Protection Suite" },
    { id: "story-connected", title: "Connected", subtitle: "Digital Life" },
    { id: "story-sustainable", title: "Hybrid", subtitle: "Sustainability" },
    { id: "story-comfort", title: "Comfort", subtitle: "Interior Design" },
    { id: "story-ownership", title: "Ownership", subtitle: "Finance & Service" },
    { id: "offers", title: "Offers", subtitle: "Current Deals" },
    { id: "tech-experience", title: "Technology", subtitle: "Innovation" },
    { id: "configuration", title: "Configure", subtitle: "Build & Price" },
    { id: "related", title: "Explore", subtitle: "Similar Models" },
    { id: "faq", title: "Support", subtitle: "Questions" }
  ], []);

  // Hide/show navigation based on scroll direction
  const controlNavigation = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 100) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down - hide
      setIsVisible(false);
    } else if (lastScrollY - currentScrollY > 5) {
      // Scrolling up - show
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // Track active section based on scroll position
  const updateActiveSection = useCallback(() => {
    const sectionElements = sections.map(section => 
      document.getElementById(section.id)
    ).filter(Boolean);

    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const element = sectionElements[i];
      if (element && element.offsetTop <= scrollPosition) {
        setActiveSection(i);
        break;
      }
    }
  }, [sections]);

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavigation();
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controlNavigation, updateActiveSection]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string, index: number) => {
    contextualHaptic.selectionChange();
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(index);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed right-4 top-1/2 transform -translate-y-1/2 z-40",
            "hidden lg:flex flex-col",
            "bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg",
            "shadow-lg max-h-[70vh] overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
            className
          )}
          role="navigation"
          aria-label="Section navigation"
        >
          <div className="p-2 space-y-1">
            {sections.map((section, index) => {
              const isActive = activeSection === index;
              
              return (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id, index)}
                  className={cn(
                    "relative w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-200",
                    "flex flex-col items-start gap-0.5 min-w-[140px]",
                    "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Go to ${section.title} section`}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="font-medium">{section.title}</span>
                  <span className="text-[10px] opacity-70">{section.subtitle}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-primary/5 rounded-md"
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Scroll to top button */}
          <div className="border-t border-border/50 p-2">
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-3 h-3" />
              <span>Top</span>
            </motion.button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SectionNavigation;