
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleModel } from "@/types/vehicle";
import { Car, Palette, Settings, CreditCard, Sparkles, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BuilderProgress from "./builder/BuilderProgress";
import ChoicesSummary from "./builder/ChoicesSummary";
import StepContent from "./builder/StepContent";
import BuilderNavigation from "./builder/BuilderNavigation";
import OrderConfirmation from "./builder/OrderConfirmation";
import ReviewStep from "./builder/ReviewStep";

interface CarBuilderProps {
  vehicle: VehicleModel;
  isOpen: boolean;
  onClose: () => void;
}

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

const exteriorColors = [
  { 
    name: "Pearl White", 
    code: "#F8F8FF", 
    price: 0,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Midnight Black", 
    code: "#000000", 
    price: 500,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Silver Metallic", 
    code: "#C0C0C0", 
    price: 300,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Ruby Red", 
    code: "#DC143C", 
    price: 700,
    image: "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Ocean Blue", 
    code: "#006994", 
    price: 600,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Storm Gray", 
    code: "#708090", 
    price: 400,
    image: "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=800&q=80"
  }
];

const interiorColors = [
  { 
    name: "Black Fabric", 
    code: "#2C2C2C", 
    price: 0,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Beige Leather", 
    code: "#F5F5DC", 
    price: 1500,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Brown Leather", 
    code: "#8B4513", 
    price: 1500,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Red Leather", 
    code: "#8B0000", 
    price: 2000,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80"
  }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, icon: "🎵" },
  { name: "Sunroof", price: 800, icon: "☀️" },
  { name: "Navigation System", price: 600, icon: "🧭" },
  { name: "Heated Seats", price: 400, icon: "🔥" },
  { name: "Backup Camera", price: 300, icon: "📹" },
  { name: "Alloy Wheels", price: 900, icon: "⚙️" },
  { name: "Roof Rack", price: 250, icon: "🎒" },
  { name: "Floor Mats", price: 150, icon: "🚗" }
];

const CarBuilder: React.FC<CarBuilderProps> = ({ vehicle, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<BuilderConfig>({
    modelYear: "2025",
    grade: "Base",
    exteriorColor: "Pearl White",
    interiorColor: "Black Fabric",
    accessories: []
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Model Year", icon: <Car className="h-5 w-5" />, gradient: "from-blue-500 to-cyan-400" },
    { number: 2, title: "Grade", icon: <Star className="h-5 w-5" />, gradient: "from-purple-500 to-pink-400" },
    { number: 3, title: "Exterior", icon: <Palette className="h-5 w-5" />, gradient: "from-green-500 to-emerald-400" },
    { number: 4, title: "Interior", icon: <Settings className="h-5 w-5" />, gradient: "from-orange-500 to-red-400" },
    { number: 5, title: "Accessories", icon: <Sparkles className="h-5 w-5" />, gradient: "from-indigo-500 to-purple-400" },
    { number: 6, title: "Review", icon: <CreditCard className="h-5 w-5" />, gradient: "from-emerald-500 to-teal-400" }
  ];

  const getCurrentVehicleImage = () => {
    const exteriorColorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return exteriorColorData?.image || exteriorColors[0].image;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && step < 6) {
      setStep(step + 1);
    }
    if (isRightSwipe && step > 1) {
      setStep(step - 1);
    }
  };

  const calculateTotalPrice = () => {
    let basePrice = vehicle.price;
    
    const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
    basePrice += gradePricing[config.grade as keyof typeof gradePricing] || 0;
    
    const exteriorColorPrice = exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0;
    const interiorColorPrice = interiorColors.find(c => c.name === config.interiorColor)?.price || 0;
    basePrice += exteriorColorPrice + interiorColorPrice;
    
    const accessoriesPrice = config.accessories.reduce((total, accessory) => {
      const accessoryData = accessories.find(a => a.name === accessory);
      return total + (accessoryData?.price || 0);
    }, 0);
    
    return basePrice + accessoriesPrice;
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAccessoryToggle = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(a => a !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

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

  if (showConfirmation) {
    return (
      <OrderConfirmation
        isOpen={isOpen}
        onClose={onClose}
        vehicle={vehicle}
        config={config}
        totalPrice={calculateTotalPrice()}
        getCurrentVehicleImage={getCurrentVehicleImage}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-background via-muted/30 to-background border-0 shadow-2xl">
        <DialogHeader className="flex-shrink-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Build Your {vehicle.name}
            </DialogTitle>
            <p className="text-muted-foreground mt-2">Create your perfect vehicle configuration</p>
          </motion.div>
        </DialogHeader>

        <BuilderProgress currentStep={step} steps={steps} />

        {step > 1 && (
          <ChoicesSummary 
            config={config}
            totalPrice={calculateTotalPrice()}
            getCurrentVehicleImage={getCurrentVehicleImage}
          />
        )}

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 15 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="h-full p-6 relative z-10"
            >
              {step === 6 ? (
                <ReviewStep
                  vehicle={vehicle}
                  config={config}
                  totalPrice={calculateTotalPrice()}
                  getCurrentVehicleImage={getCurrentVehicleImage}
                  onPayment={handlePayment}
                  handleTouchStart={handleTouchStart}
                  handleTouchMove={handleTouchMove}
                  handleTouchEnd={handleTouchEnd}
                />
              ) : (
                <StepContent
                  step={step}
                  config={config}
                  setConfig={setConfig}
                  handleAccessoryToggle={handleAccessoryToggle}
                  handleTouchStart={handleTouchStart}
                  handleTouchMove={handleTouchMove}
                  handleTouchEnd={handleTouchEnd}
                  getCurrentVehicleImage={getCurrentVehicleImage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/20 flex-shrink-0 relative z-10">
          <motion.div 
            className="text-center flex-1"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-2xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Total: AED {calculateTotalPrice().toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Live pricing updates</p>
          </motion.div>
        </div>

        <BuilderNavigation
          currentStep={step}
          totalSteps={6}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CarBuilder;
