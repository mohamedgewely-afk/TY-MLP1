
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface StepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  handleAccessoryToggle: (accessoryName: string) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  getCurrentVehicleImage: () => string;
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

const StepContent: React.FC<StepContentProps> = ({
  step,
  config,
  setConfig,
  handleAccessoryToggle,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  getCurrentVehicleImage
}) => {
  const renderContent = () => {
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
              {modelYears.map((year, index) => (
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

      default:
        return null;
    }
  };

  return renderContent();
};

export default StepContent;
