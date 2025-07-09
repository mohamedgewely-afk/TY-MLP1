
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  reserveAmount?: number;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({ 
  config, 
  totalPrice, 
  step,
  reserveAmount = 2000 
}) => {
  const monthlyEMI = Math.round((totalPrice * 0.8 * 0.035 / 12) / (1 - Math.pow(1 + 0.035/12, -60)));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-xl border-t border-border shadow-2xl"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-4">
          {/* Price Display */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <motion.div 
                className="text-2xl font-black text-primary"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                AED {totalPrice.toLocaleString()}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                From AED {monthlyEMI}/month
              </div>
            </div>
            
            {/* HIGHLIGHTED RESERVE AMOUNT */}
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 10px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl"
            >
              <div className="text-xs font-medium">Reserve Now</div>
              <div className="text-lg font-bold flex items-center">
                <span className="text-xs mr-1">د.إ</span>
                {reserveAmount.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Configuration Summary */}
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-3 border-t border-border"
            >
              <div className="flex flex-wrap gap-2">
                {config.modelYear && (
                  <Badge variant="secondary" className="text-xs">
                    {config.modelYear}
                  </Badge>
                )}
                {config.engine && (
                  <Badge variant="secondary" className="text-xs">
                    {config.engine}
                  </Badge>
                )}
                {config.grade && (
                  <Badge variant="default" className="text-xs">
                    {config.grade}
                  </Badge>
                )}
                {config.exteriorColor && (
                  <Badge variant="outline" className="text-xs">
                    {config.exteriorColor}
                  </Badge>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileSummary;
