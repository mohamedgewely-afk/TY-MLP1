
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
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Elegant background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent" />
        
        {/* Minimal floating elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
              }}
            />
          ))}
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Premium header */}
      <div className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-xl">
        <div className="bg-background/95 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Vehicle Comparison
                </h2>
                <p className="text-muted-foreground text-sm">Premium analysis suite</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
              onClick={onClearAll}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 relative z-10">
        {/* Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-gradient-to-r from-primary/20 via-primary/25 to-primary/20 text-primary border border-primary/30 backdrop-blur-xl">
              <TrendingUp className="h-3 w-3 mr-1" />
              {vehicles.length} Vehicles
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowDifferencesChange(!showOnlyDifferences)}
              className="bg-muted/60 border-border/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
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
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30"
                      : "text-muted-foreground bg-muted/50 border border-border/50 hover:text-foreground hover:bg-muted/70 hover:border-primary/30"}
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
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/70 to-muted/80 border border-border/30 shadow-2xl backdrop-blur-2xl">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 transition-colors duration-500" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 transition-colors duration-500" />

                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    {/* Premium badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-gradient-to-r from-primary/90 to-primary text-white border-0 shadow-xl backdrop-blur-xl">
                        <Award className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl border border-border/30 text-white hover:bg-primary/20 hover:border-primary/50"
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
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/20 backdrop-blur-xl">
                      <div className="text-2xl font-black text-white mb-1">
                        AED {vehicle.price.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">Starting price</div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/20 transition-all duration-500"
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
                          className="bg-muted/60 border-border/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:border-primary/40 backdrop-blur-xl transition-all duration-500"
                          asChild
                        >
                          <a href={vehicle.configureUrl}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Configure
                          </a>
                        </Button>
                        <Button
                          variant="secondary"
                          className="bg-gradient-to-r from-primary/20 to-primary/20 border border-primary/30 text-foreground/80 hover:from-primary/30 hover:to-primary/30 hover:text-foreground backdrop-blur-xl transition-all duration-500"
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
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/60 to-muted/80 border border-border/30 shadow-xl backdrop-blur-2xl"
              >
                {/* Section Header */}
                <div className="p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <ChevronRight className="h-5 w-5 mr-2 text-primary" />
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
