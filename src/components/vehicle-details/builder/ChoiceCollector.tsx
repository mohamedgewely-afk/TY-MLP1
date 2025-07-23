import React from "react";
import { motion } from "framer-motion";
import { DeviceCategory, useDeviceInfo, useResponsiveSize } from "@/hooks/use-device-info";

interface ChoiceCollectorProps {
  config: {
    modelYear: string;
    engine: string;
    grade: string;
    exteriorColor: string;
    interiorColor: string;
    accessories: string[];
  };
  step: number;
}

const ChoiceCollector: React.FC<ChoiceCollectorProps> = ({ config, step }) => {
  const { deviceCategory } = useDeviceInfo();
  const { containerPadding, textSize } = useResponsiveSize();

  const getCompactSize = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'text-xs px-1.5 py-0.5';
      case 'standardMobile': return 'text-xs px-2 py-1';
      case 'largeMobile': return 'text-sm px-2.5 py-1';
      default: return 'text-sm px-3 py-1';
    }
  };

  const getGridCols = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'grid-cols-2';
      case 'standardMobile': return 'grid-cols-2';
      case 'largeMobile': return 'grid-cols-3';
      default: return 'grid-cols-3';
    }
  };

  const getSpacing = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'gap-1';
      case 'standardMobile': return 'gap-1.5';
      default: return 'gap-2';
    }
  };

  const choices = [
    { key: 'modelYear', label: 'Year', value: config.modelYear },
    { key: 'engine', label: 'Engine', value: config.engine },
    { key: 'grade', label: 'Grade', value: config.grade },
    { key: 'exteriorColor', label: 'Exterior', value: config.exteriorColor },
    { key: 'interiorColor', label: 'Interior', value: config.interiorColor },
    { key: 'accessories', label: 'Accessories', value: `${config.accessories.length} selected` }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full overflow-hidden"
    >
      <motion.div
        className={`${textSize.xs} text-muted-foreground mb-1 font-medium`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Your Choices
      </motion.div>
      
      <motion.div 
        className={`grid ${getGridCols()} ${getSpacing()} overflow-hidden`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {choices.map((choice, index) => (
          <motion.div
            key={choice.key}
            className={`bg-muted/30 rounded-md border border-border/20 overflow-hidden min-w-0 ${
              deviceCategory === 'smallMobile' ? 'p-1' : 'p-1.5'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(var(--muted), 0.5)' }}
          >
            <div className={`${textSize.xs} text-muted-foreground mb-0.5 font-medium truncate`}>
              {choice.label}
            </div>
            <div className={`${getCompactSize()} font-semibold text-foreground rounded truncate leading-tight`}>
              {choice.value || 'Not selected'}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChoiceCollector;
