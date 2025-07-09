
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Minus } from "lucide-react";

interface ColorsAccessoriesStepProps {
  config: { 
    exteriorColor: string;
    interiorColor: string;
    accessories: string[];
  };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { name: "Pearl White", price: 0, hex: "#F8F8FF" },
  { name: "Midnight Black", price: 500, hex: "#1C1C1C" },
  { name: "Silver Metallic", price: 300, hex: "#C0C0C0" },
  { name: "Deep Blue", price: 800, hex: "#1E3A8A" },
  { name: "Ruby Red", price: 1000, hex: "#DC2626" }
];

const interiorColors = [
  { name: "Black Leather", price: 0, description: "Premium black leather" },
  { name: "Beige Leather", price: 500, description: "Luxury beige leather" },
  { name: "Gray Fabric", price: -300, description: "Durable fabric seating" }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, description: "12-speaker JBL audio" },
  { name: "Sunroof", price: 800, description: "Panoramic moonroof" },
  { name: "Navigation System", price: 600, description: "Built-in GPS navigation" },
  { name: "Heated Seats", price: 400, description: "Front and rear heated seats" },
  { name: "Backup Camera", price: 300, description: "Rear-view camera system" },
  { name: "Alloy Wheels", price: 900, description: "18-inch sport alloy wheels" }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const [activeTab, setActiveTab] = useState<"exterior" | "interior" | "accessories">("exterior");

  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(a => a !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Customize Your Vehicle
        </h2>
        <p className="text-muted-foreground">
          Choose colors and add accessories
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex rounded-xl bg-muted p-1">
        {[
          { id: "exterior", label: "Exterior" },
          { id: "interior", label: "Interior" },
          { id: "accessories", label: "Add-ons" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "exterior" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-lg mb-4">Exterior Color</h3>
            <div className="grid grid-cols-2 gap-3">
              {exteriorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    config.exteriorColor === color.name
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{color.name}</h4>
                      {color.price > 0 && (
                        <p className="text-primary text-xs font-medium">+د.إ {color.price}</p>
                      )}
                    </div>
                    {config.exteriorColor === color.name && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "interior" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-lg mb-4">Interior Color</h3>
            <div className="space-y-3">
              {interiorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    config.interiorColor === color.name
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{color.name}</h4>
                      <p className="text-muted-foreground text-sm">{color.description}</p>
                      {color.price !== 0 && (
                        <p className={`text-xs font-medium ${color.price > 0 ? 'text-primary' : 'text-green-500'}`}>
                          {color.price > 0 ? '+' : ''}د.إ {color.price}
                        </p>
                      )}
                    </div>
                    {config.interiorColor === color.name && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "accessories" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="font-bold text-lg mb-4">Add Accessories</h3>
            <div className="space-y-3">
              {accessories.map((accessory, index) => {
                const isSelected = config.accessories.includes(accessory.name);
                return (
                  <motion.div
                    key={accessory.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border-2 border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{accessory.name}</h4>
                        <p className="text-muted-foreground text-sm">{accessory.description}</p>
                        <p className="text-primary text-sm font-medium">+د.إ {accessory.price}</p>
                      </div>
                      <button
                        onClick={() => toggleAccessory(accessory.name)}
                        className={`p-2 rounded-full transition-all ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ColorsAccessoriesStep;
