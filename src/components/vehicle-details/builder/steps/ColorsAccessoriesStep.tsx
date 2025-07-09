
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ColorsAccessoriesStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const exteriorColors = [
    { name: "Pearl White", price: 0, hex: "#f8f9fa", popular: true },
    { name: "Midnight Black", price: 500, hex: "#1a1a1a", popular: true },
    { name: "Silver Metallic", price: 300, hex: "#c0c0c0", popular: false },
    { name: "Deep Blue", price: 400, hex: "#1e40af", popular: false },
    { name: "Ruby Red", price: 600, hex: "#dc2626", popular: false }
  ];

  const interiorColors = [
    { name: "Black Leather", price: 0, popular: true },
    { name: "Beige Leather", price: 800, popular: true },
    { name: "Gray Fabric", price: -500, popular: false }
  ];

  const accessories = [
    { name: "Premium Sound System", price: 1200, category: "Audio" },
    { name: "Sunroof", price: 800, category: "Comfort" },
    { name: "Navigation System", price: 600, category: "Technology" },
    { name: "Heated Seats", price: 400, category: "Comfort" },
    { name: "Backup Camera", price: 300, category: "Safety" },
    { name: "Alloy Wheels", price: 900, category: "Style" }
  ];

  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(acc => acc !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Exterior Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Exterior Color</h3>
        <div className="grid grid-cols-2 gap-3">
          {exteriorColors.map((color) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                config.exteriorColor === color.name
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <div className="font-semibold">{color.name}</div>
                  {color.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {color.price > 0 ? `+AED ${color.price}` : 'Included'}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Interior Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Interior</h3>
        <div className="space-y-3">
          {interiorColors.map((interior) => (
            <motion.button
              key={interior.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setConfig(prev => ({ ...prev, interiorColor: interior.name }))}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                config.interiorColor === interior.name
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{interior.name}</div>
                  {interior.popular && <Badge variant="secondary" className="text-xs mt-1">Popular Choice</Badge>}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {interior.price > 0 ? `+AED ${interior.price}` : 
                     interior.price < 0 ? `AED ${Math.abs(interior.price)} savings` : 'Included'}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Accessories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Accessories</h3>
        <div className="space-y-3">
          {accessories.map((accessory) => (
            <motion.button
              key={accessory.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleAccessory(accessory.name)}
              className={`w-full transition-all ${
                config.accessories.includes(accessory.name) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Card className={`${
                config.accessories.includes(accessory.name)
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        config.accessories.includes(accessory.name)
                          ? 'bg-primary border-primary'
                          : 'border-gray-300'
                      }`}>
                        {config.accessories.includes(accessory.name) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{accessory.name}</div>
                        <Badge variant="outline" className="text-xs">{accessory.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">+AED {accessory.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ColorsAccessoriesStep;
