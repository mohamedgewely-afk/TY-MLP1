
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Car, 
  Calendar, 
  MessageCircle, 
  Search,
  ChevronUp,
  Zap,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useLuxuryAnimations } from "@/hooks/use-luxury-animations";
import { contextualHaptic } from "@/utils/haptic";

const offers = [
  {
    id: 1,
    title: "0% APR Financing",
    description: "Special rates on select models",
    badge: "Limited Time",
    icon: Zap,
    color: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    id: 2,
    title: "Trade-in Bonus",
    description: "Up to AED 15,000 extra",
    badge: "Exclusive",
    icon: Gift,
    color: "bg-gradient-to-r from-blue-500 to-indigo-600"
  }
];

const MobileStickyNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const { scrollDirection, isScrolling, isAtTop } = useScrollDirection({
    threshold: 20,
    debounce: 150
  });
  const { shrinkAnimation } = useLuxuryAnimations();

  // Determine if nav should be minimized
  const isMinimized = scrollDirection === 'down' && !isAtTop && isScrolling;

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Car, label: "Vehicles", path: "/vehicles" },
    { icon: Calendar, label: "Test Drive", path: "/test-drive" },
    { icon: MessageCircle, label: "Enquire", path: "/enquire" },
    { icon: Search, label: "Search", path: "/search" }
  ];

  const handleNavigation = (path: string, label: string) => {
    contextualHaptic.buttonPress();
    navigate(path);
  };

  const handleExpandOffers = () => {
    contextualHaptic.selectionChange();
    // Toggle to next offer or expand functionality
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
  };

  const currentOffer = offers[currentOfferIndex];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-mobile-dialog border-t border-border/20"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.8) 100%)',
        boxShadow: `
          0 -4px 20px rgba(0, 0, 0, 0.1),
          0 -2px 8px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        ...shrinkAnimation()
      }}
      animate={{
        height: isMinimized ? '40px' : '64px',
        paddingTop: isMinimized ? '4px' : '8px',
        paddingBottom: isMinimized ? '4px' : '8px'
      }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {/* Luxury gradient accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 50%, transparent 100%)'
        }}
      />

      <div className="toyota-container h-full">
        <div className="flex items-center justify-between h-full">
          {/* Navigation Icons */}
          <div className="flex items-center space-x-1">
            {navigationItems.slice(0, isMinimized ? 3 : 4).map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path, item.label)}
                  className={`
                    flex flex-col items-center justify-center rounded-lg transition-all
                    ${isMinimized 
                      ? 'min-w-[40px] min-h-[32px] px-2 py-1' 
                      : 'min-w-[48px] min-h-[40px] px-3 py-2'
                    }
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: isActive 
                      ? '0 2px 8px rgba(235, 10, 30, 0.2), inset 0 1px 2px rgba(235, 10, 30, 0.1)'
                      : 'none'
                  }}
                >
                  <Icon className={isMinimized ? "h-4 w-4" : "h-5 w-5"} />
                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium mt-0.5"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Offers Section */}
          <motion.div
            className="flex items-center"
            animate={{
              width: isMinimized ? '120px' : '200px'
            }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <motion.button
              onClick={handleExpandOffers}
              className="flex items-center justify-between w-full rounded-lg p-2 hover:shadow-md transition-all"
              style={{
                background: currentOffer.color,
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2 text-white min-w-0">
                <currentOffer.icon className={isMinimized ? "h-3 w-3" : "h-4 w-4"} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentOffer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="min-w-0"
                  >
                    <div className={`font-bold ${isMinimized ? 'text-xs' : 'text-sm'} truncate`}>
                      {currentOffer.title}
                    </div>
                    <AnimatePresence>
                      {!isMinimized && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-white/90 truncate"
                        >
                          {currentOffer.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="h-4 w-4 text-white/80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="pb-safe-area-inset-bottom" />
    </motion.div>
  );
};

export default MobileStickyNav;
