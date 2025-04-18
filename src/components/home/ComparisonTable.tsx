
import React, { useState } from "react";
import { motion } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
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
        { label: "Power", getValue: (v: VehicleModel) => v.specifications?.power || "308 hp" },
        { label: "Range", getValue: (v: VehicleModel) => v.specifications?.range || "482 km" },
        { label: "Acceleration", getValue: (v: VehicleModel) => v.specifications?.acceleration || "0-100 km/h in 4.5s" },
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

  const renderMobileView = () => (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.name} className="bg-gray-900 rounded-xl p-4 relative">
            <button
              onClick={() => onRemove(vehicle.name)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <a href={vehicle.configureUrl}>Configure</a>
              </Button>
            </div>

            {sections.map((section) => (
              <div key={section.title} className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">{section.title}</h4>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    !showOnlyDifferences || hasDifferences(item.getValue) ? (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white font-medium">{item.getValue(vehicle)}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-4 border-b border-gray-800"></th>
            {vehicles.map((vehicle) => (
              <th key={vehicle.name} className="p-4 border-b border-gray-800 min-w-[250px]">
                <div className="relative">
                  <button
                    onClick={() => onRemove(vehicle.name)}
                    className="absolute top-0 right-0 text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
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
                <td colSpan={vehicles.length + 1} className="p-4 bg-gray-800 font-semibold text-white">
                  {section.title}
                </td>
              </tr>
              {section.items.map((item) => (
                !showOnlyDifferences || hasDifferences(item.getValue) ? (
                  <tr key={item.label} className="border-b border-gray-800">
                    <td className="p-4 text-gray-400">{item.label}</td>
                    {vehicles.map((vehicle) => (
                      <td 
                        key={`${vehicle.name}-${item.label}`} 
                        className={`p-4 text-white ${
                          hasDifferences(item.getValue) ? "font-medium" : ""
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
  );

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Compare Vehicles</h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-differences"
              checked={showOnlyDifferences}
              onCheckedChange={setShowOnlyDifferences}
            />
            <Label htmlFor="show-differences" className="text-white">Show only differences</Label>
          </div>
        </div>
      </div>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default ComparisonTable;
