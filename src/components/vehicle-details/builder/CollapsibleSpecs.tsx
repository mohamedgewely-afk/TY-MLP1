import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Zap, Shield, Fuel, Gauge } from "lucide-react";

interface CollapsibleSpecsProps {
  config: {
    modelYear: string;
    engine: string;
    grade: string;
  };
  expanded?: boolean;
}

const CollapsibleSpecs: React.FC<CollapsibleSpecsProps> = ({ config, expanded: defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getSpecsForConfig = () => {
    return {
      power: config.engine === "4.0L" ? "301 HP" : "268 HP",
      torque: config.engine === "4.0L" ? "365 Nm" : "336 Nm",
      fuelEconomy: config.grade === "Platinum" ? "20.5 km/L" : "22.2 km/L",
      transmission: "CVT",
      drivetrain: config.grade === "Limited" || config.grade === "Platinum" ? "AWD" : "FWD"
    };
  };

  const specs = getSpecsForConfig();
  const uspIcons = [
    { icon: <Zap className="h-5 w-5" />, label: "Hybrid Power", value: specs.power },
    { icon: <Gauge className="h-5 w-5" />, label: "Torque", value: specs.torque },
    { icon: <Fuel className="h-5 w-5" />, label: "Efficiency", value: specs.fuelEconomy },
    { icon: <Shield className="h-5 w-5" />, label: "Drive", value: specs.drivetrain }
  ];

  return (
    <div className="mb-4">
      {/* USP Icons - Always visible */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {uspIcons.map((usp, index) => (
          <motion.div
            key={usp.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-primary/10 rounded-lg p-3 text-center"
          >
            <div className="text-primary mb-1 flex justify-center">{usp.icon}</div>
            <div className="text-xs font-bold text-foreground">{usp.value}</div>
            <div className="text-xs text-muted-foreground">{usp.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Collapsible detailed specs */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-3"
      >
        {isExpanded ? "Hide" : "Show"} Detailed Specs
        {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="bg-background/80 rounded-lg p-3">
                      <div className="text-muted-foreground capitalize text-xs">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-semibold text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSpecs;
