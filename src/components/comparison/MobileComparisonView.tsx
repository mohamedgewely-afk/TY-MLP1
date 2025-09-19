
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Crown, 
  Sparkles, 
  Star, 
  Award, 
  ChevronRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileComparisonViewProps {
  vehicles: VehicleModel[];
  sections: Array<{
    title: string;
    items: Array<{
      label: string;
      getValue: (v: VehicleModel) => string;
    }>;
  }>;
  showOnlyDifferences: boolean;
  onShowDifferencesChange: (value: boolean) => void;
  onRemove: (name: string) => void;
  onClearAll?: () => void;
  slideInRef: React.RefObject<HTMLDivElement>;
}

const MobileComparisonView: React.FC<MobileComparisonViewProps> = ({
  vehicles,
  sections,
  showOnlyDifferences,
  onShowDifferencesChange,
  onRemove,
  onClearAll,
  slideInRef,
}) => {
  const [currentVehicleIndex, setCurrentVehicleIndex] = React.useState(0);

  return (
    <motion.div
      ref={slideInRef}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, rgba(55, 65, 81, 0.98) 0%, rgba(31, 41, 55, 1) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-900/15 via-transparent to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 6,
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-blue-500/20 backdrop-blur-2xl">
        <div className="bg-gradient-to-r from-gray-700/95 via-gray-800/98 to-gray-700/95 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Crown className="h-6 w-6 text-blue-500 animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 bg-blue-500/20 rounded-full blur-lg animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Vehicle Comparison
                </h2>
                <p className="text-gray-400 text-xs">Premium vehicle analysis</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-2 h-8 w-8 bg-gray-700/60 border border-gray-600/40 text-gray-300 hover:bg-blue-600/20 hover:text-white hover:border-blue-500/50 backdrop-blur-xl transition-all duration-500"
              onClick={onClearAll}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 relative z-10">
        {/* Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-400/20 text-blue-200 border border-blue-400/30 backdrop-blur-xl">
              <TrendingUp className="h-3 w-3 mr-1" />
              {vehicles.length} Vehicles
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowDifferencesChange(!showOnlyDifferences)}
              className="bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
            >
              <Shield className="h-4 w-4 mr-2" />
              {showOnlyDifferences ? "Show All" : "Differences"}
            </Button>
          </div>

          {/* Vehicle Navigation */}
          {vehicles.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {vehicles.map((vehicle, index) => (
                <button
                  key={vehicle.name}
                  onClick={() => setCurrentVehicleIndex(index)}
                  className={`
                    shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-500
                    ${index === currentVehicleIndex
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-300 bg-gray-700/50 border border-gray-600/50 hover:text-white hover:bg-gray-600/70 hover:border-blue-500/30"}
                    backdrop-blur-xl
                  `}
                >
                  <span className="truncate max-w-[120px] block">
                    {vehicle.name.split(' ').slice(-2).join(' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Vehicle Display */}
        <AnimatePresence mode="wait">
          {vehicles.map((vehicle, index) => 
            index === currentVehicleIndex && (
              <motion.div
                key={vehicle.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                {/* Vehicle Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700/80 to-gray-800/90 border border-gray-600/30 shadow-2xl backdrop-blur-2xl">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 transition-colors duration-500" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 transition-colors duration-500" />

                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    {/* Premium badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-0 shadow-xl backdrop-blur-xl">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-blue-600/20 hover:border-blue-500/50"
                      onClick={() => onRemove(vehicle.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {vehicle.name}
                    </h3>
                    
                    {/* Price Display */}
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-blue-500/15 to-blue-400/10 border border-blue-500/20 backdrop-blur-xl">
                      <div className="text-2xl font-black text-white mb-1">
                        AED {vehicle.price.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">Starting price</div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-500"
                        asChild
                      >
                        <a href="/enquire">
                          <Crown className="h-4 w-4 mr-2" />
                          Enquire Now
                        </a>
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
                          asChild
                        >
                          <a href={vehicle.configureUrl}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Configure
                          </a>
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-200 hover:from-blue-600/30 hover:to-blue-500/30 hover:text-white backdrop-blur-xl transition-all duration-500"
                          asChild
                        >
                          <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                            <Star className="h-4 w-4 mr-2" />
                            Test Drive
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Specifications Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            const visibleItems = showOnlyDifferences
              ? section.items.filter(item => {
                  const values = vehicles.map(v => item.getValue(v));
                  return new Set(values).size > 1;
                })
              : section.items;

            if (visibleItems.length === 0) return null;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-700/60 to-gray-800/80 border border-gray-600/30 shadow-xl backdrop-blur-2xl"
              >
                {/* Section Header */}
                <div className="p-4 border-b border-gray-600/30 bg-gradient-to-r from-blue-600/10 via-blue-500/15 to-blue-400/10">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <ChevronRight className="h-5 w-5 mr-2 text-blue-400" />
                    {section.title}
                  </h3>
                </div>

                {/* Specifications */}
                <div className="p-4">
                  <div className="space-y-4">
                    {visibleItems.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.05 }}
                        className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-xl"
                      >
                        <span className="text-gray-300 font-medium text-sm">
                          {item.label}
                        </span>
                        <span className="text-white font-semibold text-sm">
                          {item.getValue(vehicles[currentVehicleIndex])}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Hint */}
        {vehicles.length > 1 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center">
              <ChevronRight className="h-4 w-4 mr-1" />
              Swipe or tap vehicle tabs to compare
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileComparisonView;
