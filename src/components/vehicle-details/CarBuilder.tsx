
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

// Cinematic entrance backdrop
const CinematicBackdrop = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className="fixed inset-0 bg-gradient-to-br from-black/95 via-primary/20 to-black/95 backdrop-blur-xl z-40"
  >
    {/* Animated particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/30 rounded-full"
        initial={{ 
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0
        }}
        animate={{ 
          scale: [0, 1, 0],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
      />
    ))}
  </motion.div>
);

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
    if (step < 4) setStep(step + 1);
  };

  const updateConfig = useCallback((value: React.SetStateAction<BuilderConfig>) => {
    setConfig(value);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen p-0 border-0 bg-transparent overflow-hidden">
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              {/* Cinematic Backdrop */}
              <CinematicBackdrop />
              
              {/* Main Builder Content with Cinematic Entrance */}
              <motion.div
                key="builder-content"
                initial={{ 
                  scale: 0.8, 
                  opacity: 0,
                  rotateY: 45,
                  z: -1000
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotateY: 0,
                  z: 0
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  rotateY: -45,
                  z: 1000
                }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
                className="relative z-50 h-full w-full"
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Elegant Glass Effect Container */}
                <motion.div
                  initial={{ backdropFilter: "blur(0px)" }}
                  animate={{ backdropFilter: "blur(20px)" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-full w-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 shadow-2xl relative overflow-hidden"
                >
                  {/* Toyota Brand Accent */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary"
                  />
                  
                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                    <div className="w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                  </div>

                  {/* Builder Interface */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="relative z-10 h-full"
                  >
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
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CarBuilder;
