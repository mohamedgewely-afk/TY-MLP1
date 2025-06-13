
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { VehicleModel } from "@/types/vehicle";
import { ChevronLeft, ChevronRight, Check, Car, Palette, Settings, CreditCard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const modelYears = ["2024", "2025"];
const grades = ["Base", "SE", "XLE", "Limited", "Platinum"];

const exteriorColors = [
  { 
    name: "Pearl White", 
    code: "#F8F8FF", 
    price: 0,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Midnight Black", 
    code: "#000000", 
    price: 500,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Silver Metallic", 
    code: "#C0C0C0", 
    price: 300,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Ruby Red", 
    code: "#DC143C", 
    price: 700,
    image: "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Ocean Blue", 
    code: "#006994", 
    price: 600,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Storm Gray", 
    code: "#708090", 
    price: 400,
    image: "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=400&q=80"
  }
];

const interiorColors = [
  { 
    name: "Black Fabric", 
    code: "#2C2C2C", 
    price: 0,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Beige Leather", 
    code: "#F5F5DC", 
    price: 1500,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Brown Leather", 
    code: "#8B4513", 
    price: 1500,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=400&q=80"
  },
  { 
    name: "Red Leather", 
    code: "#8B0000", 
    price: 2000,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80"
  }
];

const accessories = [
  { name: "Premium Sound System", price: 1200 },
  { name: "Sunroof", price: 800 },
  { name: "Navigation System", price: 600 },
  { name: "Heated Seats", price: 400 },
  { name: "Backup Camera", price: 300 },
  { name: "Alloy Wheels", price: 900 },
  { name: "Roof Rack", price: 250 },
  { name: "Floor Mats", price: 150 }
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
  const { toast } = useToast();
  const form = useForm();

  const steps = [
    { number: 1, title: "Model Year", icon: <Car className="h-5 w-5" /> },
    { number: 2, title: "Grade", icon: <Settings className="h-5 w-5" /> },
    { number: 3, title: "Exterior", icon: <Palette className="h-5 w-5" /> },
    { number: 4, title: "Interior", icon: <Palette className="h-5 w-5" /> },
    { number: 5, title: "Accessories", icon: <Sparkles className="h-5 w-5" /> },
    { number: 6, title: "Payment", icon: <CreditCard className="h-5 w-5" /> }
  ];

  const calculateTotalPrice = () => {
    let basePrice = vehicle.price;
    
    // Add grade pricing
    const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
    basePrice += gradePricing[config.grade as keyof typeof gradePricing] || 0;
    
    // Add color pricing
    const exteriorColorPrice = exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0;
    const interiorColorPrice = interiorColors.find(c => c.name === config.interiorColor)?.price || 0;
    basePrice += exteriorColorPrice + interiorColorPrice;
    
    // Add accessories pricing
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
    // Simulate payment processing
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Choose Model Year</h3>
            <div className="grid grid-cols-2 gap-4">
              {modelYears.map((year) => (
                <motion.div
                  key={year}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${config.modelYear === year ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'}`}
                    onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                  >
                    <CardContent className="p-6 text-center">
                      <h4 className="text-xl font-bold">{year}</h4>
                      <p className="text-muted-foreground">{year === "2025" ? "Latest Model" : "Previous Year"}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Select Grade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grades.map((grade) => {
                const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
                const additionalPrice = gradePricing[grade as keyof typeof gradePricing] || 0;
                
                return (
                  <motion.div
                    key={grade}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${config.grade === grade ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'}`}
                      onClick={() => setConfig(prev => ({ ...prev, grade }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-bold">{grade}</h4>
                          {additionalPrice > 0 && (
                            <Badge className="bg-primary">+AED {additionalPrice.toLocaleString()}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {grade === "Base" && "Standard features and comfort"}
                          {grade === "SE" && "Sport styling and enhanced features"}
                          {grade === "XLE" && "Premium comfort and convenience"}
                          {grade === "Limited" && "Luxury features and materials"}
                          {grade === "Platinum" && "Top-of-the-line luxury and technology"}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Choose Exterior Color</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exteriorColors.map((color) => (
                <motion.div
                  key={color.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${config.exteriorColor === color.name ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-muted-foreground hover:shadow-lg'}`}
                    onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-black/20 flex items-center justify-center"
                          style={{ backgroundColor: `${color.code}20` }}
                        >
                          {config.exteriorColor === color.name && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-primary-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold text-foreground">{color.name}</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-muted"
                            style={{ backgroundColor: color.code }}
                          />
                          {color.price > 0 && (
                            <Badge className="bg-primary text-primary-foreground">+AED {color.price}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Choose Interior Color</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interiorColors.map((color) => (
                <motion.div
                  key={color.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${config.interiorColor === color.name ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-muted-foreground hover:shadow-lg'}`}
                    onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-black/10 flex items-center justify-center"
                        >
                          {config.interiorColor === color.name && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="h-5 w-5 text-primary-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold text-foreground">{color.name}</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-lg border-2 border-muted"
                            style={{ backgroundColor: color.code }}
                          />
                          {color.price > 0 && (
                            <Badge className="bg-primary text-primary-foreground">+AED {color.price.toLocaleString()}</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Select Accessories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessories.map((accessory) => {
                const isSelected = config.accessories.includes(accessory.name);
                return (
                  <motion.div
                    key={accessory.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:border-muted-foreground'}`}
                      onClick={() => handleAccessoryToggle(accessory.name)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            {isSelected && <Check className="h-5 w-5 text-primary" />}
                            <h4 className="font-semibold">{accessory.name}</h4>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">AED {accessory.price}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Payment & Checkout</h3>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{vehicle.name} {config.modelYear} {config.grade}</span>
                    <span>AED {vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Exterior: {config.exteriorColor}</span>
                    <span>+AED {exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Interior: {config.interiorColor}</span>
                    <span>+AED {interiorColors.find(c => c.name === config.interiorColor)?.price || 0}</span>
                  </div>
                  {config.accessories.map(accessory => {
                    const accessoryData = accessories.find(a => a.name === accessory);
                    return (
                      <div key={accessory} className="flex justify-between text-sm text-muted-foreground">
                        <span>{accessory}</span>
                        <span>+AED {accessoryData?.price || 0}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Price</span>
                    <span className="text-primary">AED {calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                  size="lg"
                >
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 p-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Order Confirmed!</h2>
            <p className="text-muted-foreground">Your {vehicle.name} has been configured and ordered successfully.</p>
            
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-2">
                <div><strong>Model:</strong> {vehicle.name} {config.modelYear} {config.grade}</div>
                <div><strong>Exterior:</strong> {config.exteriorColor}</div>
                <div><strong>Interior:</strong> {config.interiorColor}</div>
                <div><strong>Accessories:</strong> {config.accessories.join(", ") || "None"}</div>
                <div className="pt-2 border-t"><strong>Total Price:</strong> AED {calculateTotalPrice().toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
              Close
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Configure Your {vehicle.name}</DialogTitle>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 px-4">
          {steps.map((stepData, index) => (
            <div key={stepData.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepData.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > stepData.number ? <Check className="h-5 w-5" /> : stepData.icon}
              </div>
              <span className="text-xs mt-1 text-center">{stepData.title}</span>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mt-2 ${step > stepData.number ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px] p-4"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="text-center">
            <p className="text-lg font-bold text-primary">
              Total: AED {calculateTotalPrice().toLocaleString()}
            </p>
          </div>
          
          <Button 
            onClick={nextStep} 
            disabled={step === 6}
            className="bg-primary hover:bg-primary/90 flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarBuilder;
