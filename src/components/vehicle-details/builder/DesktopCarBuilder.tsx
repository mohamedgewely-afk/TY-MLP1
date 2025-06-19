
import React from "react";
import { motion } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface DesktopCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
}

const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative h-full w-full bg-gradient-to-br from-toyota-black via-toyota-gray to-toyota-black overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-toyota-white">
          <motion.h2 
            className="text-4xl font-bold mb-6 text-toyota-white"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Desktop Experience
          </motion.h2>
          <p className="text-xl mb-8 text-toyota-white/80">Coming Soon - Optimized for Mobile First</p>
          <motion.button
            onClick={onClose}
            className="px-8 py-4 bg-toyota-red hover:bg-toyota-darkred rounded-xl font-bold text-toyota-white border-2 border-toyota-red shadow-lg shadow-toyota-red/30"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(229, 0, 0, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Close Builder
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
