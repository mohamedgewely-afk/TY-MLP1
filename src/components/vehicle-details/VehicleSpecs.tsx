
import React from "react";
import { Engine, Gauge, Fuel, Shield, Award, Clock } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface VehicleSpecsProps {
  vehicle: VehicleModel;
}

const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ vehicle }) => {
  // Add detailed specs for the vehicle (in a real app, these would come from the data)
  const detailedSpecs = {
    dimensions: {
      length: "4,630 mm",
      width: "1,780 mm",
      height: "1,435 mm",
      wheelbase: "2,700 mm",
      groundClearance: "130 mm",
      trunkCapacity: "471 liters",
    },
    performance: {
      engine: vehicle.specifications?.engine || "1.6L 4-Cylinder Engine",
      power: "121 HP @ 6,000 rpm",
      torque: "153 Nm @ 5,200 rpm",
      transmission: vehicle.specifications?.transmission || "CVT Automatic",
      driveType: "Front-Wheel Drive",
      fuelEconomy: vehicle.specifications?.fuelEconomy || "17.5 km/L",
      acceleration: "10.5 seconds (0-100 km/h)",
      topSpeed: "190 km/h",
    },
    safety: {
      rating: vehicle.specifications?.safetyRating || "5-Star Safety Rating",
      airbags: "7 airbags (Driver, Passenger, Side, Curtain, Knee)",
      assistSystems: "Pre-Collision System, Lane Departure Alert, Road Sign Assist",
      brakeSystem: "Anti-lock Braking System with EBD and Brake Assist",
      stabilityControl: "Vehicle Stability Control and Traction Control",
    },
    comfort: {
      seats: "Leather upholstery with heated front seats",
      climate: "Dual-zone automatic climate control",
      infotainment: "8-inch touchscreen with Apple CarPlay and Android Auto",
      sound: "6-speaker audio system",
      connectivity: "Bluetooth, USB, Wireless charging",
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Technical Specifications</h2>
      
      {/* Key Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-toyota-red/10 p-3 rounded-full">
            <Engine className="h-6 w-6 text-toyota-red" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Engine</h3>
            <p className="text-gray-600 dark:text-gray-400">{detailedSpecs.performance.engine}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-toyota-red/10 p-3 rounded-full">
            <Gauge className="h-6 w-6 text-toyota-red" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Transmission</h3>
            <p className="text-gray-600 dark:text-gray-400">{detailedSpecs.performance.transmission}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="bg-toyota-red/10 p-3 rounded-full">
            <Fuel className="h-6 w-6 text-toyota-red" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Fuel Economy</h3>
            <p className="text-gray-600 dark:text-gray-400">{detailedSpecs.performance.fuelEconomy}</p>
          </div>
        </div>
      </div>
      
      {/* Detailed Specifications */}
      <div className="space-y-8">
        {/* Dimensions */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(detailedSpecs.dimensions).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Performance */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(detailedSpecs.performance).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Safety */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">Safety</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(detailedSpecs.safety).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comfort */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">Comfort & Convenience</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(detailedSpecs.comfort).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Warranty Information */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Award className="h-6 w-6 text-toyota-red" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Warranty Information</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {vehicle.specifications?.warranty || "5 years / 100,000 km manufacturer warranty"}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Toyota provides comprehensive coverage for your peace of mind. The warranty includes:
        </p>
        <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Full mechanical coverage</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>24/7 roadside assistance</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Free service reminders</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VehicleSpecs;
