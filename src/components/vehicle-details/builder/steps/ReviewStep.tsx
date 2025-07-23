
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

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
  showPaymentButton?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
  config, 
  calculateTotalPrice, 
  handlePayment,
  showPaymentButton = true
}) => {
  const configItems = [
    { label: "Model Year", value: config.modelYear },
    { label: "Engine", value: config.engine },
    { label: "Grade", value: config.grade },
    { label: "Exterior Color", value: config.exteriorColor },
    { label: "Interior Color", value: config.interiorColor },
  ];

  return (
    <div className="p-6 pb-8">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Review Your Configuration
      </motion.h2>
      
      <div className="space-y-6">
        {/* Configuration Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Your Selection</h3>
            <div className="space-y-3">
              {configItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accessories */}
        {config.accessories.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Selected Accessories</h3>
              <div className="space-y-2">
                {config.accessories.map((accessory, index) => (
                  <motion.div
                    key={accessory}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{accessory}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Price */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Price</span>
              <span className="text-2xl font-black text-primary">
                AED {calculateTotalPrice().toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button - only show if showPaymentButton is true */}
        {showPaymentButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={handlePayment}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg"
              size="lg"
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Proceed to Payment
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
