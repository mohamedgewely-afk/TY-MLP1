
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Car, Settings, Heart, Share2, Calculator, MapPin, Plus, ChevronUp } from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isExpanded, setIsExpanded] = useState(false);

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

  if (isMobile) {
    return (
      <>
        {/* Floating Action Button - Fixed positioning above sticky nav */}
        <motion.div
          className="fixed right-4 bottom-20 z-40"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-xl border-2 border-white/20"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>

        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-35"
                onClick={() => setIsExpanded(false)}
              />
              
              {/* Action Panel */}
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed left-4 right-4 bottom-20 z-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      AED {vehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    size="sm"
                    className="p-2 rounded-full"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => {
                        onBookTestDrive();
                        setIsExpanded(false);
                      }}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-3 rounded-xl text-sm font-medium"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Test Drive
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => {
                        onCarBuilder();
                        setIsExpanded(false);
                      }}
                      variant="outline"
                      className="w-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground py-3 rounded-xl bg-white/70 text-sm font-medium"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </motion.div>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => {
                        onFinanceCalculator();
                        setIsExpanded(false);
                      }}
                      variant="outline"
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg bg-white/70 text-xs"
                    >
                      <Calculator className="h-4 w-4 mb-1" />
                      Finance
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={onToggleFavorite}
                      variant="outline"
                      className={`w-full py-2 rounded-lg border text-xs ${
                        isFavorite 
                          ? "border-primary text-primary bg-primary/10" 
                          : "border-gray-300 text-gray-700 bg-white/70 hover:bg-gray-50"
                      }`}
                    >
                      <Heart className="h-4 w-4 mb-1" fill={isFavorite ? "currentColor" : "none"} />
                      Save
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg bg-white/70 text-xs"
                    >
                      <Share2 className="h-4 w-4 mb-1" />
                      Share
                    </Button>
                  </motion.div>
                </div>

                {/* Quick Info */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-muted-foreground text-center">
                    From AED 899/month • Free delivery • 7-day return
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed left-0 right-0 bottom-0 z-40 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl"
    >
      <div className="toyota-container py-4">
        {/* Price Display */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-3xl font-black text-primary">
              AED {vehicle.price.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              AED {Math.round(vehicle.price * 1.15).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Starting price • Finance available from AED 899/month</p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Primary Actions */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2"
          >
            <Button 
              onClick={onBookTestDrive}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-3 rounded-xl shadow-lg"
              size="lg"
            >
              <Car className="h-5 w-5 mr-2" />
              Book Test Drive
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2"
          >
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-3 rounded-xl bg-white/50 backdrop-blur-sm"
              size="lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Build & Price
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={onFinanceCalculator}
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl bg-white/50 backdrop-blur-sm"
            >
              <Calculator className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Finance</span>
            </Button>
          </motion.div>

          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button 
                onClick={onToggleFavorite}
                variant="outline"
                className={`w-full py-3 rounded-xl border backdrop-blur-sm ${
                  isFavorite 
                    ? "border-primary text-primary bg-primary/10" 
                    : "border-gray-300 text-gray-700 bg-white/50 hover:bg-gray-50"
                }`}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button 
                onClick={handleShare}
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl bg-white/50 backdrop-blur-sm"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex justify-center items-center space-x-6 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            Available at all showrooms
          </div>
          <div>• Free home delivery</div>
          <div>• 7-day return policy</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
