
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleModel;
  config: BuilderConfig;
  totalPrice: number;
  getCurrentVehicleImage: () => string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  isOpen,
  onClose,
  vehicle,
  config,
  totalPrice,
  getCurrentVehicleImage
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-background to-muted border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center space-y-8 p-8"
        >
          <motion.div 
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order Confirmed! 🎉
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your {vehicle.name} has been configured and ordered successfully.
          </motion.p>
          
          <motion.div 
            className="relative w-full h-32 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <img 
              src={getCurrentVehicleImage()}
              alt="Ordered Vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
              {vehicle.name} • {config.exteriorColor}
            </div>
          </motion.div>
          
          <Card className="text-left bg-white/5 backdrop-blur-lg border border-white/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Model:</strong> {vehicle.name} {config.modelYear} {config.grade}</div>
              <div><strong>Exterior:</strong> {config.exteriorColor}</div>
              <div><strong>Interior:</strong> {config.interiorColor}</div>
              <div><strong>Accessories:</strong> {config.accessories.join(", ") || "None"}</div>
              <div className="pt-2 border-t border-white/20">
                <strong>Total Price:</strong> AED {totalPrice.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onClose} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 rounded-xl shadow-lg border-0"
              size="lg"
            >
              Continue Exploring
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmation;
