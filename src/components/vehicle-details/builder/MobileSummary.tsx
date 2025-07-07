
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface MobileSummaryProps {
  config: {
    modelYear: string;
    engine: string;
    grade: string;
    exteriorColor: string;
    interiorColor: string;
    accessories: string[];
  };
  totalPrice: number;
  step: number;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({ config, totalPrice, step }) => {
  if (step === 7) return null; // Don't show on review step

  return (
    <motion.div 
      className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-foreground">Current Total</h4>
              <p className="text-sm text-muted-foreground">
                {config.modelYear} • {config.grade} • {config.engine}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">
                AED {totalPrice.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Starting from AED {Math.round(totalPrice * 0.8 / 60).toLocaleString()}/mo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileSummary;
