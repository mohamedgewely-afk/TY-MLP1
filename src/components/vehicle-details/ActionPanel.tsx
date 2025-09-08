import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Settings, Share2, Calculator, MapPin, FileText } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { openTestDrivePopup } from "@/utils/testDriveUtils";

/** ─────────────────────────────────────────
 *  GR tokens + matte carbon surface
 *  ───────────────────────────────────────── */
const GR_RED = "#EB0A1E";
const GR_SURFACE = "#0B0B0C";
const GR_EDGE = "#17191B";
const GR_TEXT = "#E6E7E9";
const GR_MUTED = "#A8ACB0";

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: GR_SURFACE,
};

/** Shared localStorage key so MobileStickyNav can read the same state */
const GR_STORAGE_KEY = "toyota.grMode";

/** Small helper to broadcast GR mode changes across tabs/components */
function emitGRModeChange(isGR: boolean) {
  const ev = new CustomEvent("toyota:grmode", { detail: { isGR } });
  window.dispatchEvent(ev);
}

/** Persisted GR mode hook */
function useGRMode() {
  const initial = () => {
    try {
      const q = new URLSearchParams(window.location.search).get("gr");
      if (q === "1" || q === "true") return true;
      const s = localStorage.getItem(GR_STORAGE_KEY);
      return s === "1" || s === "true";
    } catch {
      return false;
    }
  };

  const [isGR, setIsGR] = useState<boolean>(() => initial());

  useEffect(() => {
    try {
      localStorage.setItem(GR_STORAGE_KEY, isGR ? "1" : "0");
      emitGRModeChange(isGR);
    } catch {
      /* no-op */
    }
  }, [isGR]);

  const toggleGR = () => setIsGR((v) => !v);
  return { isGR, toggleGR };
}

interface ActionPanelProps {
  vehicle: VehicleModel;
  onDownloadBrochure?: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;

  /** @deprecated – kept for backward compatibility */
  isFavorite?: boolean;
  /** @deprecated – kept for backward compatibility */
  onToggleFavorite?: () => void;
}
const PANEL_H = {
  base: "64px",
  md: "80px",
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  onDownloadBrochure,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isGR, toggleGR } = useGRMode();

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(
        typeof navigator !== "undefined" ? navigator.language : "en-AE"
      ),
    []
  );

  const handleTestDrive = () => {
    // Keep existing popup util
    openTestDrivePopup(vehicle);
  };

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
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    }
  };

  const handleDownloadBrochure =
    onDownloadBrochure ??
    (() => {
      const url =
        (vehicle as any)?.brochureUrl ||
        (vehicle as any)?.assets?.brochureUrl ||
        "";
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        toast({
          title: "Brochure unavailable",
          description: "This model doesn't have a brochure link yet.",
          variant: "destructive",
        });
      }
    });

  if (isMobile) return null;

  const panelStyle: React.CSSProperties = {
    // @ts-ignore – CSS var is fine
    "--panel-h": PANEL_H.base,
    "--panel-h-md": PANEL_H.md,
    ...(isGR
      ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" }
      : {}),
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={panelStyle}
      className={[
        "fixed left-0 right-0 bottom-0 z-40",
        isGR
          ? "border-t h-[var(--panel-h)] md:h-[var(--panel-h-md)]"
          : "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl h-[var(--panel-h)] md:h-[var(--panel-h-md)]",
        "overflow-hidden",
      ].join(" ")}
      aria-label="Vehicle action panel"
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
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
                  isGR ? "text-neutral-400/80" : "text-muted-foreground",
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
                onClick={handleTestDrive}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg shadow-lg text-xs md:text-sm",
                  isGR
                    ? "bg-[#1D1F22] text-white hover:bg-[#202328] border border-[#1F2226]"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
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
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
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
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                aria-label="Finance"
                title="Finance"
              >
                <Calculator className="h-4 w-4" />
              </Button>

              {/* ↓ Brochure button (replaces Favorite) */}
              <Button
                onClick={handleDownloadBrochure}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                aria-label="Brochure"
                title="Download brochure"
              >
                <FileText className="h-4 w-4" />
              </Button>
              {/* ↑ Brochure button */}

              <Button
                onClick={handleShare}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                aria-label="Share"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              {/* GR toggle chip (desktop only) */}
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
                    ? "border border-[#17191B] text-red-300"
                    : "bg-gray-200/70 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                GR
              </button>
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
