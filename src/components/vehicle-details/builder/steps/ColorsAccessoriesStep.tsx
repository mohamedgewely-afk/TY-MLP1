
import React from "react";
import { motion } from "framer-motion";
import { Check, Palette, Sofa, Package, Plus, Minus } from "lucide-react";

interface ColorsAccessoriesStepProps {
  config: { exteriorColor: string; interiorColor: string; accessories: string[] };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { name: "Pearl White", color: "#F8F9FA", price: 0, popular: true },
  { name: "Midnight Black", color: "#1A1B23", price: 500, popular: true },
  { name: "Silver Metallic", color: "#8B9DC3", price: 300, popular: false },
  { name: "Deep Blue", color: "#1E3A8A", price: 400, popular: false },
  { name: "Ruby Red", color: "#DC2626", price: 600, popular: false }
];

const interiorColors = [
  { name: "Black Leather", color: "#1F2937", price: 0, material: "Premium Leather" },
  { name: "Beige Leather", color: "#F3E8D0", price: 800, material: "Premium Leather" },
  { name: "Gray Fabric", color: "#6B7280", price: -500, material: "Sport Fabric" }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, category: "Entertainment" },
  { name: "Sunroof", price: 800, category: "Comfort" },
  { name: "Navigation System", price: 600, category: "Technology" },
  { name: "Heated Seats", price: 400, category: "Comfort" },
  { name: "Backup Camera", price: 300, category: "Safety" },
  { name: "Alloy Wheels", price: 900, category: "Style" }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(acc => acc !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Exterior Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Exterior Color</h3>
          </div>
          <p className="text-sm text-muted-foreground">Choose your preferred exterior color</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {exteriorColors.map((color, index) => {
            const isSelected = config.exteriorColor === color.name;
            
            return (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-3 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}
                
                <div className="text-center">
                  <div 
                    className="w-12 h-12 mx-auto mb-2 rounded-lg border-2 border-border/50 shadow-inner"
                    style={{ backgroundColor: color.color }}
                  />
                  <h4 className="text-sm font-semibold text-foreground truncate">{color.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {color.price > 0 ? `+AED ${color.price}` : 'Included'}
                  </p>
                  {color.popular && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interior Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sofa className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Interior Color</h3>
          </div>
          <p className="text-sm text-muted-foreground">Choose your interior materials and colors</p>
        </div>
        
        <div className="space-y-3">
          {interiorColors.map((color, index) => {
            const isSelected = config.interiorColor === color.name;
            
            return (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 5) * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-border/50 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-foreground">{color.name}</h4>
                    <p className="text-sm text-muted-foreground">{color.material}</p>
                    <p className="text-sm text-foreground font-medium">
                      {color.price > 0 ? `+AED ${color.price}` : color.price < 0 ? `AED ${color.price}` : 'Included'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Accessories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Accessories</h3>
          </div>
          <p className="text-sm text-muted-foreground">Add optional features to enhance your vehicle</p>
        </div>
        
        <div className="space-y-3">
          {accessories.map((accessory, index) => {
            const isSelected = config.accessories.includes(accessory.name);
            
            return (
              <motion.div
                key={accessory.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 8) * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => toggleAccessory(accessory.name)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-foreground">{accessory.name}</h4>
                      <span className="px-2 py-1 bg-muted/70 text-muted-foreground text-xs rounded-md">
                        {accessory.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">+AED {accessory.price}</p>
                  </div>
                  
                  <motion.div
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                      isSelected 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isSelected ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ColorsAccessoriesStep;
