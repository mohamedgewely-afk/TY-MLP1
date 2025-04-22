
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CompareControlsBar from "./CompareControlsBar";
import { hasDifferences } from "./ComparisonSection";

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
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="sticky top-0 bg-white border-b flex items-center justify-between p-3 z-10">
        <h2 className="text-lg font-semibold text-gray-800">Vehicle Comparison</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full p-2 h-8 w-8"
          onClick={onClearAll}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3">
        <CompareControlsBar
          vehicles={vehicles}
          showOnlyDifferences={showOnlyDifferences}
          onShowDifferencesChange={onShowDifferencesChange}
          onRemove={onRemove}
          onClearAll={onClearAll}
        />
        
        {/* Vehicle Images and Names */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="w-full aspect-video bg-gray-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                <div className="flex gap-1">
                  <Button variant="secondary" size="sm" className="text-xs flex-1 h-8" asChild>
                    <a href={vehicle.configureUrl}>Configure</a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs flex-1 h-8" asChild>
                    <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>Test Drive</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Data by Section */}
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="font-semibold text-base bg-gray-50 p-2 border-y">{section.title}</h3>
            
            {section.items.map((item) => (
              !showOnlyDifferences || hasDifferences(item.getValue, vehicles) ? (
                <div key={item.label} className="border-b">
                  <div className="font-medium text-sm text-gray-700 p-2 bg-gray-50">{item.label}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
                    {vehicles.map((vehicle) => (
                      <div 
                        key={`${vehicle.name}-${item.label}`}
                        className={`p-2 rounded-md ${hasDifferences(item.getValue, vehicles) ? "bg-gray-50 font-medium" : ""}`}
                      >
                        <span className="block text-sm truncate">{item.getValue(vehicle)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ))}
        
        <div className="flex justify-end mt-6 mb-8">
          <Button variant="outline" className="mr-2" onClick={onClearAll}>
            Close Comparison
          </Button>
          <Button asChild>
            <a href="/enquire">Enquire Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileComparisonView;
