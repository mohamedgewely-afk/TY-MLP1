import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { VehicleModel } from "@/types/vehicle";
import {
  Zap,
  Shield,
  Smartphone,
  Wind,
  Settings,
  Check,
  ChevronLeft,
  ChevronRight,
  Minimize2,
} from "lucide-react";

/**
 * Toyota Luxe v14 — Monochrome with Cinematic Fullscreen Transitions
 *
 * - Strict black & white palette.
 * - Tesla/Porsche‑inspired edge‑to‑edge fullscreen transitions.
 * - Clicking an image smoothly expands it to cover the viewport with fade/scale animation.
 */

interface RefinedTechExperienceProps { vehicle: VehicleModel }

interface TechFeature {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  media: { type: "image" | "video"; url: string; alt?: string }[];
}

const RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const RefinedTechExperience: React.FC<RefinedTechExperienceProps> = ({ vehicle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const touchX = useRef<number | null>(null);

  const tech: TechFeature[] = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      subtitle: "Instant electric response",
      description: "Effortlessly blends electric torque with gasoline range for serene, efficient progress.",
      icon: <Zap className="h-5 w-5" />, 
      features: ["Seamless EV↔ICE transitions","Regenerative braking","Silent EV mode","Battery monitoring"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true", alt: "Toyota hybrid cutaway" }],
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      subtitle: "Predictive protection",
      description: "AI-powered collision prevention and smart driver assistance, always on in the background.",
      icon: <Shield className="h-5 w-5" />, 
      features: ["Pre‑Collision w/ Pedestrian Detection","Lane Departure Alert","Radar Cruise Control","Road Sign Assist"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true", alt: "Toyota Safety Sense sensors" }],
    },
    {
      id: "connected-tech",
      title: "Connected Intelligence",
      subtitle: "Seamless phone + voice",
      description: "Wireless CarPlay/Android Auto, natural voice control, and a premium JBL soundstage.",
      icon: <Smartphone className="h-5 w-5" />, 
      features: ["Wireless Apple CarPlay & Android Auto","Premium JBL audio","Voice recognition","Remote start"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true", alt: "Toyota infotainment UI" }],
    },
    {
      id: "climate-control",
      title: "Climate Harmony",
      subtitle: "Purified, optimized air",
      description: "Dual‑zone climate with HEPA‑grade filtration and eco‑smart cooling.",
      icon: <Wind className="h-5 w-5" />, 
      features: ["Dual‑zone control","HEPA filtration","UV sterilization","Eco mode"],
      media: [{ type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true", alt: "Toyota climate dials" }],
    },
  ];

  const feature = tech[activeIndex];
  const next = () => setActiveIndex((i) => (i + 1) % tech.length);
  const prev = () => setActiveIndex((i) => (i - 1 + tech.length) % tech.length);

  const onTouchStart: React.TouchEventHandler = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setIsFs(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="py-12 md:py-20 bg-white text-black" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8 md:mb-14 text-center">
          <h2 className="text-[22px] sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
            Refined Technology Experience
          </h2>
          <p className="mt-3 text-sm md:text-base text-neutral-600 max-w-2xl mx-auto">
            Precision, comfort, and intelligence — designed with minimalism.
          </p>
        </div>

        {/* Media with cinematic fullscreen trigger */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={feature.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }}>
              <div className="relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-300 bg-black" style={{ aspectRatio: "16/9" }} onClick={() => setIsFs(true)}>
                {feature.media[0].type === "image" ? (
                  <img src={feature.media[0].url} alt={feature.media[0].alt || feature.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                ) : (
                  <video src={feature.media[0].url} className="h-full w-full object-cover" autoPlay muted loop />
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button onClick={prev} className="px-4 py-2 border border-neutral-400 rounded-full text-sm hover:bg-neutral-100">Prev</button>
                <div className="flex gap-2">
                  {tech.map((t,i)=>(<button key={t.id} onClick={()=>setActiveIndex(i)} className={`h-2.5 w-2.5 rounded-full transition ${i===activeIndex?"bg-black scale-110":"bg-neutral-400 hover:bg-neutral-500"}`} aria-current={i===activeIndex}/>))}
                </div>
                <button onClick={next} className="px-4 py-2 border border-neutral-400 rounded-full text-sm hover:bg-neutral-100">Next</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Details below */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 bg-black text-white">
              {feature.icon}
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-semibold leading-tight">{feature.title}</h3>
              {feature.subtitle && <p className="text-xs text-neutral-500">{feature.subtitle}</p>}
            </div>
          </div>
          <p className="text-sm text-neutral-700">{feature.description}</p>
          <ul className="mt-4 grid grid-cols-1 gap-y-1.5">
            {feature.features.map((f,i)=>(<li key={i} className="flex items-start text-sm text-neutral-800"><Check className="mt-[2px] mr-2 h-4 w-4 text-black"/> {f}</li>))}
          </ul>
        </div>
      </div>

      {/* Cinematic fullscreen */}
      <AnimatePresence>
        {isFs && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} role="dialog" aria-modal="true" className="fixed inset-0 z-[70] bg-black flex items-center justify-center" onClick={()=>setIsFs(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ duration: 0.5 }} className="relative w-full h-full flex items-center justify-center" onClick={(e)=>e.stopPropagation()}>
              {feature.media[0].type === "image" ? (
                <img src={feature.media[0].url} alt={feature.media[0].alt || feature.title} className="w-full h-full object-contain" />
              ) : (
                <video src={feature.media[0].url} className="w-full h-full object-contain" autoPlay muted loop />
              )}
              <button onClick={()=>setIsFs(false)} className="absolute top-4 right-4 rounded-full bg-white text-black p-2 border border-neutral-300 shadow-sm" aria-label="Exit fullscreen"><Minimize2 className="h-5 w-5"/></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RefinedTechExperience;