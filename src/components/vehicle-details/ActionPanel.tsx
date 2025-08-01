
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Settings, Heart, Share2, Calculator, MapPin, Download } from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { glassStyles, premiumAnimations } from '@/utils/glassUtils';
import { typography, formatPremiumNumber } from '@/utils/typography';

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${vehicle.price.toLocaleString()}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBrochureDownload = () => {
    toast({
      title: "Brochure Download",
      description: "Your brochure is being prepared and will be downloaded shortly.",
    });
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${vehicle.name} brochure has been downloaded.`,
      });
    }, 2000);
  };

  // Mobile version is handled by MobileStickyNav
  if (isMobile) {
    return null;
  }

  const priceInfo = formatPremiumNumber(vehicle.price);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: premiumAnimations.duration.slow / 1000, 
        delay: 0.3, 
        ease: premiumAnimations.luxury 
      }}
      className="fixed left-0 right-0 bottom-0 z-40"
    >
      {/* Premium Glass Morphism Background */}
      <div className={`${glassStyles.overlay} ${glassStyles.shadow.xl} border-t-0 relative overflow-hidden`}>
        {/* Ambient background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/90 to-background/80" />
        
        {/* Luxury accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="toyota-container py-8 relative z-10">
          {/* Premium Price Display with Glass Morphism */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: premiumAnimations.luxury }}
          >
            <div className={`inline-flex items-center justify-center space-x-8 mb-6 ${glassStyles.primary} ${glassStyles.shadow.md} rounded-2xl px-8 py-6`}>
              <div className="text-center">
                <div className={`${typography.display[2]} ${typography.accent.gradient} mb-2`}>
                  {priceInfo.main}
                </div>
                <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                  Starting Price
                </div>
              </div>
              
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-border/50 to-transparent"></div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground line-through mb-1">
                  {formatPremiumNumber(Math.round(vehicle.price * 1.15)).main}
                </div>
                <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  Previous Price
                </div>
              </div>
            </div>
            
            {/* Premium offer badges */}
            <div className="flex items-center justify-center flex-wrap gap-3 text-sm">
              <motion.div 
                className={`${glassStyles.secondary} ${glassStyles.shadow.sm} text-primary px-4 py-2 rounded-full font-semibold`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Finance from {priceInfo.monthly}
              </motion.div>
              <motion.div 
                className={`${glassStyles.secondary} ${glassStyles.shadow.sm} text-green-700 px-4 py-2 rounded-full font-semibold`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Free home delivery
              </motion.div>
            </div>
          </motion.div>

          {/* Premium Action Buttons with Glass Morphism */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: premiumAnimations.luxury }}
          >
            {/* Primary Actions with Luxury Glass Styling */}
            <motion.div 
              whileHover={{ 
                scale: 1.02, 
                y: -6,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }} 
              whileTap={{ scale: 0.98 }}
              className="lg:col-span-2"
            >
              <Button 
                onClick={onBookTestDrive}
                className={`w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:via-primary/90 hover:to-primary/85 text-primary-foreground py-6 rounded-2xl ${glassStyles.shadow.xl} font-bold text-lg border-0 backdrop-blur-sm relative overflow-hidden group transition-all duration-${premiumAnimations.duration.normal}`}
                size="lg"
              >
                {/* Premium button background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Car className="h-6 w-6 mr-3 relative z-10" />
                <span className="relative z-10">Book Test Drive</span>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ 
                scale: 1.02, 
                y: -6,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }} 
              whileTap={{ scale: 0.98 }}
              className="lg:col-span-2"
            >
              <Button 
                onClick={onCarBuilder}
                variant="outline"
                className={`w-full ${glassStyles.primary} ${glassStyles.shadow.lg} hover:${glassStyles.hover} border-2 border-primary/30 text-primary hover:text-primary py-6 rounded-2xl font-bold text-lg transition-all duration-${premiumAnimations.duration.normal} backdrop-blur-xl relative overflow-hidden group`}
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings className="h-6 w-6 mr-3 relative z-10" />
                <span className="relative z-10">Build & Price</span>
              </Button>
            </motion.div>

            {/* Secondary Actions with Enhanced Glass */}
            <motion.div 
              whileHover={{ 
                scale: 1.05, 
                y: -6,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onFinanceCalculator}
                variant="outline"
                className={`w-full ${glassStyles.secondary} ${glassStyles.shadow.md} hover:${glassStyles.hover} border border-border/30 text-foreground py-6 rounded-2xl font-semibold transition-all duration-${premiumAnimations.duration.normal} backdrop-blur-lg`}
              >
                <Calculator className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Finance</span>
                <span className="sm:hidden">Calc</span>
              </Button>
            </motion.div>

            <div className="flex space-x-3">
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  y: -6,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }} 
                whileTap={{ scale: 0.9 }} 
                className="flex-1"
              >
                <Button 
                  onClick={onToggleFavorite}
                  variant="outline"
                  className={`w-full py-6 rounded-2xl ${glassStyles.shadow.md} transition-all duration-${premiumAnimations.duration.normal} backdrop-blur-lg ${
                    isFavorite 
                      ? `${glassStyles.primary} border-primary/50 text-primary` 
                      : `${glassStyles.secondary} border-border/30 text-foreground hover:${glassStyles.hover}`
                  }`}
                >
                  <Heart 
                    className="h-5 w-5" 
                    fill={isFavorite ? "currentColor" : "none"} 
                  />
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  y: -6,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }} 
                whileTap={{ scale: 0.9 }} 
                className="flex-1"
              >
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className={`w-full ${glassStyles.secondary} ${glassStyles.shadow.md} hover:${glassStyles.hover} border border-border/30 text-foreground py-6 rounded-2xl transition-all duration-${premiumAnimations.duration.normal} backdrop-blur-lg`}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Quick Info with Glass Morphism */}
          <motion.div 
            className="flex justify-center items-center flex-wrap gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: premiumAnimations.luxury }}
          >
            {[
              { icon: MapPin, text: "Available at all showrooms" },
              { icon: Download, text: "Free home delivery", className: "hidden sm:flex" },
              { text: "7-day return policy", className: "hidden md:flex" },
              { text: "Extended warranty available", className: "hidden lg:flex" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`flex items-center ${glassStyles.subtle} ${glassStyles.shadow.sm} px-4 py-2 rounded-full backdrop-blur-md ${item.className || ""}`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2 text-primary" />}
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
