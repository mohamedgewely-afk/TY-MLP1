
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
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
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
    { id: 'home', icon: Home, label: 'Home', active: false, onClick: () => {} },
    { id: 'search', icon: Search, label: 'Search', active: false, onClick: () => {} },
    { id: 'favorites', icon: Heart, label: 'Favorites', active: false, onClick: () => {} },
    { id: 'profile', icon: User, label: 'Profile', active: false, onClick: () => {} },
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
      active: false,
      onClick: () => handleNavClick('testdrive')
    },
    { 
      id: 'builder', 
      icon: Car, 
      label: 'Build',
      active: false,
      onClick: () => handleNavClick('builder')
    },
    { 
      id: 'finance', 
      icon: Calculator, 
      label: 'Finance',
      active: false,
      onClick: () => handleNavClick('finance')
    },
  ];

  const navItems = isVehicleDetailsPage ? vehicleNavItems : defaultNavItems;

  return (
    <>
      {/* Enhanced Luxury Mobile Navigation */}
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
        {/* Enhanced Premium Glass Effect */}
        <div className="relative">
          {/* Deep luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 backdrop-blur-3xl" />
          
          {/* Premium glass morphism with refined elegance */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/15 to-white/8 backdrop-blur-2xl border-t border-white/30" />
          
          {/* Luxury shimmer animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          {/* Enhanced premium shadow and glow */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent blur-lg" />
          
          {/* Refined Navigation Content */}
          <div className="relative px-6 py-4 pb-safe">
            <div className="flex items-center justify-around">
              {navItems.map((item, index) => {
                const isActive = item.active;
                
                return (
                  <motion.button
                    key={item.id}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-t from-toyota-red/25 to-toyota-red/15 backdrop-blur-xl shadow-2xl border border-toyota-red/30'
                        : 'hover:bg-white/15 backdrop-blur-md hover:scale-105'
                    }`}
                    onClick={item.onClick}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 450,
                      damping: 25
                    }}
                    whileHover={{ 
                      scale: 1.08,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.92,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {/* Enhanced luxury icon container */}
                    <div className={`relative mb-2 ${
                      isActive 
                        ? 'text-toyota-red drop-shadow-2xl' 
                        : 'text-white/90 hover:text-white'
                    }`}>
                      {/* Premium glow effect for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-toyota-red/40 rounded-xl blur-xl" />
                      )}
                      
                      <item.icon className="relative h-7 w-7 transition-all duration-300 filter drop-shadow-sm" />
                      
                      {/* Enhanced active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-toyota-red to-toyota-red/80 rounded-full shadow-xl border border-white/20"
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 600,
                            damping: 25
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Refined premium typography */}
                    <span className={`text-xs font-semibold tracking-wide transition-all duration-300 ${
                      isActive
                        ? 'text-toyota-red drop-shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Enhanced luxury active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-1 left-1/2 w-2 h-0.5 bg-gradient-to-r from-toyota-red/60 to-toyota-red rounded-full"
                        initial={{ scale: 0, x: "-50%" }}
                        animate={{ scale: 1, x: "-50%" }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: 0.15
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Premium Home Indicator */}
            <motion.div 
              className="flex justify-center mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-36 h-1.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full shadow-lg" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced spacing for content */}
      <div className="h-24 md:hidden" />
    </>
  );
};

export default MobileStickyNav;
