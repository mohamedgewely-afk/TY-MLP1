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

const CARBON_URL =
  "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/f33badf4-a2df-4400-81f4-80b38a5461f7/items/6949214d-eddd-4a97-8e93-8c4ed9563ffc/renditions/3d30ccb3-dd72-4e9d-b02a-aa9759450957?binary=true";

const carbonMatte: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(" + CARBON_URL + ")",
  backgroundBlendMode: "multiply, normal",
  backgroundSize: "180px 180px, 180px 180px",
  backgroundRepeat: "no-repeat, repeat",
  backgroundPosition: "center, center",
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

/** (kept for backward compat, no functional use now) */
const PANEL_H = {
  base: "64px",
  md: "80px",
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  onDownloadBrochure,
  onBookTestDrive,
  onFinanceCalculator,
  onCarBuilder,
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

  // ✅ Robust Share: uses Web Share when available, otherwise copies URL
  const handleShare = async () => {
    const sharePayload = {
      title: `${vehicle.name} - Toyota UAE`,
      text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
      url: window.location.href,
    };

    try {
      if ((navigator as any).canShare && (navigator as any).canShare(sharePayload)) {
        await (navigator as any).share(sharePayload);
        return;
      }
      if ((navigator as any).share) {
        await (navigator as any).share(sharePayload);
        return;
      }
      await navigator.clipboard.writeText(sharePayload.url);
      toast({ title: "Link copied", description: "URL copied to clipboard." });
    } catch {
      try {
        const ok = window.confirm("Sharing not available. Copy link to clipboard?");
        if (ok) {
          await navigator.clipboard.writeText(sharePayload.url);
          toast({ title: "Link copied", description: "URL copied to clipboard." });
        }
      } catch {
        /* no-op */
      }
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

  /**
   * 🔧 Sizing rules:
   * - Panel height reduced.
   * - Button height / padding reduced.
   * - Icon sizes are FIXED (do not scale down with the buttons).
   */
  const panelStyle: React.CSSProperties = {
    // Panel: smaller overall height
    // ~50–60px regular, ~58–70px on md+
    // @ts-ignore custom properties
    "--panel-h": "clamp(50px, 5.5vw, 60px)",
    "--panel-h-md": "clamp(58px, 5vw, 70px)",

    // Buttons: slimmer height/padding; min-widths trimmed
    "--btn-h": "clamp(32px, 2.6vw, 40px)",
    "--btn-h-md": "clamp(36px, 2.3vw, 44px)",
    "--btn-px": "clamp(8px, 1.4vw, 14px)",
    "--btn-px-md": "clamp(10px, 1.3vw, 16px)",
    "--btn-minw-primary": "clamp(104px, 11vw, 132px)",
    "--btn-minw-secondary": "clamp(98px, 10vw, 124px)",
    "--btn-minw-brochure": "clamp(108px, 11vw, 132px)",
    "--btn-icon": "clamp(32px, 2.6vw, 38px)",

    // Icons: fixed sizes (do NOT shrink with buttons)
    "--icon": "16px",
    "--icon-md": "18px",

    ...(isGR
      ? { ...carbonMatte, borderColor: GR_EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" }
      : {}),
  } as React.CSSProperties;

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
      <div className="w-full max-w-[2560px] mx-auto h-full px-2.5 sm:px-3.5 lg:px-6 xl:px-8 2xl:px-12">
        <div className="h-full flex items-center gap-1.5 md:gap-3">
          {/* Price cluster */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 leading-none">
              <span
                className={[
                  "font-black truncate",
                  // slightly smaller, still legible
                  "text-[clamp(13px,1.4vw,16px)] md:text-[clamp(15px,1.2vw,18px)]",
                  isGR ? "text-red-300" : "text-primary",
                ].join(" ")}
              >
                AED {fmt.format(vehicle.price)}
              </span>
              <span
                className={[
                  "line-through",
                  "text-[clamp(9px,0.9vw,11px)] md:text-[clamp(10px,0.85vw,12px)]",
                  isGR ? "text-neutral-400/80" : "text-muted-foreground",
                ].join(" ")}
              >
                AED {fmt.format(Math.round(vehicle.price * 1.15))}
              </span>
            </div>
            <p
              className={[
                "hidden md:block leading-none mt-1",
                "text-[clamp(10px,0.85vw,12px)]",
                isGR ? "text-neutral-400" : "text-muted-foreground",
              ].join(" ")}
            >
              Starting price • Finance from AED 899/mo
            </p>
          </div>

          {/* Actions (wrap on tight widths) */}
          <div className="flex-1 flex items-center justify-end flex-wrap gap-1.5 md:gap-2">
            {/* Primary buttons */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                onClick={handleTestDrive}
                className={[
                  "rounded-lg shadow-lg transition-colors duration-200",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[var(--btn-px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,1vw,13px)]",
                  "min-w-[var(--btn-minw-primary)]",
                  isGR
                    ? "bg-[#1D1F22] text-white hover:bg-[#202328] border border-[#1F2226] focus:ring-2 focus:ring-red-500"
                    : "bg-transparent border border-[#EB0A1E] text-[#EB0A1E] hover:bg-[#EB0A1E] hover:text-white focus:ring-2 focus:ring-[#EB0A1E]",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                <Car
                  className="mr-1"
                  style={{
                    width: "var(--icon)",
                    height: "var(--icon)",
                  }}
                />
                <span className="md:hidden">Test Drive</span>
                <span className="hidden md:inline">Book Test Drive</span>
              </Button>

              <Button
                onClick={onCarBuilder}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-lg",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[var(--btn-px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,1vw,13px)]",
                  "min-w-[var(--btn-minw-secondary)]",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124] focus:ring-2 focus:ring-red-500"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
              >
                <Settings
                  className="mr-1"
                  style={{
                    width: "var(--icon)",
                    height: "var(--icon)",
                  }}
                />
                <span>Build & Price</span>
              </Button>
            </div>

            {/* Secondary / icon actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Finance */}
              <Button
                onClick={onFinanceCalculator}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-lg flex items-center justify-center font-semibold",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[calc(var(--btn-px)-2px)] md:px-[calc(var(--btn-px)-1px)]",
                  "text-[clamp(11px,1vw,13px)]",
                  "min-w-[var(--btn-minw-secondary)]",
                  isGR
                    ? "text-red-300 border-2 border-[#C4252A] hover:bg-[#141618] focus:ring-2 focus:ring-red-500"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-primary",
                ].join(" ")}
                aria-label="Finance calculator"
                title="Finance calculator"
              >
                <Calculator
                  className="mr-1.5"
                  style={{
                    width: "var(--icon)",
                    height: "var(--icon)",
                  }}
                />
                <span>Finance</span>
              </Button>

              {/* Brochure */}
              <Button
                onClick={handleDownloadBrochure}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "rounded-lg flex items-center justify-center font-semibold",
                  "h-[var(--btn-h)] md:h-[var(--btn-h-md)]",
                  "px-[calc(var(--btn-px)-1px)] md:px-[var(--btn-px-md)]",
                  "text-[clamp(11px,1vw,13px)]",
                  "min-w-[var(--btn-minw-brochure)]",
                  isGR
                    ? "text-neutral-100 bg-[#1D1F22] border border-[#1F2124] hover:bg-[#202328]"
                    : "bg-primary text-white hover:bg-primary/90 border border-primary",
                ].join(" ")}
                aria-label="Download brochure (PDF)"
                title="Download brochure (PDF)"
              >
                <FileText
                  className="mr-1.5"
                  style={{
                    width: "var(--icon)",
                    height: "var(--icon)",
                  }}
                />
                <span>Brochure</span>
              </Button>

              {/* Share (icon-only button) */}
              <Button
                onClick={handleShare}
                variant={isGR ? "ghost" : "outline"}
                className={[
                  "p-0 rounded-lg",
                  "h-[var(--btn-icon)] w-[var(--btn-icon)] md:h-[calc(var(--btn-icon)+2px)] md:w-[calc(var(--btn-icon)+2px)]",
                  isGR
                    ? "text-neutral-200 hover:bg-[#141618] border border-[#1F2124]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                aria-label="Share"
                title="Share"
              >
                <Share2
                  style={{
                    width: "var(--icon)",
                    height: "var(--icon)",
                  }}
                />
              </Button>

              {/* GR toggle chip (desktop only) */}
              <button
                type="button"
                onClick={toggleGR}
                role="switch"
                aria-checked={isGR}
                title="Toggle GR Performance mode"
                className={[
                  "hidden md:inline-flex items-center rounded-full",
                  "h-[calc(var(--btn-h)-2px)] md:h-[calc(var(--btn-h-md)-2px)]",
                  "px-[calc(var(--btn-px)-4px)] md:px-[calc(var(--btn-px-md)-4px)]",
                  "text-[clamp(10px,0.9vw,12px)] font-semibold",
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
            "hidden xl:flex absolute left-1/2 -translate-x-1/2 bottom-1 items-center gap-3 pointer-events-none",
            "text-[clamp(9px,0.8vw,11px)]",
            isGR ? "text-neutral-400" : "text-muted-foreground",
          ].join(" ")}
        >
          <span className="flex items-center">
            <MapPin style={{ width: 16, height: 16 }} className="mr-1" />
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
