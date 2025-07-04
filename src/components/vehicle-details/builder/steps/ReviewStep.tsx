
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

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
  return (
    <div className="p-6 text-center">
      <motion.h2 
        className="text-2xl font-bold mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Review & Confirm
      </motion.h2>

      <div className="space-y-3 mb-8 text-left bg-card p-4 rounded-xl border border-border">
        <div className="flex justify-between text-foreground">
          <span>Model Year:</span>
          <span className="text-primary font-medium">{config.modelYear}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Engine:</span>
          <span className="text-primary font-medium">{config.engine}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Grade:</span>
          <span className="text-primary font-medium">{config.grade}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Exterior:</span>
          <span className="text-primary font-medium">{config.exteriorColor}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Interior:</span>
          <span className="text-primary font-medium">{config.interiorColor}</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Accessories:</span>
          <span className="text-primary font-medium">{config.accessories.length} selected</span>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={handlePayment}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl text-lg font-bold border border-primary"
        >
          <Zap className="mr-2 h-5 w-5" />
          Confirm Order - AED {calculateTotalPrice().toLocaleString()}
        </Button>
      </motion.div>
    </div>
  );
};

export default ReviewStep;
