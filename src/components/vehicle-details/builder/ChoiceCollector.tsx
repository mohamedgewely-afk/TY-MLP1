
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

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
    { key: 'modelYear', label: 'Year', value: config.modelYear, step: 1 },
    { key: 'engine', label: 'Engine', value: config.engine, step: 2 },
    { key: 'grade', label: 'Grade', value: config.grade, step: 3 },
    { key: 'exteriorColor', label: 'Exterior', value: config.exteriorColor, step: 4 },
    { key: 'interiorColor', label: 'Interior', value: config.interiorColor, step: 5 },
    { key: 'accessories', label: 'Accessories', value: `${config.accessories.length} selected`, step: 6 }
  ];

  const completedChoices = choices.filter(choice => 
    choice.step < step && (
      choice.key === 'accessories' ? config.accessories.length > 0 : choice.value && choice.value !== 'Base'
    )
  );

  if (completedChoices.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-primary mb-3">Your Selections</h3>
          <div className="flex flex-wrap gap-2">
            {completedChoices.map((choice) => (
              <Badge
                key={choice.key}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {choice.label}: {choice.value}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChoiceCollector;
