import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Car, Settings, Calculator, MapPin, Phone, Share2, Calendar, Fuel, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { VehicleModel } from "@/types/vehicle";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useLuxuryAnimations } from "@/hooks/use-luxury-animations";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileStickyNavProps {
  activeItem?: string;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem,
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isScrollingDown, isScrollingUp } = useScrollDirection();
  const { luxuryEase, premiumBounce, cinematicSlide, hapticFeedback } = useLuxuryAnimations();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const offers = [
    {
      id: '1',
      title: '0% Interest',
      subtitle: 'For 24 months',
      badge: 'Limited Time',
      color: 'from-primary to-primary/80'
    },
    {
      id: '2', 
      title: 'AED 5,000 Cash',
      subtitle: 'Trade-in bonus',
      badge: 'Exclusive',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  // Enhanced scroll behavior with luxury timing
  useEffect(() => {
    if (isScrollingDown && isExpanded) {
      setIsExpanded(false);
    } else if (isScrollingUp && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isScrollingDown, isScrollingUp, isExpanded]);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const handleButtonPress = (action: () => void, buttonId: string) => {
    setActiveButton(buttonId);
    hapticFeedback();
    
    setTimeout(() => {
      setActiveButton(null);
      action();
    }, 150);
  };

  const navigationItems = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Locate",
      action: () => navigate("/dealers"),
      id: "locate"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Call",
      action: () => window.open("tel:+971800Toyota"),
      id: "call"
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      label: "Share",
      action: () => navigator.share?.({ title: 'Toyota UAE', url: window.location.href }),
      id: "share"
    }
  ];

  const vehicleActions = vehicle ? [
    {
      icon: <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />,
      label: "Favorite",
      action: () => onToggleFavorite?.(),
      id: "favorite",
      isActive: isFavorite
    },
    {
      icon: <Car className="h-5 w-5" />,
      label: "Test Drive",
      action: () => onBookTestDrive?.(),
      id: "testdrive",
      isPrimary: true
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Build",
      action: () => onCarBuilder?.(),
      id: "build"
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: "Finance",
      action: () => onFinanceCalculator?.(),
      id: "finance"
    }
  ] : [];

  const currentItems = vehicle ? vehicleActions : navigationItems;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 luxury-shadow-nav"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          height: isExpanded ? 'auto' : '56px'
        }}
        exit={{ y: 100, opacity: 0 }}
        transition={luxuryEase}
        style={{ willChange: 'transform, height' }}
      >
        {/* Luxury Background with Premium Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/95 luxury-shadow-nav" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        <div className="relative luxury-container px-4 py-3 pb-safe">
          {/* Special Offers Bar - Only show when expanded */}
          <AnimatePresence>
            {isExpanded && offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={cinematicSlide}
                className="mb-3 overflow-hidden"
              >
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                  {offers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl bg-gradient-to-r ${offer.color} text-white relative overflow-hidden luxury-shadow-sm`}
                      whileTap={{ scale: 0.98 }}
                      transition={premiumBounce}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="text-xs font-bold">{offer.title}</div>
                        <div className="text-xs opacity-90">{offer.subtitle}</div>
                        {offer.badge && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-0">
                            {offer.badge}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className={`grid gap-2 ${currentItems.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {currentItems.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.96 }}
                transition={premiumBounce}
              >
                <Button
                  onClick={() => handleButtonPress(item.action, item.id)}
                  variant={item.isPrimary ? "default" : "ghost"}
                  className={`
                    w-full h-12 flex flex-col items-center justify-center space-y-1 rounded-xl font-medium transition-all duration-300 luxury-shadow-sm
                    ${item.isPrimary 
                      ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground luxury-shadow-md' 
                      : item.isActive
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20'
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 border border-gray-200/50'
                    }
                    ${activeButton === item.id ? 'luxury-pressed' : ''}
                  `}
                >
                  <motion.div
                    animate={activeButton === item.id ? { scale: 0.9 } : { scale: 1 }}
                    transition={premiumBounce}
                  >
                    {item.icon}
                  </motion.div>
                  <motion.span 
                    className="text-xs"
                    animate={isExpanded ? { opacity: 1 } : { opacity: 0.8 }}
                    transition={cinematicSlide}
                  >
                    {item.label}
                  </motion.span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Luxury Indicator Bar */}
          <motion.div 
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"
            animate={isExpanded ? { opacity: 0.3 } : { opacity: 0.6 }}
            transition={luxuryEase}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileStickyNav;
