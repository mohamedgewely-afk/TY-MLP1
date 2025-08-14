import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Settings, Heart, Share2, Calculator, MapPin } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const PANEL_H = {
  base: "64px",   // <- tweak this
  md: "80px",     // <- and this if you want responsive height
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
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
      } catch (e) {
        console.log("Error sharing:", e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    }
  };

  if (isMobile) return null;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      // SINGLE source of truth for height via CSS var
      style={
        {
          // @ts-ignore – CSS var is fine
          "--panel-h": PANEL_H.base,
          "--panel-h-md": PANEL_H.md,
        } as React.CSSProperties
      }
      className={[
        "fixed left-0 right-0 bottom-0 z-40",
        "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg",
        "border-t border-gray-200/50 shadow-2xl",
        "h-[var(--panel-h)] md:h-[var(--panel-h-md)]",
        "overflow-hidden", // prevent children from making it taller
      ].join(" ")}
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
        {/* Use a single-row flex layout that fits inside the fixed height */}
        <div className="h-full flex items-center gap-2 md:gap-3">
          {/* Price cluster */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 leading-none">
              <span className="text-lg md:text-xl font-black text-primary truncate">
                AED {vehicle.price.toLocaleString()}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                AED {Math.round(vehicle.price * 1.15).toLocaleString()}
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-muted-foreground leading-none mt-1">
              Starting price • Finance from AED 899/mo
            </p>
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-2 min-w-0">
            {/* Primary buttons (fixed height) */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onBookTestDrive}
                className="h-9 md:h-10 px-3 md:px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg shadow-lg text-xs md:text-sm"
              >
                <Car className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Book Test Drive
              </Button>

              <Button
                onClick={onCarBuilder}
                variant="outline"
                className="h-9 md:h-10 px-3 md:px-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg bg-white/50 backdrop-blur-sm text-xs md:text-sm"
              >
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Build & Price
              </Button>
            </div>

            {/* Icon actions (fixed height/width) */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onFinanceCalculator}
                variant="outline"
                className="h-9 w-9 md:h-10 md:w-10 p-0 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg bg-white/50 backdrop-blur-sm"
                aria-label="Finance"
                title="Finance"
              >
                <Calculator className="h-4 w-4" />
              </Button>

              <Button
                onClick={onToggleFavorite}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg backdrop-blur-sm",
                  isFavorite
                    ? "border-primary text-primary bg-primary/10"
                    : "border border-gray-300 text-gray-700 bg-white/50 hover:bg-gray-50",
                ].join(" ")}
                aria-pressed={isFavorite}
                aria-label="Favorite"
                title="Favorite"
              >
                <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                className="h-9 w-9 md:h-10 md:w-10 p-0 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg bg-white/50 backdrop-blur-sm"
                aria-label="Share"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick info row – keep it from affecting height by absolutely positioning, or hide on small screens */}
        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 bottom-1 text-xs text-muted-foreground items-center gap-3 pointer-events-none">
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Available at all showrooms
          </span>
          <span>• Free delivery</span>
          <span>• 7-day return</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
