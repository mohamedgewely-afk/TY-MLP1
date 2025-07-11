
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Settings, Car, Calculator, Download } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onFinanceCalculator,
}) => {
  const isMobile = useIsMobile();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicle.name,
          text: `Check out the ${vehicle.name} at Toyota UAE`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border p-4 safe-area-bottom"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFavorite}
            className={`flex flex-col items-center gap-1 text-xs ${
              isFavorite ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>Favorite</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCarBuilder}
            className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
          >
            <Settings className="h-5 w-5" />
            <span>Configure</span>
          </Button>

          <Button
            onClick={onBookTestDrive}
            size="sm"
            className="px-6 py-2"
          >
            <Car className="h-4 w-4 mr-2" />
            Test Drive
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl"
          title="Download Brochure"
        >
          <Download className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onFinanceCalculator}
          className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl"
          title="Finance Calculator"
        >
          <Calculator className="h-5 w-5" />
        </Button>

        <Button
          onClick={onBookTestDrive}
          className="px-6 py-3 rounded-full shadow-lg hover:shadow-xl"
        >
          <Car className="h-4 w-4 mr-2" />
          Book Test Drive
        </Button>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
