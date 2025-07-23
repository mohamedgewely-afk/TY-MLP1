
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Car,
  Calculator,
  Calendar,
  MessageCircle,
  ChevronUp
} from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';
import { contextualHaptic } from '@/utils/haptic';

interface MobileStickyNavProps {
  activeItem?: string; // Add activeItem prop
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem = 'home',
  vehicle,
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const isVehicleDetailsPage = vehicle != null;

  const handleNavClick = (action: string) => {
    contextualHaptic.selectionChange();
    
    if (action === 'favorite' && onToggleFavorite) {
      onToggleFavorite();
    } else if (action === 'testdrive' && onBookTestDrive) {
      onBookTestDrive();
    } else if (action === 'builder' && onCarBuilder) {
      onCarBuilder();
    } else if (action === 'finance' && onFinanceCalculator) {
      onFinanceCalculator();
    }
  };

  const defaultNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const vehicleNavItems = [
    { 
      id: 'favorite', 
      icon: Heart, 
      label: 'Save',
      active: isFavorite,
      onClick: () => handleNavClick('favorite')
    },
    { 
      id: 'testdrive', 
      icon: Calendar, 
      label: 'Test Drive',
      onClick: () => handleNavClick('testdrive')
    },
    { 
      id: 'builder', 
      icon: Car, 
      label: 'Build',
      onClick: () => handleNavClick('builder')
    },
    { 
      id: 'finance', 
      icon: Calculator, 
      label: 'Finance',
      onClick: () => handleNavClick('finance')
    },
  ];

  const navItems = isVehicleDetailsPage ? vehicleNavItems : defaultNavItems;

  return (
    <>
      {/* Luxury Mobile Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2
        }}
      >
        {/* Luxury Background with Enhanced Glass Effect */}
        <div className="relative">
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-3xl" />
          
          {/* Luxury glass morphism effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border-t border-white/20" />
          
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          
          {/* Premium shadow and glow */}
          <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/30 to-transparent blur-sm" />
          
          {/* Navigation Content */}
          <div className="relative px-4 py-3 pb-safe">
            <div className="flex items-center justify-around">
              {navItems.map((item, index) => {
                const isActive = activeItem === item.id || item.active;
                
                return (
                  <motion.button
                    key={item.id}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-t from-toyota-red/20 to-toyota-red/10 backdrop-blur-xl shadow-lg'
                        : 'hover:bg-white/10 backdrop-blur-md'
                    }`}
                    onClick={item.onClick}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {/* Luxury icon background */}
                    <div className={`relative mb-1 ${
                      isActive 
                        ? 'text-toyota-red drop-shadow-lg' 
                        : 'text-white/80 hover:text-white'
                    }`}>
                      {/* Subtle glow effect for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-toyota-red/30 rounded-lg blur-md" />
                      )}
                      
                      <item.icon className="relative h-6 w-6 transition-all duration-300" />
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-toyota-red rounded-full shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Premium typography */}
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-toyota-red drop-shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Subtle animation for active state */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-1 h-1 bg-toyota-red rounded-full"
                        initial={{ scale: 0, x: "-50%" }}
                        animate={{ scale: 1, x: "-50%" }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: 0.1
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Enhanced Home Indicator */}
            <motion.div 
              className="flex justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Luxury spacing for content */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default MobileStickyNav;
