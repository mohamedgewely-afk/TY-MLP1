import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleModel } from "@/types/vehicle";
import { ChevronLeft, ChevronRight, Check, Car, Palette, Settings, CreditCard, Sparkles, Zap, Star, ArrowRight } from "lucide-react";
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

  // Get current vehicle image based on selections
  const getCurrentVehicleImage = () => {
    const exteriorColorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return exteriorColorData?.image || exteriorColors[0].image;
  };

  // Handle swipe navigation
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

  // Combined choices summary component
  const ChoicesSummary = () => (
    <motion.div 
      className="fixed top-4 right-4 w-80 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl z-50"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Your Build</h3>
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-white" />
          </motion.div>
        </div>
        
        {/* Vehicle Preview Image */}
        <motion.div 
          className="relative w-full h-32 rounded-2xl overflow-hidden"
          layoutId="vehicle-preview"
        >
          <img 
            src={getCurrentVehicleImage()} 
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
            {config.exteriorColor}
          </div>
        </motion.div>

        {/* Quick Summary */}
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex justify-between">
            <span>Year & Grade:</span>
            <span className="text-white font-medium">{config.modelYear} {config.grade}</span>
          </div>
          <div className="flex justify-between">
            <span>Interior:</span>
            <span className="text-white font-medium">{config.interiorColor}</span>
          </div>
          <div className="flex justify-between">
            <span>Accessories:</span>
            <span className="text-white font-medium">{config.accessories.length} selected</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Total Price:</span>
            <span className="text-xl font-bold text-white">AED {calculateTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div 
            className="space-y-8 h-[500px] flex flex-col justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose Model Year
            </motion.h3>
            
            <div className="grid grid-cols-2 gap-6">
              {["2024", "2025"].map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative perspective-1000"
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-500 relative overflow-hidden border-2 ${
                      config.modelYear === year 
                        ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-2xl shadow-primary/25' 
                        : 'border-white/20 bg-white/5 hover:border-primary/50 backdrop-blur-lg'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                  >
                    {config.modelYear === year && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                        layoutId="selected-bg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <CardContent className="p-8 text-center relative z-10">
                      <motion.h4 
                        className="text-3xl font-black mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                        animate={config.modelYear === year ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {year}
                      </motion.h4>
                      <p className="text-muted-foreground text-lg">
                        {year === "2025" ? "✨ Latest Features" : "💎 Proven Excellence"}
                      </p>
                      
                      {config.modelYear === year && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="h-5 w-5 text-white" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div 
            className="space-y-8 h-[500px] flex flex-col justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Select Grade
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grades.map((grade, index) => {
                const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
                const additionalPrice = gradePricing[grade as keyof typeof gradePricing] || 0;
                
                return (
                  <motion.div
                    key={grade}
                    initial={{ opacity: 0, x: -50, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.03, 
                      rotateY: 3,
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-500 relative overflow-hidden border-2 ${
                        config.grade === grade 
                          ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-xl shadow-primary/25' 
                          : 'border-white/20 bg-white/5 hover:border-primary/50 backdrop-blur-lg'
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, grade }))}
                    >
                      {config.grade === grade && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                          layoutId="selected-grade-bg"
                        />
                      )}
                      
                      <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <motion.h4 
                            className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                            animate={config.grade === grade ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {grade}
                          </motion.h4>
                          {additionalPrice > 0 && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                              +AED {additionalPrice.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {grade === "Base" && "🚗 Essential features for everyday driving"}
                          {grade === "SE" && "⚡ Sport styling with enhanced performance"}
                          {grade === "XLE" && "✨ Premium comfort and convenience"}
                          {grade === "Limited" && "💎 Luxury features and premium materials"}
                          {grade === "Platinum" && "🏆 Ultimate luxury and cutting-edge technology"}
                        </p>
                        
                        {config.grade === grade && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
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
          <div 
            className="space-y-8 h-[500px] overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose Exterior Color
            </motion.h3>

            {/* Large Vehicle Preview */}
            <motion.div 
              className="relative w-full h-64 rounded-3xl overflow-hidden mb-8"
              layoutId="vehicle-preview"
              key={config.exteriorColor}
            >
              <motion.img 
                src={getCurrentVehicleImage()}
                alt="Vehicle Preview"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <motion.div 
                className="absolute bottom-4 left-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="text-2xl font-bold">{config.exteriorColor}</h4>
                <p className="text-white/80">Premium Exterior Finish</p>
              </motion.div>
              
              {/* Floating particles effect */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {exteriorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateX: 5,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  className="cursor-pointer"
                >
                  <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${
                    config.exteriorColor === color.name 
                      ? 'border-primary shadow-2xl shadow-primary/25 ring-4 ring-primary/20' 
                      : 'border-white/20 hover:border-primary/50 bg-white/5 backdrop-blur-lg'
                  }`}>
                    
                    {config.exteriorColor === color.name && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
                        layoutId="selected-color-bg"
                      />
                    )}
                    
                    <CardContent className="p-4 relative z-10">
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-4">
                        <motion.img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {config.exteriorColor === color.name && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold text-foreground text-sm">{color.name}</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <motion.div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: color.code }}
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          />
                          {color.price > 0 && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 text-xs">
                              +AED {color.price}
                            </Badge>
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
          <div 
            className="space-y-8 h-[500px] overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-orange-400 to-red-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose Interior Color
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interiorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3 + index * 0.15, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.03, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  className="cursor-pointer"
                >
                  <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${
                    config.interiorColor === color.name 
                      ? 'border-primary shadow-2xl shadow-primary/25 ring-4 ring-primary/20' 
                      : 'border-white/20 hover:border-primary/50 bg-white/5 backdrop-blur-lg'
                  }`}>
                    
                    {config.interiorColor === color.name && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
                        layoutId="selected-interior-bg"
                      />
                    )}
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="aspect-video relative rounded-xl overflow-hidden mb-4">
                        <motion.img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        
                        {config.interiorColor === color.name && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="text-center space-y-3">
                        <h4 className="text-xl font-bold text-foreground">{color.name}</h4>
                        <div className="flex items-center justify-center space-x-3">
                          <motion.div 
                            className="w-8 h-8 rounded-lg border-2 border-white shadow-lg"
                            style={{ backgroundColor: color.code }}
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          />
                          {color.price > 0 && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                              +AED {color.price.toLocaleString()}
                            </Badge>
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
          <div 
            className="space-y-8 h-[500px] overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Select Accessories
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessories.map((accessory, index) => {
                const isSelected = config.accessories.includes(accessory.name);
                return (
                  <motion.div
                    key={accessory.name}
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.03, 
                      rotateX: 3,
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAccessoryToggle(accessory.name)}
                    className="cursor-pointer"
                  >
                    <Card className={`relative overflow-hidden border-2 transition-all duration-500 ${
                      isSelected 
                        ? 'border-primary shadow-2xl shadow-primary/25 ring-4 ring-primary/20' 
                        : 'border-white/20 hover:border-primary/50 bg-white/5 backdrop-blur-lg'
                    }`}>
                      
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
                          layoutId={`selected-accessory-${accessory.name}`}
                        />
                      )}
                      
                      <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <motion.div 
                              className="text-3xl"
                              animate={isSelected ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              {accessory.icon}
                            </motion.div>
                            <div>
                              <h4 className="font-bold text-lg text-foreground">{accessory.name}</h4>
                              <p className="text-sm text-muted-foreground">Premium feature</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 text-lg px-3 py-1">
                              AED {accessory.price}
                            </Badge>
                            
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Check className="h-5 w-5 text-white" />
                              </motion.div>
                            )}
                          </div>
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
          <div 
            className="space-y-8 h-[500px] overflow-y-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <motion.h3 
              className="text-4xl font-black text-center bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Review Your Build
            </motion.h3>
            
            <div className="space-y-6">
              {/* Final Vehicle Preview */}
              <motion.div 
                className="relative w-full h-48 rounded-3xl overflow-hidden"
                layoutId="vehicle-preview"
              >
                <img 
                  src={getCurrentVehicleImage()}
                  alt="Final Vehicle Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-2xl font-bold">{vehicle.name} {config.modelYear}</h4>
                  <p className="text-white/80">{config.grade} • {config.exteriorColor}</p>
                </div>
                
                {/* Success animation particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>

              <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Configuration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <motion.div 
                      className="flex justify-between py-3 border-b border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="font-medium">{vehicle.name} {config.modelYear} {config.grade}</span>
                      <span className="font-bold">AED {(vehicle.price + (config.grade === "SE" ? 2000 : config.grade === "XLE" ? 4000 : config.grade === "Limited" ? 6000 : config.grade === "Platinum" ? 10000 : 0)).toLocaleString()}</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between py-2 border-b border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span>Exterior: {config.exteriorColor}</span>
                      <span>+AED {exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0}</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between py-2 border-b border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span>Interior: {config.interiorColor}</span>
                      <span>+AED {interiorColors.find(c => c.name === config.interiorColor)?.price || 0}</span>
                    </motion.div>
                    
                    {config.accessories.length > 0 ? (
                      config.accessories.map((accessory, index) => {
                        const accessoryData = accessories.find(a => a.name === accessory);
                        return accessoryData ? (
                          <motion.div 
                            key={accessory} 
                            className="flex justify-between py-2 border-b border-white/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <span>{accessory}</span>
                            <span>+AED {accessoryData.price}</span>
                          </motion.div>
                        ) : null;
                      })
                    ) : (
                      <motion.div 
                        className="flex justify-between py-2 border-b border-white/10"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span>No accessories selected</span>
                        <span>AED 0</span>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <motion.div 
                className="bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-xl p-6 rounded-3xl border border-primary/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total Price</span>
                  <motion.span 
                    className="text-3xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    AED {calculateTotalPrice().toLocaleString()}
                  </motion.span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  *Price excludes VAT, registration, and insurance
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-4 text-lg rounded-xl shadow-2xl border-0"
                  size="lg"
                >
                  <motion.div 
                    className="flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Complete Your Order</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-background to-muted border-0 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-center space-y-8 p-8"
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Check className="h-12 w-12 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Order Confirmed! 🎉
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your {vehicle.name} has been configured and ordered successfully.
            </motion.p>
            
            {/* Final vehicle preview */}
            <motion.div 
              className="relative w-full h-32 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <img 
                src={getCurrentVehicleImage()}
                alt="Ordered Vehicle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                {vehicle.name} • {config.exteriorColor}
              </div>
            </motion.div>
            
            <Card className="text-left bg-white/5 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Model:</strong> {vehicle.name} {config.modelYear} {config.grade}</div>
                <div><strong>Exterior:</strong> {config.exteriorColor}</div>
                <div><strong>Interior:</strong> {config.interiorColor}</div>
                <div><strong>Accessories:</strong> {config.accessories.join(", ") || "None"}</div>
                <div className="pt-2 border-t border-white/20">
                  <strong>Total Price:</strong> AED {calculateTotalPrice().toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onClose} 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 rounded-xl shadow-lg border-0"
                size="lg"
              >
                Continue Exploring
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
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

        {/* Futuristic Progress Steps */}
        <div className="flex justify-center items-center mb-6 px-4 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl rounded-full p-4 border border-white/20">
            {steps.map((stepData, index) => (
              <React.Fragment key={stepData.number}>
                <motion.div 
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step >= stepData.number 
                      ? `bg-gradient-to-r ${stepData.gradient} text-white shadow-2xl` 
                      : 'bg-white/10 text-muted-foreground border border-white/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={step === stepData.number ? { 
                    boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0)"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step > stepData.number ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Check className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={step === stepData.number ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      {stepData.icon}
                    </motion.div>
                  )}
                  
                  {/* Step label */}
                  <motion.div 
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= stepData.number ? 1 : 0.5 }}
                  >
                    {stepData.title}
                  </motion.div>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <motion.div 
                    className={`w-8 h-1 rounded-full transition-all duration-500 ${
                      step > stepData.number 
                        ? `bg-gradient-to-r ${stepData.gradient}` 
                        : 'bg-white/20'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: step > stepData.number ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Choices Summary - Only show after step 1 */}
        {step > 1 && <ChoicesSummary />}

        {/* Step Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Animated background */}
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
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Navigation */}
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

        {/* Floating Navigation Arrows */}
        <motion.button
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 ${
            step === 1 
              ? 'opacity-30 cursor-not-allowed bg-white/10' 
              : 'hover:bg-white/20 bg-white/10 hover:shadow-2xl backdrop-blur-xl border border-white/20'
          }`}
          whileHover={step > 1 ? { scale: 1.1, x: -5 } : {}}
          whileTap={step > 1 ? { scale: 0.9 } : {}}
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </motion.button>

        <motion.button
          onClick={() => step < 6 && setStep(step + 1)}
          disabled={step === 6}
          className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 ${
            step === 6 
              ? 'opacity-30 cursor-not-allowed bg-white/10' 
              : 'hover:bg-white/20 bg-white/10 hover:shadow-2xl backdrop-blur-xl border border-white/20'
          }`}
          whileHover={step < 6 ? { scale: 1.1, x: 5 } : {}}
          whileTap={step < 6 ? { scale: 0.9 } : {}}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </motion.button>
      </DialogContent>
    </Dialog>
  );
};

export default CarBuilder;
