
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CreditCard } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileSummaryProps {
  config: BuilderConfig;
  totalPrice: number;
  step: number;
  reserveAmount: number;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({
  config,
  totalPrice,
  step,
  reserveAmount
}) => {
  const monthlyPayment = Math.round((totalPrice * 0.8 * 0.035) / 12);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card/95 backdrop-blur-xl border-t border-border p-3"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground mb-1">Total Price</div>
              <div className="text-sm font-bold">AED {totalPrice.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground mb-1">Monthly</div>
              <div className="text-sm font-bold">AED {monthlyPayment.toLocaleString()}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground mb-1">Reserve</div>
              <div className="text-sm font-bold">AED {reserveAmount.toLocaleString()}</div>
            </div>
          </div>
          
          {step === 4 && (
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-lg font-semibold text-sm shadow-lg min-h-[44px]">
              <CreditCard className="mr-2 h-4 w-4" />
              Reserve Now
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileSummary;
