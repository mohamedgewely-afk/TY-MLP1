
import React, { memo } from "react";
import { Zap, GaugeCircle, Navigation, TimerReset, Gauge, BatteryCharging } from "lucide-react";

const TOYOTA_RED = "#EB0A1E" as const;

interface OptimizedSceneCardProps {
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
  isDesktop?: boolean;
}

const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-5 h-5" aria-hidden />,
  torque: <GaugeCircle className="w-5 h-5" aria-hidden />,
  range: <Navigation className="w-5 h-5" aria-hidden />,
  zerotosixty: <TimerReset className="w-5 h-5" aria-hidden />,
  topspeed: <Gauge className="w-5 h-5" aria-hidden />,
  battery: <BatteryCharging className="w-5 h-5" aria-hidden />,
  fueleconomy: <Gauge className="w-5 h-5" aria-hidden />,
  drivetrain: <Navigation className="w-5 h-5" aria-hidden />,
  suspension: <GaugeCircle className="w-5 h-5" aria-hidden />,
  seats: <Gauge className="w-5 h-5" aria-hidden />,
  safety: <GaugeCircle className="w-5 h-5" aria-hidden />,
};

const OptimizedSceneCard = memo<OptimizedSceneCardProps>(({
  data,
  active,
  onEnter,
  onFocus,
  tabIndex,
  ariaLabel,
  expandLabel,
  isDesktop = false,
}) => {
  const cardClasses = `
    snap-center shrink-0 relative cursor-pointer
    transition-all duration-300 ease-out
    ${isDesktop ? `
      min-w-[500px] max-w-[600px] lg:min-w-[600px] lg:max-w-[700px]
    ` : `
      min-w-[300px] max-w-[300px]
      sm:min-w-[340px] sm:max-w-[340px]
      md:min-w-[420px] md:max-w-[420px]
    `}
    rounded-2xl overflow-hidden
    bg-gradient-to-br from-zinc-950/90 via-zinc-900/90 to-black/90
    backdrop-blur-xl border border-white/10
    ${active ? 'border-[#EB0A1E]/50 shadow-[0_0_40px_rgba(235,10,30,0.2)]' : 'hover:border-white/20'}
    ${active ? 'scale-[1.02] -translate-y-2' : 'hover:scale-[1.01] hover:-translate-y-1'}
  `;

  return (
    <article className={cardClasses}>
      {/* Holographic border effect - CSS only */}
      {active && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-50 animate-pulse"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${TOYOTA_RED}40, transparent, ${TOYOTA_RED}40, transparent)`,
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
        {/* Enhanced image section for desktop */}
        <div className={`relative overflow-hidden ${isDesktop ? 'h-64 lg:h-80' : 'h-48 sm:h-56 md:h-64'}`}>
          <img
            src={data.image}
            alt={`${data.title} • ${data.scene}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Simplified grid overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(235,10,30,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(235,10,30,0.4) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Enhanced content overlay for desktop */}
          <div className={`absolute left-0 right-0 bottom-0 flex items-end justify-between gap-4 ${isDesktop ? 'p-6' : 'p-4'}`}>
            <div className="min-w-0">
              <h3 className={`font-bold tracking-tight text-white drop-shadow-lg ${isDesktop ? 'text-2xl lg:text-3xl' : 'text-lg sm:text-xl'}`}>
                {data.title}
              </h3>
              <p 
                className={`font-medium drop-shadow-md ${isDesktop ? 'text-lg' : 'text-sm'}`}
                style={{ color: TOYOTA_RED }}
              >
                {data.scene}
              </p>
            </div>
            <span 
              className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-sm transition-all ${isDesktop ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'} font-medium`}
              style={{
                backgroundColor: `${TOYOTA_RED}15`,
                borderColor: `${TOYOTA_RED}40`,
                color: TOYOTA_RED,
              }}
            >
              {expandLabel}
            </span>
          </div>
        </div>

        {/* Enhanced specs section for desktop */}
        <div className={isDesktop ? 'p-6' : 'p-4'}>
          <p className={`text-white/85 leading-relaxed mb-4 ${isDesktop ? 'text-base lg:text-lg' : 'text-sm'}`}>
            {data.description}
          </p>
          
          {/* Enhanced grid for desktop */}
          <div className={`grid gap-3 ${isDesktop ? 'grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'}`}>
            {Object.entries(data.specs).slice(0, isDesktop ? 6 : 4).map(([key, val]) => {
              const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 rounded-xl bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/5 hover:border-white/15 transition-all group/spec ${isDesktop ? 'p-4' : 'p-2.5'}`}
                >
                  <span 
                    className="transition-all group-hover/spec:drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: TOYOTA_RED }}
                  >
                    {specIcons[normalized] ?? <Gauge className={isDesktop ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden />}
                  </span>
                  <div className={isDesktop ? 'text-sm' : 'text-xs'}>
                    <div className={`uppercase tracking-wider text-white/50 font-medium ${isDesktop ? 'text-xs mb-1' : 'text-[10px]'}`}>
                      {key}
                    </div>
                    <div className="font-semibold text-white">
                      {val}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </button>
    </article>
  );
});

OptimizedSceneCard.displayName = "OptimizedSceneCard";

export default OptimizedSceneCard;
