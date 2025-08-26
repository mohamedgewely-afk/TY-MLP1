
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle, onCarBuilder }) => {
  const [activeTab, setActiveTab] = useState<"specs" | "tech" | "configure">("specs");

  const handleTabChange = useCallback((value: "specs" | "tech" | "configure") => {
    setActiveTab(value);
  }, []);

  // Default specifications data since VehicleModel doesn't have detailed specs
  const defaultSpecs = {
    engineType: vehicle.specifications?.engine || "N/A",
    transmission: vehicle.specifications?.transmission || "N/A",
    fuelEconomy: vehicle.specifications?.fuelEconomy || "N/A",
    safetyRating: vehicle.specifications?.safetyRating || "N/A",
    warranty: vehicle.specifications?.warranty || "N/A"
  };

  const defaultFeatures = {
    safetyFeatures: [
      "Toyota Safety Sense 3.0",
      "Pre-Collision System",
      "Lane Departure Alert"
    ],
    entertainmentFeatures: [
      "8-inch Touch Display",
      "Apple CarPlay/Android Auto",
      "Premium Audio System"
    ],
    convenienceFeatures: [
      "Smart Key System",
      "Automatic Climate Control",
      "Power Adjustable Seats"
    ]
  };

  return (
    <div className="toyota-container">
      <Tabs defaultValue="specs" className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="tech">Technology</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          {activeTab === 'specs' && (
            <TabsContent value="specs" className="mt-6 space-y-4">
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-4">Vehicle Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Engine & Performance</h3>
                    <p>Engine: {defaultSpecs.engineType}</p>
                    <p>Transmission: {defaultSpecs.transmission}</p>
                    <p>Fuel Economy: {defaultSpecs.fuelEconomy}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Safety & Warranty</h3>
                    <p>Safety Rating: {defaultSpecs.safetyRating}</p>
                    <p>Warranty: {defaultSpecs.warranty}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Category</h3>
                    <p>Type: {vehicle.category}</p>
                    <p>Starting Price: ${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}
          
          {activeTab === 'tech' && (
            <TabsContent value="tech" className="mt-6 space-y-4">
              <motion.div
                key="tech"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-4">Technology Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Safety Technology</h3>
                    <ul className="list-disc list-inside">
                      {defaultFeatures.safetyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Entertainment</h3>
                    <ul className="list-disc list-inside">
                      {defaultFeatures.entertainmentFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Convenience</h3>
                    <ul className="list-disc list-inside">
                      {defaultFeatures.convenienceFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}
          
          {activeTab === 'configure' && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold mb-4">Configure Your Vehicle</h2>
              <p className="text-muted-foreground">
                Customize your {vehicle.name} to match your style and preferences.
              </p>
              
              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                <div>
                  <h3 className="text-lg font-semibold">Starting Price</h3>
                  <p className="text-xl font-bold">${vehicle.price.toLocaleString()}</p>
                </div>
                <Badge variant="secondary">Base Model</Badge>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="px-12 py-4"
                  onClick={() => onCarBuilder && onCarBuilder()}
                >
                  Build Your {vehicle.name}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default InteractiveSpecsTech;
