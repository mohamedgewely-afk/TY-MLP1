import React, { useMemo } from "react";
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
  /** Optional: force GR mode from parent. If omitted, we auto-read URL/localStorage. */
  isGR?: boolean;
}

const PANEL_H = {
  base: "64px",
  md: "80px",
};

/* ── GR tokens and carbon background ───────────────────────────── */
const GR_RED = "#EB0A1E";
const GR_SURFACE = "#0B0B0C";
const GR_EDGE = "#17191B";
const GR_TEXT = "#E6E7E9";
const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: GR_SURFACE,
};

function readGlobalGR(): boolean {
  if (typeof window === "undefined") return false;
  const p = new URLSearchParams(window.location.search).get("gr");
  if (p === "1" || p === "true") return true;
  const s = localStorage.getItem("toyota.grMode");
  return s === "1" || s === "true";
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
  isGR: isGRProp,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Resolve GR mode: prop has priority, else global state
  const isGR = isGRProp ?? readGlobalGR();

  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
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
        isGR
          ? "border-t h-[var(--panel-h)] md:h-[var(--panel-h-md)] overflow-hidden"
          : "bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-gray-200/50 shadow-2xl h-[var(--panel-h)] md:h-[var(--panel-h-md)] overflow-hidden",
      ].join(" ")}
      style={
        isGR
          ? {
              ...carbonMatte,
              // Subtle top fade to separate from page content
              boxShadow: "0 -16px 48px rgba(0,0,0,.45)",
              borderColor: GR_EDGE,
            }
          : undefined
      }
      aria-label="Vehicle actions panel"
    >
      <div className="w-full max-w-[2560px] mx-auto h-full px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12">
        {/* single-row layout */}
        <div className="h-full flex items-center gap-2 md:gap-3">
          {/* Price cluster */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 leading-none">
              <span
                className={[
                  "text-lg md:text-xl font-black truncate",
                  isGR ? "text-red-400" : "text-primary",
                ].join(" ")}
                aria-label={`Price AED ${fmt.format(vehicle.price)}`}
              >
                AED {fmt.format(vehicle.price)}
              </span>
              <span
                className={[
                  "text-[10px] md:text-xs line-through",
                  isGR ? "text-neutral-500" : "text-muted-foreground",
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
              {/* Test Drive */}
              <Button
                onClick={onBookTestDrive}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg shadow-lg text-xs md:text-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "text-white"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground",
                ].join(" ")}
                style={
                  isGR
                    ? {
                        backgroundColor: "#1A1C1F",
                        border: `1px solid ${GR_EDGE}`,
                        boxShadow: "0 6px 20px rgba(0,0,0,.35)",
                      }
                    : undefined
                }
                title="Book Test Drive"
                aria-label="Book Test Drive"
              >
                <Car className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Book Test Drive
              </Button>

              {/* Build & Price */}
              <Button
                onClick={onCarBuilder}
                variant={isGR ? "default" : "outline"}
                className={[
                  "h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-sm",
                  isGR
                    ? "text-neutral-200 hover:bg-[#15171A]"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                style={isGR ? { backgroundColor: "#101214", border: `1px solid ${GR_EDGE}` } : undefined}
                title="Build & Price"
                aria-label="Build and Price"
              >
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                Build & Price
              </Button>
            </div>

            {/* Icon actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Finance */}
              <Button
                onClick={onFinanceCalculator}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "text-neutral-200 hover:bg-[#121416]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                style={isGR ? { backgroundColor: "#101214", border: `1px solid ${GR_EDGE}` } : undefined}
                aria-label="Finance"
                title="Finance"
              >
                <Calculator className="h-4 w-4" />
              </Button>

              {/* Favorite */}
              <Button
                onClick={onToggleFavorite}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? isFavorite
                      ? "text-red-300"
                      : "text-neutral-200 hover:bg-[#121416]"
                    : isFavorite
                    ? "border-primary text-primary bg-primary/10"
                    : "border border-gray-300 text-gray-700 bg-white/50 hover:bg-gray-50",
                ].join(" ")}
                style={
                  isGR
                    ? {
                        backgroundColor: isFavorite ? "#15171A" : "#101214",
                        border: `1px solid ${GR_EDGE}`,
                      }
                    : undefined
                }
                aria-pressed={isFavorite}
                aria-label="Favorite"
                title="Favorite"
              >
                <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              </Button>

              {/* Share */}
              <Button
                onClick={handleShare}
                variant="outline"
                className={[
                  "h-9 w-9 md:h-10 md:w-10 p-0 rounded-lg",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  isGR
                    ? "text-neutral-200 hover:bg-[#121416]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/50 backdrop-blur-sm",
                ].join(" ")}
                style={isGR ? { backgroundColor: "#101214", border: `1px solid ${GR_EDGE}` } : undefined}
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
