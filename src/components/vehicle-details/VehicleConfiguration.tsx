// src/components/vehicle-details/VehicleConfiguration.tsx
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleModel } from "@/types/vehicle";
import { Check, Zap, Fuel, Settings, ArrowUpDown, Star, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { contextualHaptic } from "@/utils/haptic";
import { createAdaptiveVariants, createAdaptiveMicroAnimations } from "@/utils/adaptive-animations";
import { usePerformanceConfig } from "@/utils/performance-optimization";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import LuxuryComparisonTool from "@/components/comparison/LuxuryComparisonTool";

/* ────────────────────────────────────────────────────────────────────────────
   Inline, generic 3D Carousel used for the whole Step 2 section
   - Items = grades (cards rendered via renderItem)
   - Front-most item auto-selects the grade
   - Click any side card to snap to front
   - Wider & bigger defaults for desktop; tuned smaller for mobile
   - Respects prefers-reduced-motion (falls back to grid outside this component)
──────────────────────────────────────────────────────────────────────────── */

const FALLBACK_IMG =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="220"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234a5568" font-size="18">Image</text></svg>';

const DRAG_SENSITIVITY = 0.5;
const INERTIA_FRICTION = 0.95;
const TILT_SENSITIVITY = 10;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const Card3D: React.FC<{
  transform: string;
  cardW: number;
  cardH: number;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ transform, cardW, cardH, onClick, children }) => (
  <div
    className="absolute"
    style={{
      width: cardW,
      height: cardH,
      transform,
      transformStyle: "preserve-3d",
      willChange: "transform",
    }}
    onClick={onClick}
  >
    <div
      className="w-full h-full rounded-2xl overflow-hidden bg-background border border-border shadow-lg
                 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl"
      style={{ backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  </div>
);

const ThreeDCarousel = React.memo(function ThreeDCarousel<T>({
  items,
  renderItem,
  onActiveIndexChange,
  radius = 340,         // 👈 wider by default (desktop)
  cardW = 260,          // 👈 bigger cards (desktop)
  cardH = 340,
  reducedMotion = false,
  autoSpinSpeed = 0.06,
  idleTimeout = 1500,
  className,
}: {
  items: T[];
  renderItem: (item: T, idx: number, isActive: boolean) => React.ReactNode;
  onActiveIndexChange?: (idx: number) => void;
  radius?: number;
  cardW?: number;
  cardH?: number;
  reducedMotion?: boolean;
  autoSpinSpeed?: number;
  idleTimeout?: number;
  className?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const rotationRef = useRef(0);
  const tiltRef = useRef(0);
  const targetTiltRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const initialRotationRef = useRef(0);
  const lastInteractionRef = useRef(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const lastActiveIndexRef = useRef<number>(-1);

  const count = Math.max(1, items?.length || 0);
  const step = 360 / count;

  // Mouse tilt
  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!parentRef.current || isDraggingRef.current) return;
      lastInteractionRef.current = Date.now();
      const rect = parentRef.current.getBoundingClientRect();
      const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetTiltRef.current = -normalizedY * TILT_SENSITIVITY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  // Animation loop + front index detection
  useEffect(() => {
    const animate = () => {
      const now = Date.now();

      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= INERTIA_FRICTION;
        } else if (!reducedMotion && now - lastInteractionRef.current > idleTimeout) {
          rotationRef.current += autoSpinSpeed;
        }
      }

      if (!reducedMotion) {
        tiltRef.current += (targetTiltRef.current - tiltRef.current) * 0.1;
      } else {
        tiltRef.current = 0;
      }

      // Apply rotation transform
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotateX(${tiltRef.current}deg) rotateY(${rotationRef.current}deg)`;
      }

      // Compute active (front) index: angle_i ≈ -rotation
      const raw = -rotationRef.current / step;
      let active = Math.round(raw);
      active = mod(active, count);

      if (active !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = active;
        onActiveIndexChange?.(active);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [count, step, reducedMotion, autoSpinSpeed, idleTimeout, onActiveIndexChange]);

  const handleDragStart = useCallback((clientX: number) => {
    lastInteractionRef.current = Date.now();
    isDraggingRef.current = true;
    velocityRef.current = 0;
    dragStartRef.current = clientX;
    initialRotationRef.current = rotationRef.current;
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    lastInteractionRef.current = Date.now();
    const deltaX = clientX - dragStartRef.current;
    const newRotation = initialRotationRef.current + deltaX * DRAG_SENSITIVITY;
    velocityRef.current = newRotation - rotationRef.current;
    rotationRef.current = newRotation;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    lastInteractionRef.current = Date.now();
  }, []);

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);

  // Snap to a specific index (so clicking a side card brings it to the front)
  const snapTo = useCallback(
    (idx: number) => {
      const targetRotation = -idx * step;
      rotationRef.current = targetRotation;
      velocityRef.current = 0;
      lastInteractionRef.current = Date.now();
    },
    [step]
  );

  const cards = useMemo(
    () =>
      items.map((_, idx) => {
        const angle = idx * step;
        return {
          idx,
          transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        };
      }),
    [items, radius, step]
  );

  return (
    <div
      ref={parentRef}
      className={["w-full h-full flex items-center justify-center overflow-hidden font-sans cursor-grab active:cursor-grabbing", className || ""].join(" ")}
      style={{ userSelect: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleDragEnd}
    >
      <div
        className="relative"
        style={{
          perspective: 1600,
          perspectiveOrigin: "center",
          width: Math.max(cardW * 1.6, radius * 2.6),   // 👈 wider footprint
          height: Math.max(cardH * 1.9, radius * 1.6),
        }}
      >
        <div
          ref={wheelRef}
          className="relative"
          style={{
            width: cardW,
            height: cardH,
            transformStyle: "preserve-3d",
            willChange: "transform",
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -cardW / 2,
            marginTop: -cardH / 2,
          }}
        >
          {cards.map((c) => {
            // Estimate if this card is the active/front one
            const effectiveAngle = mod(c.idx * step + rotationRef.current, 360);
            const isFront = Math.abs(effectiveAngle) < step / 2 || Math.abs(effectiveAngle - 360) < step / 2;

            return (
              <Card3D
                key={c.idx}
                transform={c.transform}
                cardW={cardW}
                cardH={cardH}
                onClick={(e) => {
                  // If it's not front, snap to it; if it's front, let inner buttons work.
                  e.stopPropagation();
                  if (!isFront) snapTo(c.idx);
                }}
              >
                {renderItem(items[c.idx], c.idx, isFront)}
              </Card3D>
            );
          })}
        </div>
      </div>
    </div>
  );
});

/* ──────────────────────────────────────────────────────────────────────────── */

interface VehicleConfigurationProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
  onTestDrive?: () => void;
  onGradeSelect?: (grade: string) => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({
  vehicle,
  onCarBuilder,
  onTestDrive,
  onGradeSelect,
}) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [compareSet, setCompareSet] = useState<number[]>([]);

  const isMobile = useIsMobile();
  const { isMobile: deviceIsMobile } = useOptimizedDeviceInfo();
  const prefersReducedMotion = useReducedMotion();
  const performanceConfig = usePerformanceConfig();
  const { targetRef, isIntersecting } = usePerformantIntersection({ threshold: 0.1 });

  const adaptiveVariants = useMemo(
    () =>
      createAdaptiveVariants({
        isMobile: deviceIsMobile,
        isSlowScroll: false,
        prefersReducedMotion: prefersReducedMotion || false,
      }),
    [deviceIsMobile, prefersReducedMotion]
  );

  const microAnimations = useMemo(
    () =>
      createAdaptiveMicroAnimations({
        isMobile: deviceIsMobile,
        isSlowScroll: false,
        prefersReducedMotion: prefersReducedMotion || false,
      }),
    [deviceIsMobile, prefersReducedMotion]
  );

  const engines = useMemo(
    () => [
      {
        name: "2.5L Hybrid",
        description: "Advanced hybrid powertrain with seamless electric assist",
        shortDescription: "Hybrid efficiency",
        power: "218 HP",
        efficiency: "25.2 km/L",
        icon: <Zap className="h-6 w-6" />,
        selected: selectedEngine === "2.5L Hybrid",
      },
      {
        name: "3.5L V6",
        description: "Powerful V6 engine for enhanced performance",
        shortDescription: "V6 performance",
        power: "301 HP",
        efficiency: "18.4 km/L",
        icon: <Fuel className="h-6 w-6" />,
        selected: selectedEngine === "3.5L V6",
      },
    ],
    [selectedEngine]
  );

  // NOTE: grades can optionally include `gallery: string[]`
  const grades = useMemo(() => {
    const baseGrades =
      selectedEngine === "2.5L Hybrid"
        ? [
            {
              name: "Hybrid SE",
              description: "Sport-enhanced hybrid driving experience",
              price: 94900,
              monthlyFrom: 945,
              badge: "Balanced Choice",
              badgeColor: "bg-yellow-500",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
              gallery: [
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
              ],
              features: ["Hybrid Drive Modes", '18" Alloy Wheels', "Sport Seats", "Enhanced Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
            {
              name: "Hybrid XLE",
              description: "Premium hybrid with advanced features",
              price: 105900,
              monthlyFrom: 1059,
              badge: "Most Popular",
              badgeColor: "bg-primary",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
              features: ["Leather Interior", "Wireless Charging", "Panoramic Moonroof", "Premium Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
            {
              name: "Hybrid Limited",
              description: "Top-tier luxury hybrid experience",
              price: 118900,
              monthlyFrom: 1189,
              badge: "Premium",
              badgeColor: "bg-gray-800",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
              features: ["Ventilated Seats", "Head-up Display", "Advanced Safety", "JBL Premium Audio"],
              specs: {
                engine: "2.5L Hybrid",
                power: "218 HP",
                torque: "221 Nm",
                transmission: "eCVT",
                acceleration: "8.7 s",
                fuelEconomy: "25.2 km/L",
              },
            },
          ]
        : [
            {
              name: "V6 SE",
              description: "Sport-enhanced V6 performance",
              price: 99900,
              monthlyFrom: 999,
              badge: "Performance",
              badgeColor: "bg-red-500",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
              features: ["V6 Power", '19" Alloy Wheels', "Sport Suspension", "Performance Tires"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
            {
              name: "V6 XLE",
              description: "Premium V6 with luxury features",
              price: 110900,
              monthlyFrom: 1109,
              badge: "Most Popular",
              badgeColor: "bg-primary",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
              features: ["Leather Interior", "Performance Brakes", "Panoramic Moonroof", "Premium Sound"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
            {
              name: "V6 Limited",
              description: "Ultimate V6 luxury experience",
              price: 123900,
              monthlyFrom: 1239,
              badge: "Premium",
              badgeColor: "bg-gray-800",
              image:
                "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
              features: ["Ventilated Seats", "Head-up Display", "Advanced Safety", "JBL Premium Audio"],
              specs: {
                engine: "3.5L V6",
                power: "301 HP",
                torque: "362 Nm",
                transmission: "8-Speed Auto",
                acceleration: "6.6 s",
                fuelEconomy: "18.4 km/L",
              },
            },
          ];
    return baseGrades as any[];
  }, [selectedEngine]);

  const currentGrade = useMemo(() => {
    if (!grades || grades.length === 0) return null;
    const validIndex = Math.max(0, Math.min(selectedGrade, grades.length - 1));
    return (grades as any[])[validIndex] || (grades as any[])[0] || null;
  }, [grades, selectedGrade]);

  const handleEngineChange = useCallback(
    async (engineName: string) => {
      if (engineName === selectedEngine) return;
      setIsGradeLoading(true);
      setSelectedEngine(engineName);
      setSelectedGrade(0);
      setCompareSet([]); // reset on engine switch
      setAnimationKey((prev) => prev + 1);
      await new Promise((r) => setTimeout(r, performanceConfig.animations.duration * 1000));
      setIsGradeLoading(false);
      contextualHaptic.selectionChange();
    },
    [selectedEngine, performanceConfig.animations.duration]
  );

  const handleConfigureGrade = useCallback(
    (grade?: any) => {
      const gradeToUse = grade || currentGrade;
      if (!gradeToUse) return;
      onCarBuilder?.(gradeToUse.name);
      contextualHaptic.buttonPress();
    },
    [currentGrade, onCarBuilder]
  );

  const handleTestDriveGrade = useCallback(
    (_grade?: any) => {
      onTestDrive?.();
      contextualHaptic.buttonPress();
    },
    [onTestDrive]
  );

  const handleCompareGrades = useCallback(() => {
    setIsCompareOpen(true);
    contextualHaptic.buttonPress();
  }, []);

  const toggleCompare = useCallback((idx: number) => {
    setCompareSet((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : prev.length < 3 ? [...prev, idx] : prev
    );
    contextualHaptic.selectionChange();
  }, []);

  const removeFromCompare = useCallback((idx: number) => {
    setCompareSet((prev) => prev.filter((i) => i !== idx));
    contextualHaptic.selectionChange();
  }, []);

  const clearCompare = useCallback(() => {
    setCompareSet([]);
    contextualHaptic.selectionChange();
  }, []);

  const renderGradesSkeleton = useCallback(
    () => (
      <div className="grid lg:grid-cols-3 gap-6 px-4 lg:px-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-0">
              <Skeleton className="w-full h-56 rounded-t-lg" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    []
  );

  if (!isIntersecting && typeof window !== "undefined") {
    return <div ref={targetRef} className="h-96" />;
  }

  return (
    <>
      <section ref={targetRef} className="py-8 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="toyota-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 lg:mb-12"
            variants={adaptiveVariants.fadeInUp}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-2 rounded-full text-sm font-medium mb-4 lg:mb-6">
              <Settings className="h-4 w-4 mr-2" />
              Interactive Experience
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-black text-foreground mb-3 lg:mb-4 leading-tight">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Configuration
              </span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Pick a powertrain and explore trims. Clean tiles, quick comparison, faster decisions.
            </p>
          </motion.div>

          {/* Engine selection (unchanged) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 lg:mb-12"
            variants={adaptiveVariants.fadeInUp}
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 1: Choose Your Powertrain</h3>
            </div>

            {/* Mobile tiles */}
            {useIsMobile() ? (
              <div className="grid grid-cols-2 gap-2 px-4 max-w-4xl mx-auto">
                {engines.map((engine) => {
                  const selected = engine.selected;
                  return (
                    <motion.button
                      key={engine.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEngineChange(engine.name)}
                      className={[
                        "group relative rounded-xl border text-left transition-all",
                        "p-3 min-h-0 h-auto",
                        selected ? "border-primary ring-2 ring-primary/60 shadow-sm" : "border-border hover:border-primary/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "inline-flex shrink-0 items-center justify-center rounded-full",
                            "h-7 w-7",
                            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          ].join(" ")}
                        >
                          {React.cloneElement(engine.icon, { className: "h-3.5 w-3.5" })}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{engine.name.replace("L ", "")}</div>
                          <div className="text-[10px] text-muted-foreground leading-tight">
                            {engine.power} • {engine.efficiency}
                          </div>
                        </div>
                        {selected && (
                          <span className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {engines.map((engine) => (
                  <motion.div
                    key={engine.name}
                    whileHover={performanceConfig.animations.enabled ? microAnimations.buttonHover : undefined}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer transition-all duration-200 ${engine.selected ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleEngineChange(engine.name)}
                  >
                    <Card className={`h-full ${engine.selected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"}`}>
                      <CardContent className="px-6 py-4">
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              engine.selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {React.cloneElement(engine.icon, { className: "h-6 w-6" })}
                          </div>
                          <AnimatePresence>
                            {engine.selected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: performanceConfig.animations.duration }}
                                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                              >
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <h4 className="text-lg lg:text-xl font-bold mb-1">{engine.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{engine.description}</p>

                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="font-semibold">{engine.power}</div>
                            <div className="text-muted-foreground text-xs">POWER</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{engine.efficiency}</div>
                            <div className="text-muted-foreground text-xs">EFFICIENCY</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Step 2: WHOLE SECTION = 3D CAROUSEL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 lg:mb-12"
            variants={adaptiveVariants.fadeInUp}
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 2: Choose Your Grade</h3>
              <Button variant="outline" className="gap-2 min-h-[44px]" onClick={handleCompareGrades} disabled={(grades as any[]).length === 0}>
                <ArrowUpDown className="h-4 w-4" />
                Compare Grades
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {isGradeLoading ? (
                <motion.div key={`loading-${animationKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: performanceConfig.animations.duration }}>
                  {renderGradesSkeleton()}
                </motion.div>
              ) : prefersReducedMotion ? (
                // ♿ Fallback grid when reduced motion is ON
                <motion.div
                  key={`grid-fallback-${animationKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: performanceConfig.animations.duration * 1.5 }}
                  className="grid lg:grid-cols-3 gap-6 px-4 lg:px-0"
                >
                  {(grades as any[]).map((grade: any, index) => {
                    const selected = index === selectedGrade;
                    const isCompared = compareSet.includes(index);
                    const img = grade.image || (grade.gallery?.[0] ?? FALLBACK_IMG);

                    return (
                      <Card
                        key={`${grade.name}-${index}`}
                        className={`h-full ${selected ? "border-primary shadow-lg ring-2 ring-primary" : "border-border hover:border-primary/50"}`}
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            {grade.badge && (
                              <Badge className={`absolute top-4 left-4 z-10 ${grade.badgeColor} text-white px-3 py-1 text-sm font-medium`}>{grade.badge}</Badge>
                            )}
                            <button
                              aria-pressed={isCompared}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(index);
                              }}
                              className={`absolute top-4 right-4 z-10 rounded-full px-3 h-8 text-xs border ${isCompared ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 border-border"}`}
                            >
                              {isCompared ? "Added" : "Add to compare"}
                            </button>
                            <img src={img} alt={grade.name} className="w-full h-56 object-cover rounded-t-lg" loading="lazy" />
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                  <h4 className="text-xl font-bold">{grade.name}</h4>
                                </div>
                                <div className="text-sm text-muted-foreground">{grade?.specs?.engine}</div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-2xl font-black">AED {grade.price.toLocaleString()}</div>
                            </div>

                            <ul className="text-sm text-muted-foreground space-y-1">
                              {grade.features.slice(0, 2).map((f: string) => (
                                <li key={f} className="flex gap-2 items-center">
                                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="h-2 w-2 text-primary-foreground" />
                                  </div>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="flex gap-2 pt-2">
                              <Button className="flex-1" onClick={() => handleConfigureGrade(grade)}>
                                Build & Price
                              </Button>
                              <Button variant="outline" onClick={() => handleTestDriveGrade(grade)}>
                                Test Drive
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </motion.div>
              ) : (
                // ✨ FULL 3D CAROUSEL (entire Step 2)
                <div className="px-2 lg:px-0">
                  <ThreeDCarousel
                    key={`3d-${animationKey}`}
                    items={grades as any[]}
                    onActiveIndexChange={(idx) => {
                      if (idx !== selectedGrade) {
                        setSelectedGrade(idx);
                        contextualHaptic.selectionChange();
                      }
                    }}
                    // 👉 Desktop big + wide / Mobile tuned below
                    radius={isMobile ? 260 : 360}
                    cardW={isMobile ? 210 : 280}
                    cardH={isMobile ? 280 : 360}
                    reducedMotion={!!prefersReducedMotion}
                    autoSpinSpeed={0.05}
                    idleTimeout={1600}
                    renderItem={(grade: any, index, isActive) => {
                      const isCompared = compareSet.includes(index);
                      const img = grade.image || (grade.gallery?.[0] ?? FALLBACK_IMG);

                      return (
                        <div className="w-full h-full flex flex-col">
                          {/* Media */}
                          <div className="relative h-[55%] min-h-[150px]">
                            {grade.badge && (
                              <Badge className={`absolute top-3 left-3 z-10 ${grade.badgeColor} text-white px-2 py-0.5 text-xs`}>
                                {grade.badge}
                              </Badge>
                            )}
                            <button
                              aria-pressed={isCompared}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(index);
                              }}
                              className={`absolute top-3 right-3 z-10 rounded-full px-2 h-7 text-[11px] border ${isCompared ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 border-border"}`}
                            >
                              {isCompared ? "Added" : "Compare"}
                            </button>
                            <img src={img} alt={grade.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                          </div>

                          {/* Content */}
                          <div className={`flex-1 p-4 sm:p-5 ${isActive ? "" : "opacity-90"}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <h4 className="text-base sm:text-lg font-bold">{grade.name}</h4>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{grade?.specs?.engine}</div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="text-xl sm:text-2xl font-black">AED {grade.price.toLocaleString()}</div>
                            </div>

                            <ul className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-1">
                              {Array.isArray(grade.features) &&
                                grade.features.slice(0, 2).map((f: string) => (
                                  <li key={f} className="flex gap-2 items-center">
                                    <div className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                                      <Check className="h-2 w-2 text-primary-foreground" />
                                    </div>
                                    <span>{f}</span>
                                  </li>
                                ))}
                            </ul>

                            <div className="mt-3 flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfigureGrade(grade);
                                }}
                              >
                                Build & Price
                              </Button>
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTestDriveGrade(grade);
                                }}
                              >
                                Test Drive
                              </Button>
                            </div>
                          </div>

                          {/* Active indicator glow */}
                          {isActive && <div className="absolute inset-0 ring-2 ring-primary/70 rounded-2xl pointer-events-none" />}
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Desktop sticky compare bar */}
      {!isMobile && compareSet.length > 1 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="mx-auto max-w-6xl rounded-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium mr-1">{compareSet.length} grades selected</span>
              {compareSet.map((i) => (
                <span key={`${(grades as any[])[i]?.name}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted">
                  {(grades as any[])[i]?.name ?? `Grade ${i + 1}`}
                  <button aria-label="Remove" onClick={() => removeFromCompare(i)} className="ml-1 rounded p-0.5 hover:bg-background">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearCompare}>
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsCompareOpen(true)} disabled={compareSet.length < 2}>
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB compare button */}
      {isMobile && compareSet.length > 1 && (
        <div className="fixed z-50 right-4" style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <Button onClick={() => setIsCompareOpen(true)} className="rounded-full shadow-lg h-12 px-5">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Compare ({compareSet.length})
          </Button>
        </div>
      )}

      {/* Compare Modal */}
      <LuxuryComparisonTool
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        grades={(grades as any[]).map((g: any, i: number) => ({
          id: `${g.name}-${i}`,
          highlights: Array.isArray(g.features) ? g.features.slice(0, 3) : [],
          badgeColor: (g as any).badgeColor ?? "bg-primary",
          ...g,
        }))}
        onTestDrive={() => onTestDrive?.()}
        onGetQuote={(gradeId) => onCarBuilder?.(gradeId)}
      />
    </>
  );
};

export default VehicleConfiguration;
