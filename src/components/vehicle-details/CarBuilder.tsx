
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileCarBuilder from "./builder/MobileCarBuilder";
import DesktopCarBuilder from "./builder/DesktopCarBuilder";

interface CarBuilderProps {
  vehicle: VehicleModel;
  isOpen: boolean;
  onClose: () => void;
}

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

const CarBuilder: React.FC<CarBuilderProps> = ({ vehicle, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<BuilderConfig>({
    modelYear: "2025",
    engine: "3.5L V6",
    grade: "Base",
    exteriorColor: "Pearl White",
    interiorColor: "Black Leather",
    accessories: []
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const calculateTotalPrice = useCallback(() => {
    let basePrice = vehicle.price;
    
    // Engine pricing
    const enginePricing = { "3.5L V6": 0, "4.0L V6": 5000, "2.5L Hybrid": 3000 };
    basePrice += enginePricing[config.engine as keyof typeof enginePricing] || 0;
    
    // Grade pricing
    const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
    basePrice += gradePricing[config.grade as keyof typeof gradePricing] || 0;
    
    // Exterior colors pricing
    const exteriorColors = [
      { name: "Pearl White", price: 0 },
      { name: "Midnight Black", price: 500 },
      { name: "Silver Metallic", price: 300 },
      { name: "Deep Blue", price: 400 },
      { name: "Ruby Red", price: 600 }
    ];
    
    // Interior pricing
    const interiorPricing = { "Black Leather": 0, "Beige Leather": 800, "Gray Fabric": -500 };
    
    const accessories = [
      { name: "Premium Sound System", price: 1200 },
      { name: "Sunroof", price: 800 },
      { name: "Navigation System", price: 600 },
      { name: "Heated Seats", price: 400 },
      { name: "Backup Camera", price: 300 },
      { name: "Alloy Wheels", price: 900 }
    ];
    
    const exteriorColorPrice = exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0;
    const interiorColorPrice = interiorPricing[config.interiorColor as keyof typeof interiorPricing] || 0;
    const accessoriesPrice = config.accessories.reduce((total, accessory) => {
      const accessoryData = accessories.find(a => a.name === accessory);
      return total + (accessoryData?.price || 0);
    }, 0);
    
    return basePrice + exteriorColorPrice + interiorColorPrice + accessoriesPrice;
  }, [config, vehicle.price]);

  const handlePayment = () => {
    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your order.",
    });
    
    setTimeout(() => {
      setShowConfirmation(true);
      toast({
        title: "Order Confirmed!",
        description: "Your vehicle configuration has been saved and order placed.",
      });
    }, 2000);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const goNext = () => {
    if (step < 4) setStep(step + 1); // Updated to 4 steps
  };

  const updateConfig = useCallback((value: React.SetStateAction<BuilderConfig>) => {
    setConfig(value);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen p-0 border-0 bg-background overflow-hidden">
        <AnimatePresence mode="wait">
          {isMobile ? (
            <MobileCarBuilder
              key="mobile"
              vehicle={vehicle}
              step={step}
              config={config}
              setConfig={updateConfig}
              showConfirmation={showConfirmation}
              calculateTotalPrice={calculateTotalPrice}
              handlePayment={handlePayment}
              goBack={goBack}
              goNext={goNext}
              onClose={onClose}
            />
          ) : (
            <DesktopCarBuilder
              key="desktop"
              vehicle={vehicle}
              step={step}
              config={config}
              setConfig={updateConfig}
              showConfirmation={showConfirmation}
              calculateTotalPrice={calculateTotalPrice}
              handlePayment={handlePayment}
              goBack={goBack}
              goNext={goNext}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CarBuilder;
