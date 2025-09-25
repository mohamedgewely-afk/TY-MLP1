
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Circle } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ConfigureVehicleProps {
  vehicle: VehicleModel;
  onClose: () => void;
}

interface ConfigOption {
  id: string;
  name: string;
  image?: string;
  price: number;
}

// These would come from the vehicle data in a real implementation
const trims: ConfigOption[] = [
  { id: "le", name: "LE", price: 95000 },
  { id: "se", name: "SE", price: 105000 },
  { id: "xle", name: "XLE", price: 120000 },
  { id: "hybrid", name: "Hybrid XLE", price: 135000 },
];

const colors: ConfigOption[] = [
  { id: "white", name: "Pearl White", price: 0, image: "" },
  { id: "silver", name: "Silver Metallic", price: 0, image: "" },
  { id: "red", name: "Emotional Red", price: 1500, image: "" },
  { id: "blue", name: "Celestial Blue", price: 1500, image: "" },
];

const packages: ConfigOption[] = [
  { id: "sport", name: "Sport Package", price: 8000 },
  { id: "tech", name: "Tech Package", price: 12000 },
  { id: "premium", name: "Premium Package", price: 18000 },
];

const ConfigureVehicle: React.FC<ConfigureVehicleProps> = ({ vehicle, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrim, setSelectedTrim] = useState<string>(trims[0].id);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0].id);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const totalSteps = 4;
  const basePrice = vehicle.price;
  
  // Calculate the total price based on selections
  const calculateTotal = () => {
    const trimPrice = trims.find(t => t.id === selectedTrim)?.price || 0;
    const colorPrice = colors.find(c => c.id === selectedColor)?.price || 0;
    const packagesPrice = packages
      .filter(p => selectedPackages.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
    
    return trimPrice + colorPrice + packagesPrice;
  };
  
  const total = calculateTotal();
  
  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    // In a real app, this would send the configuration to a backend
    console.log("Configuration submitted:", {
      vehicle: vehicle.name,
      trim: selectedTrim,
      color: selectedColor,
      packages: selectedPackages,
      totalPrice: total
    });
    
    // Show success toast and close
    toast({
      title: "Configuration Saved",
      description: "Your configuration has been saved. A Toyota representative will contact you shortly."
    });
    onClose();
  };
  
  const selectedColorObj = colors.find(c => c.id === selectedColor);
  const selectedTrimObj = trims.find(t => t.id === selectedTrim);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
      {/* Header with progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configure Your {vehicle.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full mt-4">
          <div 
            className="bg-toyota-red h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Step 1: Select Trim */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Select Trim</h3>
            <RadioGroup value={selectedTrim} onValueChange={setSelectedTrim} className="space-y-3">
              {trims.map(trim => (
                <div key={trim.id} className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center">
                    <RadioGroupItem value={trim.id} id={`trim-${trim.id}`} />
                    <Label htmlFor={`trim-${trim.id}`} className="ml-2 font-medium">{trim.name}</Label>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">AED {trim.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}
        
        {/* Step 2: Select Color */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Select Exterior Color</h3>
            <div className="mb-6">
              <img 
                src={selectedColorObj?.image || colors[0].image} 
                alt={`${vehicle.name} in ${selectedColorObj?.name}`}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            </div>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colors.map(color => (
                <div key={color.id} className="space-y-2">
                  <div 
                    className={`h-16 rounded-md border-2 transition-all cursor-pointer
                      ${selectedColor === color.id ? 'border-toyota-red ring-2 ring-toyota-red ring-opacity-50' : 'border-gray-200'}
                    `}
                    style={{ backgroundImage: `url(${color.image})`, backgroundSize: 'cover' }}
                    onClick={() => setSelectedColor(color.id)}
                  ></div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{color.name}</span>
                    {color.price > 0 && <span>+AED {color.price.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}
        
        {/* Step 3: Select Packages */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Select Optional Packages</h3>
            <div className="space-y-3">
              {packages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors
                    ${selectedPackages.includes(pkg.id) ? 'border-toyota-red bg-toyota-red/5' : 'border-gray-200'}
                  `}
                  onClick={() => handlePackageToggle(pkg.id)}
                >
                  <div className="flex items-center">
                    {selectedPackages.includes(pkg.id) ? (
                      <CheckCircle className="h-5 w-5 text-toyota-red" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="ml-2 font-medium">{pkg.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">AED {pkg.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Review Configuration</h3>
            <div className="space-y-6">
              <div>
                <img 
                  src={selectedColorObj?.image || colors[0].image} 
                  alt={`${vehicle.name} in ${selectedColorObj?.name}`}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h4 className="font-semibold text-lg">{vehicle.name} {selectedTrimObj?.name}</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedColorObj?.name}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Configuration Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span>Base Vehicle ({selectedTrimObj?.name})</span>
                    <span className="font-medium">AED {selectedTrimObj?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Exterior Color ({selectedColorObj?.name})</span>
                    <span className="font-medium">
                      {selectedColorObj?.price ? `AED ${selectedColorObj.price.toLocaleString()}` : 'Included'}
                    </span>
                  </div>
                  {selectedPackages.length > 0 ? (
                    selectedPackages.map(packageId => {
                      const pkg = packages.find(p => p.id === packageId);
                      return pkg ? (
                        <div key={pkg.id} className="flex justify-between py-2 border-b">
                          <span>{pkg.name}</span>
                          <span className="font-medium">AED {pkg.price.toLocaleString()}</span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="flex justify-between py-2 border-b">
                      <span>No packages selected</span>
                      <span>AED 0</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price</span>
                  <span className="text-xl font-bold text-toyota-red">AED {total.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  *Price excludes VAT, registration, and insurance
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Footer with navigation buttons */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onClose : handleBack}
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>
        
        <Button 
          onClick={currentStep === totalSteps ? handleSubmit : handleNext}
          className="bg-toyota-red hover:bg-toyota-darkred"
        >
          {currentStep === totalSteps ? 'Submit Configuration' : (
            <>
              Next Step <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfigureVehicle;
