
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Car, Palette, Package, CreditCard, Calendar, Zap } from "lucide-react";

interface ReviewStepProps {
  config: {
    modelYear: string;
    engine: string;
    grade: string;
    exteriorColor: string;
    interiorColor: string;
    accessories: string[];
  };
  calculateTotalPrice: () => number;
  handlePayment: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ config, calculateTotalPrice, handlePayment }) => {
  const accessories = [
    { name: "Premium Sound System", price: 1200 },
    { name: "Sunroof", price: 800 },
    { name: "Navigation System", price: 600 },
    { name: "Heated Seats", price: 400 },
    { name: "Backup Camera", price: 300 },
    { name: "Alloy Wheels", price: 900 }
  ];

  const selectedAccessories = accessories.filter(acc => 
    config.accessories.includes(acc.name)
  );

  const accessoriesTotal = selectedAccessories.reduce((total, acc) => total + acc.price, 0);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="p-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-bold text-foreground">Review Your Configuration</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Confirm your selections before proceeding
        </p>
      </motion.div>

      {/* Compact Configuration Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Model & Engine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Model Year</p>
                <p className="font-semibold text-foreground">{config.modelYear}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Engine</p>
                <p className="font-semibold text-foreground">{config.engine}</p>
              </div>
            </div>
          </div>

          {/* Grade & Colors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="font-semibold text-foreground">{config.grade}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Colors</p>
                <p className="font-semibold text-foreground text-xs">
                  {config.exteriorColor} / {config.interiorColor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Accessories - Compact Layout */}
      {selectedAccessories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Selected Accessories</h3>
          </div>
          
          <div className="space-y-2">
            {selectedAccessories.map((accessory, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-foreground">{accessory.name}</span>
                <span className="text-sm font-medium text-foreground">
                  +AED {accessory.price.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Accessories Total</span>
                <span className="text-sm font-bold text-primary">
                  +AED {accessoriesTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Summary - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-800">Total Price</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              AED {totalPrice.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">
              From AED 2,850/month
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-700">Down Payment</p>
            <p className="font-semibold text-green-800">AED 2,000</p>
          </div>
          <div>
            <p className="text-green-700">Est. Delivery</p>
            <p className="font-semibold text-green-800">2-3 weeks</p>
          </div>
        </div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="pt-2"
      >
        <Button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Reserve Now - AED 2,000
        </Button>
      </motion.div>
    </div>
  );
};

export default ReviewStep;
