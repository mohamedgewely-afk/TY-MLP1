
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X, Car, Calculator, ArrowUpDown, Eye, ChevronLeft } from "lucide-react";
import CompareControlsBar from "./CompareControlsBar";
import { hasDifferences } from "./ComparisonSection";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useResponsiveSize } from "@/hooks/use-device-info";

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
}

const MobileComparisonView: React.FC<MobileComparisonViewProps> = ({
  vehicles,
  sections,
  showOnlyDifferences,
  onShowDifferencesChange,
  onRemove,
  onClearAll,
}) => {
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const { containerPadding, buttonSize, textSize, touchTarget } = useResponsiveSize();

  // Add swipe functionality for vehicle selection
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (selectedVehicleIndex < vehicles.length - 1) {
        setSelectedVehicleIndex(prev => prev + 1);
      }
    },
    onSwipeRight: () => {
      if (selectedVehicleIndex > 0) {
        setSelectedVehicleIndex(prev => prev - 1);
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden flex flex-col">
      {/* Header - Fixed and responsive */}
      <div className="flex-shrink-0 bg-background border-b shadow-sm z-10">
        <div className={`flex items-center justify-between ${containerPadding} py-3`}>
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
              <ArrowUpDown className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`${textSize.base} font-bold text-foreground truncate`}>Compare Vehicles</h2>
              <p className={`${textSize.xs} text-muted-foreground`}>{vehicles.length} selected</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${touchTarget} flex-shrink-0`}
            onClick={onClearAll}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Vehicle Selector Tabs - Fully responsive */}
        <div className={`${containerPadding} pb-3`}>
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle.name}
                onClick={() => setSelectedVehicleIndex(index)}
                className={`flex-shrink-0 px-3 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${touchTarget} ${textSize.xs} ${
                  selectedVehicleIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {vehicle.name.replace('Toyota ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle - Fully responsive */}
        <div className={`${containerPadding} pb-3`}>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className={`flex-1 ${touchTarget} ${buttonSize}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="truncate">Overview</span>
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className={`flex-1 ${touchTarget} ${buttonSize}`}
            >
              <Calculator className="h-4 w-4 mr-2" />
              <span className="truncate">Compare</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable with Swipe */}
      <div className="flex-1 overflow-y-auto" ref={swipeableRef}>
        <AnimatePresence mode="wait">
          {viewMode === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`${containerPadding} py-4 space-y-4`}
            >
              {/* Selected Vehicle Highlight - Fully responsive */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-4">
                <div className="relative">
                  <img
                    src={vehicles[selectedVehicleIndex].image}
                    alt={vehicles[selectedVehicleIndex].name}
                    className="w-full h-32 sm:h-40 object-cover rounded-xl"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary text-xs">
                    {vehicles[selectedVehicleIndex].category}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <h3 className={`${textSize.base} font-bold text-foreground truncate`}>
                    {vehicles[selectedVehicleIndex].name}
                  </h3>
                  <p className={`${textSize.sm} font-semibold text-primary mt-1`}>
                    From AED {vehicles[selectedVehicleIndex].price.toLocaleString()}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button variant="default" size="sm" className={`bg-primary ${touchTarget} ${buttonSize}`} asChild>
                      <a href={`/test-drive?model=${encodeURIComponent(vehicles[selectedVehicleIndex].name)}`}>
                        <Car className="h-4 w-4 mr-2" />
                        <span className="truncate">Test Drive</span>
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className={`${touchTarget} ${buttonSize}`} asChild>
                      <a href={`/vehicle/${vehicles[selectedVehicleIndex].name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <span className="truncate">View Details</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Comparison Grid - Fully responsive */}
              <div className="space-y-3">
                <h4 className={`${textSize.sm} font-semibold text-foreground`}>Quick Comparison</h4>
                
                {/* Vehicle Cards - Fully responsive */}
                <div className="space-y-2">
                  {vehicles.map((vehicle, idx) => (
                    <motion.div
                      key={vehicle.name}
                      className={`p-3 rounded-xl border transition-all ${touchTarget} ${
                        idx === selectedVehicleIndex 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card'
                      }`}
                      onClick={() => setSelectedVehicleIndex(idx)}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className={`${textSize.sm} font-medium truncate`}>{vehicle.name}</h5>
                          <p className={`${textSize.xs} text-primary font-semibold`}>
                            AED {vehicle.price.toLocaleString()}
                          </p>
                        </div>
                        {idx === selectedVehicleIndex && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`${containerPadding} py-4`}
            >
              {/* Comparison Controls - Fully responsive */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${textSize.sm} font-semibold text-foreground`}>Detailed Comparison</h3>
                  <div className="flex items-center space-x-2">
                    <label className={`${textSize.xs} text-muted-foreground`}>Show differences only</label>
                    <button
                      onClick={() => onShowDifferencesChange(!showOnlyDifferences)}
                      className={`w-8 h-5 rounded-full transition-colors ${
                        showOnlyDifferences ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-background rounded-full transition-transform ${
                        showOnlyDifferences ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison - Fully responsive */}
              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section.title} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="bg-muted/50 px-3 py-2 border-b">
                      <h3 className={`${textSize.sm} font-semibold text-foreground`}>{section.title}</h3>
                    </div>
                    
                    <div className="divide-y divide-border">
                      {section.items.map((item) => (
                        !showOnlyDifferences || hasDifferences(item.getValue, vehicles) ? (
                          <div key={item.label} className="p-3">
                            <div className={`${textSize.xs} font-medium text-muted-foreground mb-2`}>{item.label}</div>
                            <div className="space-y-1">
                              {vehicles.map((vehicle, idx) => (
                                <div 
                                  key={`${vehicle.name}-${item.label}`}
                                  className={`flex justify-between items-center p-2 rounded-lg ${textSize.xs} ${
                                    idx === selectedVehicleIndex 
                                      ? 'bg-primary/10 border border-primary/20' 
                                      : 'bg-muted/50'
                                  }`}
                                >
                                  <span className="font-medium text-muted-foreground truncate flex-1 mr-2">
                                    {vehicle.name.replace('Toyota ', '')}
                                  </span>
                                  <span className={`font-semibold text-right ${
                                    idx === selectedVehicleIndex ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {item.getValue(vehicle)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions - Fixed and responsive */}
      <div className={`flex-shrink-0 bg-background border-t ${containerPadding} py-3`}>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClearAll} className={`${touchTarget} ${buttonSize}`}>
            <span className="truncate">Close</span>
          </Button>
          <Button className={`bg-primary ${touchTarget} ${buttonSize}`} asChild>
            <a href="/enquire">
              <span className="truncate">Get Quote</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileComparisonView;
