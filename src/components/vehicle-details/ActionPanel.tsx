
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

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed left-0 right-0 bottom-0 z-40 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl"
    >
      <div className="w-full max-w-[2560px] mx-auto py-4 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Price Display */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-primary">
              AED {vehicle.price.toLocaleString()}
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-muted-foreground line-through">
              AED {Math.round(vehicle.price * 1.15).toLocaleString()}
            </span>
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Starting price • Finance available from AED 899/month</p>
        </div>

        {/* Action Buttons Grid - Responsive Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2 sm:gap-3 lg:gap-4">
          {/* Primary Actions - Responsive Spans */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6"
          >
            <Button 
              onClick={onBookTestDrive}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-2 sm:py-3 lg:py-4 rounded-xl shadow-lg text-sm sm:text-base lg:text-lg"
              size="lg"
            >
              <Car className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2" />
              Book Test Drive
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-4"
          >
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-2 sm:py-3 lg:py-4 rounded-xl bg-white/50 backdrop-blur-sm text-sm sm:text-base lg:text-lg"
              size="lg"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2" />
              Build & Price
            </Button>
          </motion.div>

          {/* Secondary Actions - Responsive Layout */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
          >
            <Button 
              onClick={onFinanceCalculator}
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 sm:py-3 lg:py-4 rounded-xl bg-white/50 backdrop-blur-sm text-xs sm:text-sm lg:text-base"
            >
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 sm:mr-1" />
              <span className="hidden sm:inline lg:hidden xl:inline">Finance</span>
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
          >
            <Button 
              onClick={onToggleFavorite}
              variant="outline"
              className={`w-full py-2 sm:py-3 lg:py-4 rounded-xl border backdrop-blur-sm ${
                isFavorite 
                  ? "border-primary text-primary bg-primary/10" 
                  : "border-gray-300 text-gray-700 bg-white/50 hover:bg-gray-50"
              }`}
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
          >
            <Button 
              onClick={handleShare}
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 sm:py-3 lg:py-4 rounded-xl bg-white/50 backdrop-blur-sm"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </Button>
          </motion.div>
        </div>

        {/* Quick Info - Responsive Text */}
        <div className="flex flex-wrap justify-center items-center space-x-3 sm:space-x-6 lg:space-x-8 mt-3 text-xs sm:text-sm lg:text-base text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Available at all showrooms
          </div>
          <div className="hidden sm:block">• Free home delivery</div>
          <div className="hidden md:block">• 7-day return policy</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
