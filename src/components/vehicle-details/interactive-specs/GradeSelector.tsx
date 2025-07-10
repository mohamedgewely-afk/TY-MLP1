
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Grade {
  name: string;
  price: string;
  features: string[];
}

interface GradeSelectorProps {
  grades: Grade[];
  selectedGrade: string;
  selectedEngine: string;
  onGradeSelect: (grade: string) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({
  grades,
  selectedGrade,
  selectedEngine,
  onGradeSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
      key={selectedEngine}
    >
      <h3 className="text-lg font-bold mb-6 text-center">Select Your Grade</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {grades.map((grade, index) => (
          <motion.button
            key={grade.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onGradeSelect(grade.name)}
            className={`p-4 rounded-xl border-2 transition-all text-left min-h-[120px] ${
              selectedGrade === grade.name
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg">{grade.name}</h4>
              <Badge variant={selectedGrade === grade.name ? "default" : "secondary"} className="text-xs">
                {grade.price}
              </Badge>
            </div>
            <div className="space-y-1">
              {grade.features.map((feature) => (
                <div key={feature} className="text-xs text-muted-foreground">
                  • {feature}
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default GradeSelector;
