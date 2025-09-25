
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Zap, Star, Palette } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ChoiceCollectorProps {
  config: BuilderConfig;
  step: number;
}

const ChoiceCollector: React.FC<ChoiceCollectorProps> = ({ config, step }) => {
  const choices = [
    { 
      label: "Year", 
      value: config.modelYear, 
      icon: <Calendar className="h-3 w-3" />,
      show: step >= 1 
    },
    { 
      label: "Engine", 
      value: config.engine, 
      icon: <Zap className="h-3 w-3" />,
      show: step >= 1 
    },
    { 
      label: "Grade", 
      value: config.grade, 
      icon: <Star className="h-3 w-3" />,
      show: step >= 2 
    },
    { 
      label: "Color", 
      value: config.exteriorColor, 
      icon: <Palette className="h-3 w-3" />,
      show: step >= 3 
    }
  ];

  const visibleChoices = choices.filter(choice => choice.show && choice.value);

  if (visibleChoices.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h4 className="text-xs font-medium text-muted-foreground">Your Choices</h4>
      <div className="flex flex-wrap gap-1">
        {visibleChoices.map((choice, index) => (
          <motion.div
            key={choice.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
              <span className="mr-1">{choice.icon}</span>
              {choice.value}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ChoiceCollector;
