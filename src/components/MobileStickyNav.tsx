
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Search, Car, User, Home, Phone } from "lucide-react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useLuxuryAnimations } from "@/hooks/use-luxury-animations";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionItem {
  icon: React.ReactElement;
  label: string;
  action: () => void;
  id: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

const MobileStickyNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrollingDown, isScrollingUp, isAtTop } = useScrollDirection();
  const { hapticFeedback } = useLuxuryAnimations();
  const isMobile = useIsMobile();

  // Don't render on desktop
  if (!isMobile) return null;

  const actionItems: ActionItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      action: () => {
        hapticFeedback('light');
        navigate('/');
      },
      id: "home",
      isActive: location.pathname === '/'
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Search",
      action: () => {
        hapticFeedback('light');
        // Trigger search modal or navigate to search page
        const searchEvent = new CustomEvent('openSearch');
        window.dispatchEvent(searchEvent);
      },
      id: "search"
    },
    {
      icon: <Car className="h-5 w-5" />,
      label: "Vehicles",
      action: () => {
        hapticFeedback('light');
        navigate('/');
        // Scroll to vehicle showcase section
        setTimeout(() => {
          const showcase = document.getElementById('vehicle-showcase');
          showcase?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      id: "vehicles"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favorites",
      action: () => {
        hapticFeedback('light');
        // Open favorites drawer
        const favEvent = new CustomEvent('openFavorites');
        window.dispatchEvent(favEvent);
      },
      id: "favorites"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Contact",
      action: () => {
        hapticFeedback('medium');
        navigate('/enquire');
      },
      id: "contact",
      isPrimary: true,
      isActive: location.pathname === '/enquire'
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Account",
      action: () => {
        hapticFeedback('light');
        // Open account menu or navigate to profile
        const accountEvent = new CustomEvent('openAccount');
        window.dispatchEvent(accountEvent);
      },
      id: "account"
    }
  ];

  // Determine if nav should shrink
  const shouldShrink = isScrollingDown && !isAtTop;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          height: shouldShrink ? '40px' : '64px'
        }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ 
          duration: 0.6,
          ease: [0.77, 0, 0.175, 1] // Cinematic timing curve
        }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          boxShadow: `
            0 -20px 25px -5px rgba(0, 0, 0, 0.1),
            0 -10px 10px -5px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <div className="flex justify-around items-center h-full px-2 safe-area-padding-bottom">
          {actionItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={item.action}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              className={`
                flex flex-col items-center justify-center space-y-1 relative
                transition-all duration-300 rounded-xl p-1.5 min-w-[48px] min-h-[44px]
                ${item.isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
                }
                ${item.isPrimary 
                  ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg hover:shadow-xl' 
                  : 'hover:bg-muted/20'
                }
              `}
              style={{
                transition: `all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)`
              }}
            >
              {/* Icon container with scaling animation */}
              <motion.div
                animate={{ 
                  scale: shouldShrink ? 0.85 : 1,
                  opacity: shouldShrink ? 0.8 : 1
                }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.77, 0, 0.175, 1]
                }}
                className="relative"
              >
                {item.icon}
                
                {/* Active indicator */}
                {item.isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </motion.div>

              {/* Label with conditional rendering based on shrink state */}
              <AnimatePresence>
                {!shouldShrink && (
                  <motion.span
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                    className={`
                      text-xs font-medium leading-none
                      ${item.isPrimary ? 'text-white' : ''}
                    `}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Premium ripple effect for primary button */}
              {item.isPrimary && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Bottom safe area padding for devices with home indicators */}
        <div className="h-safe-area-inset-bottom bg-transparent" />
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileStickyNav;
