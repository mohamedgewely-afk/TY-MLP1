
import React from "react";
import { motion } from "framer-motion";

const TOYOTA_RED = "#EB0A1E" as const;

type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night";

interface FuturisticCategoryFilterProps {
  categories: SceneCategory[];
  activeFilter: SceneCategory | "All";
  onFilterChange: (filter: SceneCategory | "All") => void;
  allLabel: string;
  className?: string;
}

export default function FuturisticCategoryFilter({
  categories,
  activeFilter,
  onFilterChange,
  allLabel,
  className = "",
}: FuturisticCategoryFilterProps) {
  const allCategories = ["All", ...categories] as const;

  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {allCategories.map((category) => {
        const isActive = activeFilter === category;
        const displayName = category === "All" ? allLabel : category;
        
        return (
          <motion.button
            key={category}
            type="button"
            onClick={() => onFilterChange(category as any)}
            className={`
              relative px-6 py-3 rounded-full text-sm font-medium transition-all
              border backdrop-blur-sm overflow-hidden
              ${isActive 
                ? 'text-white shadow-lg' 
                : 'text-white/70 hover:text-white'
              }
            `}
            style={{
              backgroundColor: isActive 
                ? `${TOYOTA_RED}25` 
                : 'rgba(255,255,255,0.05)',
              borderColor: isActive 
                ? `${TOYOTA_RED}70` 
                : 'rgba(255,255,255,0.15)',
              boxShadow: isActive 
                ? `0 0 25px ${TOYOTA_RED}40, 0 8px 16px rgba(0,0,0,0.2)` 
                : '0 4px 8px rgba(0,0,0,0.1)',
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: isActive 
                ? `0 0 35px ${TOYOTA_RED}50, 0 12px 24px rgba(0,0,0,0.3)` 
                : `0 0 20px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.2)`,
            }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isActive}
          >
            {/* Holographic shine effect */}
            {isActive && (
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(45deg, transparent, ${TOYOTA_RED}80, transparent)`,
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}
            
            <span className="relative z-10">{displayName}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
