import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown,
  Eye,
  Settings,
  Calculator,
  Calendar,
  FileText,
  Car
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationSection {
  id: string;
  label: string;
  description?: string;
  action?: () => void;
  highlight?: boolean;
}

interface StreamlinedNavigationProps {
  sections?: NavigationSection[];
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
  headerOffset?: number;
}

const DEFAULT_SECTIONS: NavigationSection[] = [
  { id: "hero", label: "Overview", description: "Vehicle introduction" },
  { id: "virtual-showroom", label: "Virtual Showroom", description: "360° exterior & interior" },
  { id: "media-showcase", label: "Gallery", description: "Photos & videos" },
  { id: "offers", label: "Offers", description: "Current promotions" },
  { id: "tech-experience", label: "Technology", description: "Connected features" },
  { id: "configuration", label: "Configure", description: "Build your vehicle", highlight: true },
  { id: "related", label: "Related", description: "You may also like" },
  { id: "preowned-similar", label: "Pre‑Owned", description: "Similar used cars" },
  { id: "faq", label: "FAQs", description: "Common questions" },
];

const StreamlinedNavigation: React.FC<StreamlinedNavigationProps> = ({
  sections = DEFAULT_SECTIONS,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
  headerOffset = 80
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const lastScrollY = useRef(0);

  // Auto-hide navigation on scroll (mobile)
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current && currentScrollY > 100;
      const scrollingUp = currentScrollY < lastScrollY.current;
      
      if (scrollingDown) {
        setIsVisible(false);
      } else if (scrollingUp || currentScrollY < 50) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Intersection observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(section.id);
              // Debug active section
              console.log("StreamlinedNavigation: active section", section.id);
            }
          },
          { rootMargin: `-${headerOffset}px 0px -60% 0px` }
        );
        
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sections, headerOffset]);

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - headerOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const handleAction = (action?: () => void) => {
    if (action) {
      action();
      setIsMenuOpen(false);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Premium floating menu button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            scale: isVisible ? 1 : 0.8,
            y: isVisible ? 0 : 20
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-20 right-4 z-40"
        >
          <Button
            onClick={() => setIsMenuOpen(true)}
            className="w-14 h-14 rounded-2xl bg-background/95 backdrop-blur-xl shadow-xl border border-border/50 text-foreground hover:bg-background hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Premium drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/98 backdrop-blur-xl z-50 shadow-2xl border-l border-border/20"
              >
                {/* Elegant header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Navigation</h3>
                    <p className="text-sm text-muted-foreground">Quick access to sections</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground rounded-full h-10 w-10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Premium primary actions */}
                <div className="p-6 border-b border-border/30 space-y-4">
                  <Button
                    onClick={() => handleAction(onBookTestDrive)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-xl py-3"
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Book Test Drive
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleAction(onCarBuilder)}
                      variant="outline"
                      className="text-sm py-3 rounded-xl border-border/50 hover:bg-muted/50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      onClick={() => handleAction(onFinanceCalculator)}
                      variant="outline"
                      className="text-sm py-3 rounded-xl border-border/50 hover:bg-muted/50"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Finance
                    </Button>
                  </div>
                </div>

                {/* Refined navigation sections */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (section.action) {
                            handleAction(section.action);
                          } else {
                            scrollToSection(section.id);
                          }
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-primary/10 text-foreground font-semibold border border-primary/20'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        } ${
                          section.highlight ? 'border border-primary/30 bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-base">{section.label}</div>
                            {section.description && (
                              <div className="text-sm text-muted-foreground mt-1">{section.description}</div>
                            )}
                          </div>
                          {section.highlight && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Premium desktop integration for ActionPanel
  return (
    <div className="hidden lg:flex items-center gap-3">
      {/* Elegant desktop navigation dropdown */}
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          className="text-foreground border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-300 rounded-xl px-4 py-2"
        >
          <Eye className="h-4 w-4 mr-2" />
          Sections
          <ChevronDown className="h-4 w-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
        </Button>
        
        {/* Premium dropdown menu */}
        <div className="absolute top-full right-0 mt-2 w-72 bg-background/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="p-3">
            {sections.slice(0, 6).map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (section.action) {
                    section.action();
                  } else {
                    scrollToSection(section.id);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-foreground font-semibold border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                } ${
                  section.highlight ? 'bg-primary/5 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{section.label}</span>
                  {section.highlight && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {section.description && (
                  <div className="text-xs text-muted-foreground mt-1">{section.description}</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamlinedNavigation;