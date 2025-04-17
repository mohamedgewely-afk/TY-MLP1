
import React from "react";
import { Check, ShieldCheck, Smartphone, Sparkles, Coffee, Lock } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface VehicleFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleFeatures: React.FC<VehicleFeaturesProps> = ({ vehicle }) => {
  // Create feature categories with details (in a real app, these would come from the data)
  const featureCategories = [
    {
      id: "safety",
      title: "Safety Features",
      icon: <ShieldCheck className="h-5 w-5 text-toyota-red" />,
      features: [
        "Toyota Safety Sense™ 2.0",
        "Pre-Collision System with Pedestrian Detection",
        "Lane Departure Alert with Steering Assist",
        "Automatic High Beams",
        "Road Sign Assist",
        "Lane Tracing Assist",
        "7 SRS airbags",
        "Blind Spot Monitor",
        "Rear Cross-Traffic Alert",
        "Hill-start Assist Control",
      ]
    },
    {
      id: "technology",
      title: "Technology & Connectivity",
      icon: <Smartphone className="h-5 w-5 text-toyota-red" />,
      features: [
        "8-inch touchscreen infotainment system",
        "Apple CarPlay® and Android Auto™ compatibility",
        "Bluetooth® connectivity",
        "USB charging ports",
        "Wireless phone charger",
        "JBL® premium audio system",
        "Smart Key System with Push Button Start",
        "Remote Connect capability",
        "Voice Recognition",
        "Digital rearview mirror"
      ]
    },
    {
      id: "performance",
      title: "Performance Features",
      icon: <Sparkles className="h-5 w-5 text-toyota-red" />,
      features: [
        "Dynamic Force Engine",
        "CVT with Sport Mode",
        "Paddle shifters",
        "Drive Mode Select (Eco, Normal, Sport)",
        "MacPherson strut front suspension",
        "Multi-link rear suspension",
        "Electric Power Steering",
        "Ventilated disc brakes",
        "Active Cornering Assist",
        "Sport-tuned suspension"
      ]
    },
    {
      id: "comfort",
      title: "Comfort & Convenience",
      icon: <Coffee className="h-5 w-5 text-toyota-red" />,
      features: [
        "Dual-zone automatic climate control",
        "Heated and ventilated front seats",
        "8-way power-adjustable driver's seat",
        "Leather-trimmed seats",
        "Heated steering wheel",
        "Power moonroof",
        "60/40 split fold-down rear seats",
        "Auto-dimming rearview mirror",
        "Ambient interior lighting",
        "Power windows with auto up/down"
      ]
    },
    {
      id: "exterior",
      title: "Exterior Features",
      icon: <Lock className="h-5 w-5 text-toyota-red" />,
      features: [
        "LED headlights with auto on/off feature",
        "LED Daytime Running Lights",
        "LED tail lights",
        "18-inch machined alloy wheels",
        "Color-keyed heated power outside mirrors",
        "Chrome exhaust tip",
        "Acoustic noise-reducing windshield",
        "Rain-sensing windshield wipers",
        "Shark-fin antenna",
        "Rear spoiler"
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vehicle Features</h2>
      
      {/* Standard Features from the vehicle object */}
      {vehicle.features.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Highlighted Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicle.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-3 p-1 bg-toyota-red/10 rounded-full">
                  <Check className="h-4 w-4 text-toyota-red" />
                </span>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Detailed Features by Category */}
      <div className="space-y-10">
        {featureCategories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-toyota-red/10 p-2 rounded-full">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-3 p-1 bg-toyota-red/10 rounded-full">
                    <Check className="h-4 w-4 text-toyota-red" />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 360 Virtual Tour Teaser */}
      <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Experience the {vehicle.name} in 360°
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Take a virtual tour to explore every detail of the interior and exterior.
        </p>
        <button className="bg-toyota-red hover:bg-toyota-darkred text-white px-4 py-2 rounded transition-colors">
          Launch Virtual Tour
        </button>
      </div>
    </div>
  );
};

export default VehicleFeatures;
