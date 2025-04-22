
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import { CarFront, Fuel, ArrowRight } from "lucide-react";

interface VehicleSpecsProps {
  vehicle: VehicleModel;
}

const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ vehicle }) => {
  // Expanded specifications with more detailed info
  const specs = [
    {
      title: "Performance",
      items: [
        { label: "Engine", value: vehicle.specifications?.engine || vehicle.features[0] || "2.5L Dynamic Force Engine" },
        { label: "Power", value: "204 hp" },
        { label: "Torque", value: "243 Nm" },
        { label: "Acceleration (0-100 km/h)", value: "8.3 seconds" },
        { label: "Top Speed", value: "180 km/h" },
        { label: "Fuel Economy", value: "19.5 km/L" },
      ]
    },
    {
      title: "Dimensions",
      items: [
        { label: "Length", value: "4,885 mm" },
        { label: "Width", value: "1,840 mm" },
        { label: "Height", value: "1,445 mm" },
        { label: "Wheelbase", value: "2,825 mm" },
        { label: "Ground Clearance", value: "155 mm" },
        { label: "Cargo Space", value: "428 L" },
      ]
    },
    {
      title: "Features",
      items: vehicle.features.map((feature, index) => ({
        label: `Feature ${index + 1}`,
        value: feature
      }))
    },
    {
      title: "Safety",
      items: [
        { label: "Airbags", value: "8 (Front, Side, Curtain, Knee)" },
        { label: "Anti-lock Braking System (ABS)", value: "Standard" },
        { label: "Vehicle Stability Control", value: "Standard" },
        { label: "Pre-Collision System", value: "Available" },
        { label: "Lane Departure Alert", value: "Available" },
        { label: "Dynamic Radar Cruise Control", value: "Available" },
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {specs.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">{section.title}</h3>
            <table className="w-full">
              <tbody>
                {section.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 text-gray-600 dark:text-gray-400">{item.label}</td>
                    <td className="py-3 text-right font-medium">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-6 mt-4 rounded-b-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-lg mb-1">Price Starting From</h4>
            <p className="text-2xl font-bold text-toyota-red">AED {vehicle.price.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <a 
              href={vehicle.configureUrl} 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Configure Vehicle <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSpecs;
