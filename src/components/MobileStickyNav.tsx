import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Menu, Search } from "lucide-react";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { contextualHaptic } from "@/utils/haptic";

interface MobileStickyNavProps {
  isVisible: boolean;
  onCTAClick: () => void;
  onMenuClick: () => void;
  className?: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  isVisible, 
  onCTAClick, 
  onMenuClick,
  className = "" 
}) => {
  const { isMobile } = useDeviceInfo();
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [shimmerIndex, setShimmerIndex] = useState(0);

  // Add luxury shimmer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerIndex(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isMobile) return null;

  const handleButtonPress = (buttonId: string, callback: () => void) => {
    setIsPressed(buttonId);
    contextualHaptic.buttonPress();
    callback();
    setTimeout(() => setIsPressed(null), 150);
  };

  const getLuxuryButtonClass = (buttonId: string, isPrimary = false) => {
    const baseClass = `
      relative overflow-hidden transition-all duration-300 ease-out
      active:scale-95 touch-manipulation
      before:absolute before:inset-0 before:rounded-xl
      before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
      before:translate-x-[-100%] before:animate-shimmer
      after:absolute after:inset-0 after:rounded-xl
      after:bg-gradient-to-br after:from-white/5 after:to-transparent
      after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
    `;
    
    const pressedClass = isPressed === buttonId ? 'scale-95 shadow-inner' : '';
    
    if (isPrimary) {
      return `${baseClass} ${pressedClass} 
        bg-gradient-to-r from-primary via-primary/90 to-primary/80
        hover:from-primary/90 hover:via-primary/80 hover:to-primary/70
        shadow-lg hover:shadow-xl shadow-primary/20 hover:shadow-primary/30
        border border-primary/20 hover:border-primary/30
        backdrop-blur-xl
      `;
    }
    
    return `${baseClass} ${pressedClass}
      bg-gradient-to-br from-background/80 via-background/60 to-background/40
      hover:from-background/90 hover:via-background/70 hover:to-background/50
      border border-border/30 hover:border-border/50
      backdrop-blur-xl shadow-lg hover:shadow-xl
      shadow-black/5 hover:shadow-black/10
    `;
  };

  const getLuxuryContainerClass = () => {
    return `
      fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out
      bg-gradient-to-t from-background/95 via-background/90 to-background/80
      backdrop-blur-xl border-t border-border/30
      shadow-2xl shadow-black/10
      before:absolute before:inset-0 before:bg-gradient-to-t
      before:from-primary/5 before:via-transparent before:to-transparent
      before:pointer-events-none
      safe-area-inset-bottom
    `;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
          className={`${getLuxuryContainerClass()} ${className}`}
        >
          {/* Luxury gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          
          {/* Subtle animated particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${10 + i * 11}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          <div className="px-4 py-3 flex items-center justify-between gap-3 relative z-10">
            <motion.button
              onClick={() => handleButtonPress('menu', onMenuClick)}
              className={`${getLuxuryButtonClass('menu')} p-3 rounded-xl flex items-center justify-center min-w-[48px] min-h-[48px]`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {/* Luxury shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
                animate={{
                  x: shimmerIndex === 0 ? [-100, 100] : [-100, -100],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: shimmerIndex * 1
                }}
              />
              <Menu className="h-5 w-5 text-foreground relative z-10" />
            </motion.button>

            <motion.button
              onClick={() => handleButtonPress('cta', onCTAClick)}
              className={`${getLuxuryButtonClass('cta', true)} flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 min-h-[48px] max-w-[280px]`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Premium shimmer effect for CTA */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                animate={{
                  x: shimmerIndex === 1 ? [-100, 100] : [-100, -100],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: shimmerIndex * 1 + 0.5
                }}
              />
              <motion.div
                className="flex items-center gap-2 relative z-10"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Car className="h-4 w-4 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground text-sm">
                  Book Test Drive
                </span>
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => handleButtonPress('search', () => {})}
              className={`${getLuxuryButtonClass('search')} p-3 rounded-xl flex items-center justify-center min-w-[48px] min-h-[48px]`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {/* Luxury shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"
                animate={{
                  x: shimmerIndex === 2 ? [-100, 100] : [-100, -100],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: shimmerIndex * 1 + 1
                }}
              />
              <Search className="h-5 w-5 text-foreground relative z-10" />
            </motion.button>
          </div>

          {/* Luxury bottom glow */}
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyNav;
