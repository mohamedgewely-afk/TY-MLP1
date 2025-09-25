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
  { id: "media-showcase", label: "Gallery", description: "Photos & videos" },
  { id: "story-performance", label: "Performance", description: "Engine & dynamics" },
  { id: "story-safety", label: "Safety", description: "Protection systems" },
  { id: "story-connected", label: "Technology", description: "Connected features" },
  { id: "configuration", label: "Configure", description: "Build your vehicle", highlight: true },
  { id: "offers", label: "Offers", description: "Current promotions" },
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
      const offsetTop = element.offsetTop - headerOffset;
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
        {/* Mobile Floating Menu Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            scale: isVisible ? 1 : 0.8,
            y: isVisible ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 z-40"
        >
          <Button
            onClick={() => setIsMenuOpen(true)}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 text-gray-700 hover:bg-white hover:shadow-xl"
          >
            <Menu className="h-5 w-5" />
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
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Quick Navigation</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Primary Actions */}
                <div className="p-6 border-b border-gray-100 space-y-3">
                  <Button
                    onClick={() => handleAction(onBookTestDrive)}
                    className="w-full bg-[hsl(var(--toyota-red))] hover:bg-[hsl(var(--toyota-red))]/90 text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Test Drive
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleAction(onCarBuilder)}
                      variant="outline"
                      className="text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button
                      onClick={() => handleAction(onFinanceCalculator)}
                      variant="outline"
                      className="text-xs"
                    >
                      <Calculator className="h-3 w-3 mr-1" />
                      Finance
                    </Button>
                  </div>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          if (section.action) {
                            handleAction(section.action);
                          } else {
                            scrollToSection(section.id);
                          }
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          activeSection === section.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        } ${
                          section.highlight ? 'border border-red-200 bg-red-50/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{section.label}</div>
                            {section.description && (
                              <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                            )}
                          </div>
                          {section.highlight && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                      </button>
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

  // Desktop: Integrated into ActionPanel (this component would be called from ActionPanel)
  return (
    <div className="hidden lg:flex items-center gap-2">
      {/* Desktop Quick Navigation Dropdown */}
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          className="text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          Sections
          <ChevronDown className="h-3 w-3 ml-1 group-hover:rotate-180 transition-transform" />
        </Button>
        
        {/* Dropdown Menu */}
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            {sections.slice(0, 6).map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.action) {
                    section.action();
                  } else {
                    scrollToSection(section.id);
                  }
                }}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${
                  section.highlight ? 'bg-red-50 border border-red-100' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{section.label}</span>
                  {section.highlight && (
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </div>
                {section.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamlinedNavigation;