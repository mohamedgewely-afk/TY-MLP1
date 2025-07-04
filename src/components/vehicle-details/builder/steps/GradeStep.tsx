
import React from "react";
import { motion } from "framer-motion";

interface GradeStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = ["Base", "SE", "XLE", "Limited", "Platinum"];

const GradeStep: React.FC<GradeStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6 pb-24">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Select Grade
      </motion.h2>
      
      <div className="space-y-3">
        {grades.map((grade, index) => (
          <motion.div
            key={grade}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.grade === grade 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, grade }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-lg font-bold text-foreground">{grade}</h3>
            <p className="text-primary text-sm">
              {grade === "Base" && "Essential features"}
              {grade === "SE" && "Sport edition"}
              {grade === "XLE" && "Premium comfort"}
              {grade === "Limited" && "Luxury features"}
              {grade === "Platinum" && "Ultimate luxury"}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GradeStep;
