
import React from "react";
import { motion } from "framer-motion";
import { Zap, GaugeCircle, Navigation, TimerReset, Gauge, BatteryCharging } from "lucide-react";

const TOYOTA_RED = "#EB0A1E" as const;

interface FuturisticSceneCardProps {
  data: {
    id: string;
    title: string;
    scene: string;
    image: string;
    description: string;
    specs: Record<string, string>;
  };
  active: boolean;
  onEnter: () => void;
  onFocus: () => void;
  tabIndex: number;
  ariaLabel: string;
  expandLabel: string;
}

const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-4 h-4" aria-hidden />,
  torque: <GaugeCircle className="w-4 h-4" aria-hidden />,
  range: <Navigation className="w-4 h-4" aria-hidden />,
  zerotosixty: <TimerReset className="w-4 h-4" aria-hidden />,
  topspeed: <Gauge className="w-4 h-4" aria-hidden />,
  battery: <BatteryCharging className="w-4 h-4" aria-hidden />,
  fueleconomy: <Gauge className="w-4 h-4" aria-hidden />,
  drivetrain: <Navigation className="w-4 h-4" aria-hidden />,
  suspension: <GaugeCircle className="w-4 h-4" aria-hidden />,
  seats: <Gauge className="w-4 h-4" aria-hidden />,
  safety: <GaugeCircle className="w-4 h-4" aria-hidden />,
};

export default function FuturisticSceneCard({
  data,
  active,
  onEnter,
  onFocus,
  tabIndex,
  ariaLabel,
  expandLabel,
}: FuturisticSceneCardProps) {
  return (
    <motion.article
      className={`
        snap-center shrink-0 relative
        min-w-[300px] max-w-[300px]
        sm:min-w-[340px] sm:max-w-[340px]
        md:min-w-[420px] md:max-w-[420px]
        lg:min-w-[480px] lg:max-w-[480px]
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-zinc-950/90 via-zinc-900/90 to-black/90
        backdrop-blur-xl border border-white/10
        ${active ? 'shadow-[0_0_40px_rgba(235,10,30,0.3)]' : 'shadow-xl'}
      `}
      initial={false}
      animate={{
        scale: active ? 1.02 : 1,
        y: active ? -8 : 0,
        boxShadow: active
          ? `0 0 40px rgba(235, 10, 30, 0.3), 0 20px 40px rgba(0, 0, 0, 0.4)`
          : "0 10px 25px rgba(0, 0, 0, 0.2)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Holographic border effect */}
      {active && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-75 animate-pulse"
          style={{
            background: `linear-gradient(45deg, transparent, ${TOYOTA_RED}33, transparent, ${TOYOTA_RED}33, transparent)`,
            backgroundSize: '200% 200%',
          }}
        />
      )}

      <button
        type="button"
        onClick={onEnter}
        onFocus={onFocus}
        className="relative w-full text-left focus-visible:outline-none group"
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      >
        {/* Image with futuristic overlay */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={data.image}
            alt={`${data.title} • ${data.scene}`}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Cyberpunk grid overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(235,10,30,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(235,10,30,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute left-0 right-0 bottom-0 p-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-lg">
                {data.title}
              </h3>
              <p 
                className="text-sm font-medium drop-shadow-md"
                style={{ color: TOYOTA_RED }}
              >
                {data.scene}
              </p>
            </div>
            <span 
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border backdrop-blur-sm transition-all"
              style={{
                backgroundColor: `${TOYOTA_RED}15`,
                borderColor: `${TOYOTA_RED}40`,
                color: TOYOTA_RED,
                boxShadow: `0 0 20px ${TOYOTA_RED}30`,
              }}
            >
              {expandLabel}
            </span>
          </div>
        </div>

        {/* Specs section */}
        <div className="p-4">
          <p className="text-white/85 text-sm mb-4 leading-relaxed">
            {data.description}
          </p>
          
          <div className="grid grid-cols-2 gap-2.5">
            {Object.entries(data.specs).slice(0, 4).map(([key, val], i) => {
              const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2.5 rounded-xl p-2.5 bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/5 hover:border-white/15 transition-all group/spec"
                >
                  <span 
                    className="transition-all group-hover/spec:drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: TOYOTA_RED }}
                  >
                    {specIcons[normalized] ?? <Gauge className="w-4 h-4" aria-hidden />}
                  </span>
                  <div className="text-xs leading-tight">
                    <div className="uppercase tracking-wider text-white/50 text-[10px] font-medium">
                      {key}
                    </div>
                    <div className="font-semibold text-white">
                      {val}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </button>
    </motion.article>
  );
}
