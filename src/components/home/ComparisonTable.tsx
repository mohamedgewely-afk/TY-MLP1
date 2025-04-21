
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  // (Optional) onClearAll for controller if parent provides
  onClearAll?: () => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
  onClearAll,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const isMobile = useIsMobile();

  const sections = [
    {
      title: "Pricing",
      items: [
        { label: "Vehicle Price", getValue: (v: VehicleModel) => `AED ${v.price.toLocaleString()}` },
        { label: "Cash Price", getValue: (v: VehicleModel) => `AED ${(v.price * 0.93).toLocaleString()}` },
      ]
    },
    {
      title: "Specifications",
      items: [
        { label: "Engine", getValue: (v: VehicleModel) => v.specifications?.engine || v.features[0] || "N/A" },
        {
          label: "Power",
          getValue: (v: VehicleModel) =>
            (v.specifications && "power" in v.specifications && v.specifications.power)
              ? (v.specifications as any).power
              : "308 hp"
        },
        {
          label: "Range",
          getValue: (v: VehicleModel) =>
            (v.specifications && "range" in v.specifications && v.specifications.range)
              ? (v.specifications as any).range
              : "482 km"
        },
        {
          label: "Acceleration",
          getValue: (v: VehicleModel) =>
            (v.specifications && "acceleration" in v.specifications && v.specifications.acceleration)
              ? (v.specifications as any).acceleration
              : "0-100 km/h in 4.5s"
        },
      ]
    },
    {
      title: "Features",
      items: [
        { label: "Seats", getValue: (v: VehicleModel) => v.features[1] || "Leather seats" },
        { label: "Safety", getValue: (v: VehicleModel) => v.features[2] || "Advanced safety features" },
        { label: "Technology", getValue: (v: VehicleModel) => v.features[3] || "Smart technology package" },
      ]
    }
  ];

  const hasDifferences = (getValue: (v: VehicleModel) => string) => {
    const values = vehicles.map(getValue);
    return new Set(values).size > 1;
  };

  // Controller bar - always at top
  const ControllerBar = () => (
    <div className="w-full px-4 py-2 mb-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 relative z-10">
      <div className="overflow-x-auto flex-1">
        <div className="flex gap-2">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="flex items-center p-2 bg-gray-50 border rounded-lg min-w-[120px] gap-2 shadow-xs"
            >
              <img
                src={v.image}
                alt={v.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="truncate text-sm font-medium text-gray-700">{v.name}</span>
              <button
                onClick={() => onRemove(v.name)}
                className="ml-1 p-1 text-gray-500 hover:text-red-500"
                title={`Remove ${v.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-1 md:ml-2">
        <Switch
          id="show-differences"
          checked={showOnlyDifferences}
          onCheckedChange={setShowOnlyDifferences}
        />
        <Label htmlFor="show-differences" className="text-sm text-gray-600">Show only differences</Label>
      </div>
      {onClearAll && vehicles.length > 0 &&
        <Button
          variant="secondary"
          size="sm"
          className="ml-auto"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      }
      {vehicles.length >= 2 &&
        <Button
          className="ml-2 bg-toyota-red hover:bg-toyota-darkred text-white text-sm"
          asChild
        >
          <a href="#compare-section">Compare Now</a>
        </Button>
      }
      {vehicles.length < 2 &&
        <span className="ml-2 text-xs text-gray-400">Add another vehicle to compare</span>
      }
    </div>
  );

  // Mobile navigation controls
  const MobileNavControls = () => {
    if (vehicles.length <= 1) return null;
    
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => setActiveVehicleIndex(prev => (prev > 0 ? prev - 1 : vehicles.length - 1))}
          disabled={vehicles.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium text-gray-700">
          {activeVehicleIndex + 1} of {vehicles.length}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => setActiveVehicleIndex(prev => (prev < vehicles.length - 1 ? prev + 1 : 0))}
          disabled={vehicles.length <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // --- Mobile view: controller bar + single column per car (no popup, all embedded)
  const renderMobileView = () => {
    const activeVehicle = vehicles[activeVehicleIndex];
    
    return (
      <div>
        <ControllerBar />
        <div className="space-y-6 px-2 pb-4">
          {vehicles.length > 0 && (
            <>
              <MobileNavControls />
              <div className="bg-white border rounded-xl p-4 relative shadow-sm">
                <div className="mb-4">
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                    <img
                      src={activeVehicle.image}
                      alt={activeVehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{activeVehicle.name}</h3>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a href={activeVehicle.configureUrl}>Configure</a>
                  </Button>
                </div>
                {sections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h4 className="text-base font-semibold text-gray-700 mb-3">{section.title}</h4>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        !showOnlyDifferences || hasDifferences(item.getValue) ? (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">{item.label}</span>
                            <span className="text-gray-800 font-medium text-sm">{item.getValue(activeVehicle)}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // --- Desktop view: controller bar + table
  const renderDesktopView = () => (
    <div>
      <ControllerBar />
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white border rounded-xl shadow-sm">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 bg-gray-50"></th>
              {vehicles.map((vehicle) => (
                <th key={vehicle.name} className="p-4 border-b border-gray-200 min-w-[250px] bg-gray-50">
                  <div className="relative">
                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{vehicle.name}</h3>
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a href={vehicle.configureUrl}>Configure</a>
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <React.Fragment key={section.title}>
                <tr>
                  <td colSpan={vehicles.length + 1} className="p-4 bg-gray-100 font-semibold text-gray-700">
                    {section.title}
                  </td>
                </tr>
                {section.items.map((item) => (
                  !showOnlyDifferences || hasDifferences(item.getValue) ? (
                    <tr key={item.label} className="border-b border-gray-100">
                      <td className="p-4 text-gray-500">{item.label}</td>
                      {vehicles.map((vehicle) => (
                        <td
                          key={`${vehicle.name}-${item.label}`}
                          className={`p-4 text-gray-800 ${
                            hasDifferences(item.getValue) ? "font-semibold" : ""
                          }`}
                        >
                          {item.getValue(vehicle)}
                        </td>
                      ))}
                    </tr>
                  ) : null
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden border p-0">
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default ComparisonTable;
