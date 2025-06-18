
import React from "react";
import { motion } from "framer-motion";
import { Car, Settings, Calculator, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <motion.div 
      className="fixed bottom-20 left-0 right-0 z-40 p-4 bg-gradient-to-t from-background via-background/95 to-transparent"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div 
        className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl p-4 shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h3 
              className="font-bold text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {vehicle.name}
            </motion.h3>
            <motion.p 
              className="text-2xl font-black text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              AED {vehicle.price.toLocaleString()}
            </motion.p>
          </div>
          
          <div className="flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleFavorite}
                className={`rounded-2xl ${isFavorite ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button variant="outline" size="icon" className="rounded-2xl">
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={onBookTestDrive}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-2xl py-6 flex flex-col space-y-2"
            >
              <Car className="h-5 w-5" />
              <span className="text-sm font-medium">Test Drive</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="outline"
              onClick={onCarBuilder}
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-2xl py-6 flex flex-col space-y-2"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Configure</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              variant="outline"
              onClick={onFinanceCalculator}
              className="w-full border-2 border-muted-foreground/30 text-foreground hover:bg-muted rounded-2xl py-6 flex flex-col space-y-2"
            >
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-medium">Finance</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActionPanel;
