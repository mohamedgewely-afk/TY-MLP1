
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Settings, Heart, Share2, Calculator, MapPin, Download } from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

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
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBrochureDownload = () => {
    toast({
      title: "Brochure Download",
      description: "Your brochure is being prepared and will be downloaded shortly.",
    });
    // Simulate brochure download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${vehicle.name} brochure has been downloaded.`,
      });
    }, 2000);
  };

  // Mobile version is now handled by MobileStickyNav, so return null for mobile
  if (isMobile) {
    return null;
  }

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: premiumEasing }}
      className="fixed left-0 right-0 bottom-0 z-40 bg-gradient-to-t from-background via-background/98 to-background/95 border-t border-border/50 shadow-2xl"
    >
      <div className="toyota-container py-6">
        {/* Enhanced Price Display */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-center space-x-6 mb-3">
            <div className="text-center">
              <span className="text-4xl font-black text-primary">
                AED {vehicle.price.toLocaleString()}
              </span>
              <div className="text-sm text-muted-foreground">Starting Price</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <span className="text-2xl font-bold text-foreground line-through opacity-60">
                AED {Math.round(vehicle.price * 1.15).toLocaleString()}
              </span>
              <div className="text-sm text-muted-foreground">Was</div>
            </div>
          </div>
          <p className="text-muted-foreground">Finance available from AED 899/month • Free home delivery</p>
        </motion.div>

        {/* Enhanced Action Buttons Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {/* Primary Actions */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button 
              onClick={onBookTestDrive}
              className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:via-primary/90 hover:to-primary/85 text-primary-foreground py-4 rounded-xl shadow-xl hover:shadow-2xl font-bold text-lg"
              size="lg"
            >
              <Car className="h-5 w-5 mr-3" />
              Book Test Drive
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-4 rounded-xl shadow-lg hover:shadow-xl font-bold text-lg"
              size="lg"
            >
              <Settings className="h-5 w-5 mr-3" />
              Build & Price
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button 
              onClick={onFinanceCalculator}
              variant="outline"
              className="w-full border-2 border-border text-foreground hover:bg-muted py-4 rounded-xl shadow-lg hover:shadow-xl font-semibold"
            >
              <Calculator className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Finance</span>
            </Button>
          </motion.div>

          <div className="flex space-x-3">
            <motion.div 
              whileHover={{ scale: 1.1, y: -2 }} 
              whileTap={{ scale: 0.9 }} 
              className="flex-1"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                onClick={onToggleFavorite}
                variant="outline"
                className={`w-full py-4 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isFavorite 
                    ? "border-primary text-primary bg-primary/10 hover:bg-primary/20" 
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                <Heart 
                  className="h-5 w-5" 
                  fill={isFavorite ? "currentColor" : "none"} 
                />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.1, y: -2 }} 
              whileTap={{ scale: 0.9 }} 
              className="flex-1"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full border-2 border-border text-foreground hover:bg-muted py-4 rounded-xl shadow-lg hover:shadow-xl"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Quick Info */}
        <motion.div 
          className="flex justify-center items-center flex-wrap gap-6 mt-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Available at all showrooms
          </div>
          <div className="hidden sm:block">• Free home delivery</div>
          <div className="hidden md:block">• 7-day return policy</div>
          <div className="hidden lg:block">• Extended warranty available</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
