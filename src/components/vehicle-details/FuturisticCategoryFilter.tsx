
import React from "react";

const TOYOTA_RED = "#EB0A1E" as const;

export type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night";

interface FuturisticCategoryFilterProps {
  categories: SceneCategory[];
  activeFilter: SceneCategory | "All";
  onFilterChange: (filter: SceneCategory | "All") => void;
  allLabel: string;
  className?: string;
}

const FuturisticCategoryFilter: React.FC<FuturisticCategoryFilterProps> = ({
  categories,
  activeFilter,
  onFilterChange,
  allLabel,
  className = "",
}) => {
  const filters = [allLabel, ...categories];

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {filters.map((filter) => {
        const isActive = filter === allLabel ? activeFilter === "All" : activeFilter === filter;
        const filterValue = filter === allLabel ? "All" : (filter as SceneCategory);
        
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filterValue)}
            className={`
              relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300
              ${isActive 
                ? 'text-white shadow-lg transform scale-105' 
                : 'text-white/70 hover:text-white hover:scale-105'
              }
              border backdrop-blur-sm
              ${isActive
                ? 'border-red-500/50 bg-gradient-to-r from-red-600/20 to-red-700/20'
                : 'border-white/20 bg-black/20 hover:border-white/30 hover:bg-black/30'
              }
            `}
            style={isActive ? {
              boxShadow: `0 0 20px ${TOYOTA_RED}40`,
            } : {}}
          >
            {isActive && (
              <div 
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: `conic-gradient(from 0deg, transparent, ${TOYOTA_RED}60, transparent, ${TOYOTA_RED}60, transparent)`,
                }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FuturisticCategoryFilter;
