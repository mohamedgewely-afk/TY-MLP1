import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Heart, 
  Calendar, 
  Share2, 
  ArrowRight,
  Zap,
  Settings
} from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface MobileStickyNavProps {
  onCompare?: () => void;
  onBuild?: () => void;
  onTestDrive?: () => void;
  onShare?: () => void;
  compareCount?: number;
  className?: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  onCompare = () => {},
  onBuild = () => {},
  onTestDrive = () => {},
  onShare = () => {},
  compareCount = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotionSafe();

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAction = (action: string, callback: () => void) => {
    setActiveAction(action);
    callback();
    
    // Reset active state after animation
    setTimeout(() => setActiveAction(null), 200);
  };

  const navItems = [
    {
      id: 'compare',
      icon: Car,
      label: 'Compare',
      action: () => handleAction('compare', onCompare),
      badge: compareCount > 0 ? compareCount : undefined,
      color: 'bg-blue-600'
    },
    {
      id: 'build',
      icon: Settings,
      label: 'Build',
      action: () => handleAction('build', onBuild),
      color: 'bg-green-600'
    },
    {
      id: 'test-drive',
      icon: Calendar,
      label: 'Test Drive',
      action: () => handleAction('test-drive', onTestDrive),
      color: 'bg-orange-600'
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      action: () => handleAction('share', onShare),
      color: 'bg-purple-600'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed bottom-0 left-0 right-0 z-[100] lg:hidden ${className}`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-white/10" />
          
          {/* Content */}
          <div className="relative px-4 py-3 safe-area-inset-bottom">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeAction === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                    transition={prefersReducedMotion ? {} : { 
                      delay: index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="relative"
                  >
                    <Button
                      onClick={item.action}
                      variant="ghost"
                      size="sm"
                      className={`
                        flex-col h-auto p-3 text-white hover:text-white hover:bg-white/10
                        transition-all duration-200 touch-manipulation min-h-touch-target
                        ${isActive ? 'scale-95' : ''}
                      `}
                      style={{
                        minHeight: '44px',
                        minWidth: '44px'
                      }}
                    >
                      <div className="relative">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center mb-1
                          ${isActive ? item.color : 'bg-white/10'}
                          transition-colors duration-200
                        `}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        {/* Badge for compare count */}
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-red-600 border-none"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <span className="text-xs font-medium leading-none">
                        {item.label}
                      </span>
                    </Button>

                    {/* Haptic feedback ripple */}
                    <AnimatePresence>
                      {isActive && !prefersReducedMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-white/20"
                          initial={{ scale: 0, opacity: 0.6 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyNav;