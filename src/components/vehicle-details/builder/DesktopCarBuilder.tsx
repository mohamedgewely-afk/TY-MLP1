
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
      className="relative h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Desktop Experience</h2>
          <p className="text-lg">Coming Soon - Optimized for Mobile First</p>
          <motion.button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold"
            whileHover={{ scale: 1.05 }}
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
