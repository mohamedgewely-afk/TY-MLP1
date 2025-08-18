import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Settings, Heart, Share2, Calculator, MapPin } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────
   GR (Gazoo Racing) read-only mode helper
   – No toggle here; we just *read* the value.
─────────────────────────────────────────── */
function useGRReadOnly(): boolean {
  const [isGR, setIsGR] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search).get("gr");
    if (p === "1" || p === "true") return true;
    const s = localStorage.getItem("toyota.grMode");
    return s === "1" || s === "true";
  });

  // Keep in sync if another tab toggles GR mode
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "toyota.grMode") {
        setIsGR(e.newValue === "1" || e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return isGR;
}

/* ─────────────────────────────────────────
   GR tokens / styles
─────────────────────────────────────────── */
const GR_RED = "#EB0A1E";
const GR_TEXT = "#E6E7E9";
const GR_EDGE = "#17191B";

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#0B0B0C",
};

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const PANEL_H = {
  base: "64px",
  md: "80px",
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
  const isGR = useGRReadOnly(); // <-- now defined

  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${fmt.format(
            vehicle.price
          )}`,
          url: window.location.href,
        });
      } catch (e) {
        // no-op
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    }
  };

  // Hide on mobile per your original behavior
  if (isMobile) return null;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      // SINGLE source of truth for height via CSS var
      style={
        {
          // @ts-ignore – CSS var is fine
          "--panel-h": PANEL_H.base,
          "--panel-h-md": PANEL_H.md,
          ...(isGR ? carbonMatte : {}),
        } as React.CSSProperties
      }
      className={[
        "fixed left-0 right-0 bottom-0 z-40",
        isGR
          ? "border-t border-[rgba(23,25,27,.85)] shadow-[0_-16px_40px_rgba(0,0,0,.45)]"
          : "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl",
        "h-[var(--panel-h)] md:h-[var(--panel-h-md)]",
        "overflow-hidden",
      ].join(" ")}
      role="region"
      aria-label="Vehicle action panel"
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
        {/* One-row layout inside fixed height */}
        <div className="h-full flex items-center gap-2 md:gap-3">
          {/* Price cluster */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 leading-none">
              <span
                className={[
                  "text-lg md:text-xl font-black truncate",
                  isGR ? "text-red-300" : "text-primary",
                ].join(" ")}
              >
                AED {fmt.format(vehicle.price)}
              </span>
              <span
                className={[
                  "text-[10px] md:text-xs line-through",
                  isGR ? "text-neutral-400/70" : "text-muted-foreground",
                ].join(" ")}
              >
                AED {fmt.format(Math.round(vehicle.price * 1.15))}
              </span>
            </div>
            <p
              className={[
                "hidden md:block text-[11px] leading-none mt-1",
                isGR ? "text-neutral-400" : "text-muted-foreground",
              ].join(" ")}
            >
              Starting price • Finance from AED 899/mo
            </p>
          </div>

          {/* Actions */}
          <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-2 min-w-0">
            {/* Primary buttons */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onBookTestDrive}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg shadow-lg text-xs md:text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "bg-[#1D1F22] text-white hover:bg-[#222428] focus-visible:ring-red-700"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground focus-visible:ring-primary"
                ].join(" ")}
                title="Book Test Drive"
                aria-label="Book test drive"
              >
                <Car className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Book Test Drive
              </Button>

              <Button
                onClick={onCarBuilder}
                variant="outline"
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "border-2 border-[rgba(23,25,27,.95)] text-[#E6E7E9] bg-[#0E1012]/70 hover:bg-[#15171A]"
                    : "border-2 border-primary text-primary bg-white/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
                ].join(" ")}
                title="Build and Price"
                aria-label="Build and price"
              >
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Build &amp; Price
              </Button>
            </div>

            {/* Icon actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onFinanceCalculator}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "border border-[rgba(23,25,27,.95)] text-[#E6E7E9] bg-[#0E1012]/70 hover:bg-[#15171A]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm"
                ].join(" ")}
                aria-label="Finance"
                title="Finance"
              >
                <Calculator className="h-4 w-4" />
              </Button>

              <Button
                onClick={onToggleFavorite}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? isFavorite
                      ? "border border-red-700 text-red-300 bg-red-900/20 hover:bg-red-900/30"
                      : "border border-[rgba(23,25,27,.95)] text-[#E6E7E9] bg-[#0E1012]/70 hover:bg-[#15171A]"
                    : isFavorite
                    ? "border-primary text-primary bg-primary/10"
                    : "border border-gray-300 text-gray-700 bg-white/50 hover:bg-gray-50"
                ].join(" ")}
                aria-pressed={isFavorite}
                aria-label="Favorite"
                title="Favorite"
              >
                <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              </Button>

              <Button
                onClick={async () => {
                  await handleShare();
                }}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "border border-[rgba(23,25,27,.95)] text-[#E6E7E9] bg-[#0E1012]/70 hover:bg-[#15171A]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm"
                ].join(" ")}
                aria-label="Share"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick info row */}
        <div
          className={[
            "hidden xl:flex absolute left-1/2 -translate-x-1/2 bottom-1 text-xs items-center gap-3 pointer-events-none",
            isGR ? "text-neutral-400" : "text-muted-foreground",
          ].join(" ")}
        >
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