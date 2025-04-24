
import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Calculator, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleCTAProps {
  onTestDriveClick: () => void;
  onFinanceClick: () => void;
  onConfigureClick: () => void;
}

const VehicleCTA = ({ onTestDriveClick, onFinanceClick, onConfigureClick }: VehicleCTAProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700"
    >
      <div className="toyota-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={onTestDriveClick}
            size="lg" 
            className="bg-toyota-red hover:bg-toyota-darkred h-14 text-base"
          >
            <TestTube className="h-5 w-5 mr-2" />
            Book a Test Drive
          </Button>
          
          <Button 
            onClick={onFinanceClick}
            variant="outline" 
            size="lg"
            className="h-14 text-base"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Finance
          </Button>
          
          <Button 
            onClick={onConfigureClick}
            size="lg"
            className="bg-toyota-blue hover:bg-toyota-darkblue h-14 text-base"
          >
            <Settings className="h-5 w-5 mr-2" />
            Configure Vehicle
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default VehicleCTA;
