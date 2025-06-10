
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X, Car, Calculator, ArrowUpDown, Eye } from "lucide-react";
import CompareControlsBar from "./CompareControlsBar";
import { hasDifferences } from "./ComparisonSection";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-toyota-red/10 p-2 rounded-full">
              <ArrowUpDown className="h-5 w-5 text-toyota-red" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Vehicle Comparison</h2>
              <p className="text-sm text-gray-500">{vehicles.length} vehicles selected</p>
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

        {/* Vehicle Selector Tabs */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle.name}
                onClick={() => setSelectedVehicleIndex(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVehicleIndex === index
                    ? 'bg-toyota-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {vehicle.name.split(' ').slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="flex-1"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Detailed
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
              <div className="bg-gradient-to-r from-toyota-red/5 to-toyota-blue/5 rounded-2xl p-6">
                <div className="relative">
                  <img
                    src={vehicles[selectedVehicleIndex].image}
                    alt={vehicles[selectedVehicleIndex].name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <Badge className="absolute top-3 left-3 bg-toyota-red">
                    {vehicles[selectedVehicleIndex].category}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {vehicles[selectedVehicleIndex].name}
                  </h3>
                  <p className="text-lg font-semibold text-toyota-red mt-1">
                    From AED {vehicles[selectedVehicleIndex].price.toLocaleString()}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="default" size="sm" className="bg-toyota-red" asChild>
                      <a href={`/test-drive?model=${encodeURIComponent(vehicles[selectedVehicleIndex].name)}`}>
                        <Car className="h-4 w-4 mr-2" />
                        Test Drive
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/vehicle/${vehicles[selectedVehicleIndex].name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Details
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Comparison Grid */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Quick Comparison</h4>
                
                {/* Key Specs Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {sections[0]?.items.slice(0, 4).map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm font-medium text-gray-600 mb-2">{item.label}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicles.slice(0, 2).map((vehicle, idx) => (
                          <div 
                            key={`${vehicle.name}-${item.label}`}
                            className={`p-2 rounded-lg text-sm ${
                              idx === selectedVehicleIndex ? 'bg-toyota-red text-white' : 'bg-white'
                            }`}
                          >
                            <div className="font-medium text-xs opacity-75">{vehicle.name.split(' ').slice(-1)[0]}</div>
                            <div className="font-semibold">{item.getValue(vehicle)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                <CompareControlsBar
                  vehicles={vehicles}
                  showOnlyDifferences={showOnlyDifferences}
                  onShowDifferencesChange={onShowDifferencesChange}
                  onRemove={onRemove}
                  onClearAll={onClearAll}
                />
              </div>

              {/* Detailed Comparison */}
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {section.items.map((item) => (
                        !showOnlyDifferences || hasDifferences(item.getValue, vehicles) ? (
                          <div key={item.label} className="p-4">
                            <div className="font-medium text-sm text-gray-700 mb-3">{item.label}</div>
                            <div className="space-y-2">
                              {vehicles.map((vehicle, idx) => (
                                <div 
                                  key={`${vehicle.name}-${item.label}`}
                                  className={`flex justify-between items-center p-3 rounded-lg ${
                                    idx === selectedVehicleIndex ? 'bg-toyota-red/10 border border-toyota-red/20' : 'bg-gray-50'
                                  }`}
                                >
                                  <span className="text-sm font-medium text-gray-600">
                                    {vehicle.name.split(' ').slice(-1)[0]}
                                  </span>
                                  <span className={`text-sm font-semibold ${
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

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClearAll}>
            Close Comparison
          </Button>
          <Button className="bg-toyota-red" asChild>
            <a href="/enquire">Get Quote</a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileComparisonView;
