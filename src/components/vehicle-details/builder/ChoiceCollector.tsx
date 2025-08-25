
import React from "react";
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
    <div className="space-y-2 opacity-0 animate-fade-in">
      <h4 className="text-xs font-medium text-muted-foreground">Your Choices</h4>
      <div className="flex flex-wrap gap-1">
        {visibleChoices.map((choice) => (
          <Badge 
            key={choice.label}
            variant="secondary" 
            className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20"
          >
            <span className="mr-1">{choice.icon}</span>
            {choice.value}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ChoiceCollector;
