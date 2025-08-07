
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Car, Palette, Package, CreditCard, Calendar, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { useSwipeableEnhanced } from "@/hooks/use-swipeable-enhanced";
import SwipeIndicators from "../SwipeIndicators";
import { contextualHaptic } from "@/utils/haptic";

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
  const [activeSection, setActiveSection] = useState(0); // 0: vehicle, 1: accessories, 2: pricing, 3: action

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

  const handleVerticalSwipe = (direction: 'up' | 'down') => {
    contextualHaptic.selectionChange();
    
    if (direction === 'up' && activeSection > 0) {
      setActiveSection(activeSection - 1);
    } else if (direction === 'down' && activeSection < 3) {
      setActiveSection(activeSection + 1);
    }
  };

  const swipeableRef = useSwipeableEnhanced({
    onSwipeUp: () => handleVerticalSwipe('up'),
    onSwipeDown: () => handleVerticalSwipe('down'),
    enableHorizontalSwipe: false,
    enableVerticalSwipe: true,
    swipeContext: 'ReviewStep',
    debug: false,
    threshold: 40
  });

  const getSectionTitle = () => {
    switch (activeSection) {
      case 0:
        return "Vehicle Configuration";
      case 1:
        return "Selected Accessories";
      case 2:
        return "Total Pricing";
      case 3:
        return "Complete Order";
      default:
        return "";
    }
  };

  return (
    <div ref={swipeableRef} className="h-full flex flex-col relative">
      {/* Swipe hint */}
      <motion.div 
        className="text-center py-2 bg-muted/20 rounded-lg mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ChevronUp className="h-3 w-3" />
          <span>Swipe up/down to review sections</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Check className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-bold text-foreground">Review Your Configuration</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {getSectionTitle()}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
            className="w-full max-w-md"
          >
            {/* Vehicle Configuration */}
            {activeSection === 0 && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Model Year</p>
                      <p className="font-semibold text-foreground">{config.modelYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Engine</p>
                      <p className="font-semibold text-foreground">{config.engine}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Car className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Grade</p>
                      <p className="font-semibold text-foreground">{config.grade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Palette className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Colors</p>
                      <p className="font-semibold text-foreground text-sm">
                        {config.exteriorColor} / {config.interiorColor}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Accessories */}
            {activeSection === 1 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Selected Accessories</h3>
                </div>
                
                {selectedAccessories.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAccessories.map((accessory, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                        <span className="text-sm text-foreground">{accessory.name}</span>
                        <span className="text-sm font-medium text-foreground">
                          +AED {accessory.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">Accessories Total</span>
                        <span className="font-bold text-primary">
                          +AED {accessoriesTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No accessories selected</p>
                  </div>
                )}
              </div>
            )}

            {/* Pricing */}
            {activeSection === 2 && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CreditCard className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">Total Price</h3>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    AED {totalPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">
                    From AED 2,850/month
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">Down Payment</p>
                    <p className="font-semibold text-green-800">AED 2,000</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">Est. Delivery</p>
                    <p className="font-semibold text-green-800">2-3 weeks</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action */}
            {activeSection === 3 && (
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to Order?</h3>
                  <p className="text-muted-foreground text-sm">
                    Reserve your vehicle with just AED 2,000
                  </p>
                </div>
                
                <Button
                  onClick={() => {
                    contextualHaptic.configComplete();
                    handlePayment();
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Reserve Now - AED 2,000
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center py-4">
        <SwipeIndicators
          total={4}
          current={activeSection}
          direction="vertical"
        />
      </div>
    </div>
  );
};

export default ReviewStep;
