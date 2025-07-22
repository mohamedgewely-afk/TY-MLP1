
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X, Car, Calculator, ArrowUpDown, Eye, ChevronLeft } from "lucide-react";
import CompareControlsBar from "./CompareControlsBar";
import { hasDifferences } from "./ComparisonSection";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useSwipeable } from "@/hooks/use-swipeable";

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
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
      {/* Header - Fixed and responsive */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-toyota-red/10 p-2 rounded-full">
              <ArrowUpDown className="h-5 w-5 text-toyota-red" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Compare Vehicles</h2>
              <p className="text-sm text-gray-500">{vehicles.length} selected</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2 h-9 w-9"
            onClick={onClearAll}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Vehicle Selector Tabs - Scrollable */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle.name}
                onClick={() => setSelectedVehicleIndex(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedVehicleIndex === index
                    ? 'bg-toyota-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {vehicle.name.replace('Toyota ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle - Responsive */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className="flex-1 text-xs sm:text-sm"
            >
              <Eye className="h-4 w-4 mr-1 sm:mr-2" />
              Overview
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="flex-1 text-xs sm:text-sm"
            >
              <Calculator className="h-4 w-4 mr-1 sm:mr-2" />
              Compare
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
              className="p-4 space-y-6"
            >
              {/* Selected Vehicle Highlight */}
              <div className="bg-gradient-to-r from-toyota-red/5 to-toyota-blue/5 rounded-2xl p-4 sm:p-6">
                <div className="relative">
                  <img
                    src={vehicles[selectedVehicleIndex].image}
                    alt={vehicles[selectedVehicleIndex].name}
                    className="w-full h-40 sm:h-48 object-cover rounded-xl"
                  />
                  <Badge className="absolute top-3 left-3 bg-toyota-red text-xs">
                    {vehicles[selectedVehicleIndex].category}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {vehicles[selectedVehicleIndex].name}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-toyota-red mt-1">
                    From AED {vehicles[selectedVehicleIndex].price.toLocaleString()}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="default" size="sm" className="bg-toyota-red text-xs sm:text-sm" asChild>
                      <a href={`/test-drive?model=${encodeURIComponent(vehicles[selectedVehicleIndex].name)}`}>
                        <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Test Drive
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                      <a href={`/vehicle/${vehicles[selectedVehicleIndex].name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Details
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Comparison Grid - All vehicles */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Quick Comparison</h4>
                
                {/* Vehicle Cards */}
                <div className="space-y-3">
                  {vehicles.map((vehicle, idx) => (
                    <motion.div
                      key={vehicle.name}
                      className={`p-4 rounded-xl border transition-all ${
                        idx === selectedVehicleIndex 
                          ? 'border-toyota-red bg-toyota-red/5' 
                          : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => setSelectedVehicleIndex(idx)}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{vehicle.name}</h5>
                          <p className="text-toyota-red font-semibold text-xs">
                            AED {vehicle.price.toLocaleString()}
                          </p>
                        </div>
                        {idx === selectedVehicleIndex && (
                          <div className="w-2 h-2 bg-toyota-red rounded-full" />
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
              className="p-4"
            >
              {/* Comparison Controls */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Detailed Comparison</h3>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-600">Show differences only</label>
                    <button
                      onClick={() => onShowDifferencesChange(!showOnlyDifferences)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        showOnlyDifferences ? 'bg-toyota-red' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        showOnlyDifferences ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {section.items.map((item) => (
                        !showOnlyDifferences || hasDifferences(item.getValue, vehicles) ? (
                          <div key={item.label} className="p-3">
                            <div className="font-medium text-xs text-gray-700 mb-2">{item.label}</div>
                            <div className="space-y-1">
                              {vehicles.map((vehicle, idx) => (
                                <div 
                                  key={`${vehicle.name}-${item.label}`}
                                  className={`flex justify-between items-center p-2 rounded-lg text-xs ${
                                    idx === selectedVehicleIndex 
                                      ? 'bg-toyota-red/10 border border-toyota-red/20' 
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <span className="font-medium text-gray-600 truncate flex-1 mr-2">
                                    {vehicle.name.replace('Toyota ', '')}
                                  </span>
                                  <span className={`font-semibold text-right ${
                                    idx === selectedVehicleIndex ? 'text-toyota-red' : 'text-gray-900'
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

      {/* Footer Actions - Fixed */}
      <div className="flex-shrink-0 bg-white border-t p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClearAll} className="text-sm">
            Close
          </Button>
          <Button className="bg-toyota-red text-sm" asChild>
            <a href="/enquire">Get Quote</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileComparisonView;
