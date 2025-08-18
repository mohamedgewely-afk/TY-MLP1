import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Settings, Heart, Share2, Calculator, MapPin } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────
   GR (Gazoo Racing) tokens
─────────────────────────────────────────── */
const GR_RED = "#EB0A1E";
const GR_SURFACE = "#0B0B0C";
const GR_EDGE = "#17191B";
const GR_TEXT = "#E6E7E9";
const GR_MUTED = "#9DA2A6";

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: GR_SURFACE,
};

/* read/write GR mode with localStorage + reacts immediately */
function useGRModeRW() {
  const [isGR, setIsGR] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const urlFlag = new URLSearchParams(window.location.search).get("gr");
    if (urlFlag === "1" || urlFlag === "true") return true;
    return localStorage.getItem("toyota.grMode") === "1";
  });

  // broadcast-like update so other listeners can react if needed
  const set = React.useCallback((next: boolean) => {
    setIsGR(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("toyota.grMode", next ? "1" : "0");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "toyota.grMode", newValue: next ? "1" : "0" })
      );
    }
  }, []);

  const toggle = React.useCallback(() => set((prev) => !prev), [set]);

  // respond to external changes (e.g., mobile nav toggle)
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "toyota.grMode") {
        setIsGR(e.newValue === "1");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { isGR, toggleGR: toggle };
}

/* ─────────────────────────────────────────
   Props
─────────────────────────────────────────── */
interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

/* fixed heights via CSS vars (unchanged) */
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
  const { isGR, toggleGR } = useGRModeRW();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${vehicle.price.toLocaleString()}`,
          url: window.location.href,
        });
      } catch {
        /* no-op */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    }
  };

  if (isMobile) return null;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      // SINGLE source of truth for height via CSS vars
      style={
        {
          // @ts-ignore – CSS var is fine
          "--panel-h": PANEL_H.base,
          "--panel-h-md": PANEL_H.md,
        } as React.CSSProperties
      }
      className={[
        "fixed left-0 right-0 bottom-0 z-40",
        isGR
          ? // GR: matte carbon glass + subtle border
            "backdrop-blur-xl border-t h-[var(--panel-h)] md:h-[var(--panel-h-md)]"
          : // default: light gradient glass
            "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl h-[var(--panel-h)] md:h-[var(--panel-h-md)]",
        "overflow-hidden",
      ].join(" ")}
      style={isGR ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" } : undefined}
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
        {/* single-row flex layout */}
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
                AED {vehicle.price.toLocaleString()}
              </span>
              <span
                className={[
                  "text-[10px] md:text-xs line-through",
                  isGR ? "text-neutral-400/70" : "text-muted-foreground",
                ].join(" ")}
              >
                AED {Math.round(vehicle.price * 1.15).toLocaleString()}
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
            {/* GR toggle chip (desktop) */}
            <button
              type="button"
              onClick={toggleGR}
              role="switch"
              aria-checked={isGR}
              title="Toggle GR Performance mode"
              className={[
                "hidden md:inline-flex items-center h-9 md:h-10 rounded-full px-3 text-xs md:text-sm font-semibold",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                isGR
                  ? "bg-[#1a1c1f] text-red-300 border border-[#17191B]"
                  : "bg-gray-200/70 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
              ].join(" ")}
              style={isGR ? carbonMatte : undefined}
            >
              GR
            </button>

            {/* Primary buttons */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onBookTestDrive}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg shadow-lg text-xs md:text-sm",
                  isGR
                    ? "text-white"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground",
                ].join(" ")}
                style={
                  isGR
                    ? {
                        backgroundColor: "#1A1C1F",
                        border: `1px solid ${GR_EDGE}`,
                      }
                    : undefined
                }
              >
                <Car className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Book Test Drive
              </Button>

              <Button
                onClick={onCarBuilder}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-sm",
                  isGR
                    ? "text-neutral-200 hover:bg-neutral-900 border border-[#17191B]"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/50 backdrop-blur-sm",
                ].join(" ")}
              >
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Build & Price
              </Button>
            </div>

            {/* Icon actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={onFinanceCalculator}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  isGR
                    ? "text-neutral-200 hover:bg-neutral-900 border border-[#17191B]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                aria-label="Finance"
                title="Finance"
              >
                <Calculator className="h-4 w-4" />
              </Button>

              <Button
                onClick={onToggleFavorite}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  isGR
                    ? isFavorite
                      ? "border border-[#17191B] text-red-300 bg-[#1a1c1f]"
                      : "text-neutral-200 hover:bg-neutral-900 border border-[#17191B]"
                    : isFavorite
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
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `${vehicle.name} - Toyota UAE`,
                        text: `Check out this amazing ${vehicle.name} starting from AED ${vehicle.price.toLocaleString()}`,
                        url: window.location.href,
                      });
                    } catch {
                      /* no-op */
                    }
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied", description: "URL copied to clipboard." });
                  }
                }}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  isGR
                    ? "text-neutral-200 hover:bg-neutral-900 border border-[#17191B]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
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
