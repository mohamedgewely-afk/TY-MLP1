import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowRight } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ReviewStepProps {
  vehicle: VehicleModel;
  config: BuilderConfig;
  totalPrice: number;
  getCurrentVehicleImage: () => string;
  onPayment: () => void;
  showPaymentButton?: boolean;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

const exteriorColors = [
  { name: "Pearl White", price: 0 },
  { name: "Midnight Black", price: 500 },
  { name: "Silver Metallic", price: 300 },
  { name: "Ruby Red", price: 700 },
  { name: "Ocean Blue", price: 600 },
  { name: "Storm Gray", price: 400 }
];

const interiorColors = [
  { name: "Black Fabric", price: 0 },
  { name: "Beige Leather", price: 1500 },
  { name: "Brown Leather", price: 1500 },
  { name: "Red Leather", price: 2000 }
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

const ReviewStep: React.FC<ReviewStepProps> = ({
  vehicle,
  config,
  totalPrice,
  getCurrentVehicleImage,
  onPayment,
  showPaymentButton = false,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}) => {
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
              AED {totalPrice.toLocaleString()}
            </motion.span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            *Price excludes VAT, registration, and insurance
          </p>
        </motion.div>
        
        {showPaymentButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button 
              onClick={onPayment}
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
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
