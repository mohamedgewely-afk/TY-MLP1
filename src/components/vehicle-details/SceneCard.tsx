
import React from "react";
import { motion } from "framer-motion";
import { Gauge, Zap, GaugeCircle, Navigation, TimerReset, BatteryCharging, Sparkles } from "lucide-react";

const TOYOTA_RED = "#EB0A1E";

export interface SceneData {
  id: string;
  title: string;
  scene: string;
  image: string;
  description: string;
  narration?: string;
  specs: Record<string, string>;
}

const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-4 h-4" />,
  torque: <GaugeCircle className="w-4 h-4" />,
  range: <Navigation className="w-4 h-4" />,
  zeroToSixty: <TimerReset className="w-4 h-4" />,
  topSpeed: <Gauge className="w-4 h-4" />,
  battery: <BatteryCharging className="w-4 h-4" />,
  fuelEconomy: <Gauge className="w-4 h-4" />,
  drivetrain: <Navigation className="w-4 h-4" />,
  suspension: <GaugeCircle className="w-4 h-4" />,
  seats: <Gauge className="w-4 h-4" />,
  safety: <GaugeCircle className="w-4 h-4" />,
};

interface SceneCardProps {
  data: SceneData;
  active: boolean;
  onEnter: () => void;
  onFocus: () => void;
}

export default function SceneCard({ data, active, onEnter, onFocus }: SceneCardProps) {
  const topSpecs = Object.entries(data.specs).slice(0, 3);

  return (
    <motion.article
      role="option"
      aria-selected={active}
      tabIndex={0}
      className="snap-center shrink-0 w-[70vw] sm:w-[65vw] md:w-[380px] lg:w-[420px] xl:w-[460px] max-w-[500px] rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden"
      onFocus={onFocus}
      initial={false}
      animate={{
        boxShadow: active
          ? `0 0 0 2px ${TOYOTA_RED}55, 0 12px 30px 0 rgba(0,0,0,0.4)`
          : "0 8px 20px rgba(0,0,0,0.3)",
        y: active ? -1 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <button
        type="button"
        onClick={onEnter}
        className="relative w-full text-left select-none focus-visible:outline-none"
        aria-label={`Open ${data.scene} scene`}
      >
        <div className="relative">
          <img
            src={data.image}
            alt={`${data.title} • ${data.scene}`}
            loading="lazy"
            className="w-full h-44 sm:h-48 md:h-52 lg:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">{data.title}</h3>
                <p className="text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>
                  {data.scene}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/10 backdrop-blur">
                <Sparkles className="w-3.5 h-3.5" style={{ color: TOYOTA_RED }} />
                <span className="text-xs text-white">Explore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <p className="text-white/85 text-sm mb-3 line-clamp-2">{data.description}</p>
          
          <div className="grid grid-cols-1 gap-2">
            {topSpecs.map(([key, val], i) => (
              <div
                key={key}
                className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/4 backdrop-blur px-3 py-2"
              >
                <span style={{ color: TOYOTA_RED }}>{specIcons[key] ?? <Gauge className="w-4 h-4" />}</span>
                <div className="text-xs leading-tight">
                  <div className="uppercase tracking-wider text-white/60 text-[10px] mb-0.5">
                    {key}
                  </div>
                  <div className="font-semibold text-white">{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </button>
    </motion.article>
  );
}
