
import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConfigSummaryProps {
  selectedEngine: string;
  selectedGrade: string;
}

const ConfigSummary: React.FC<ConfigSummaryProps> = ({
  selectedEngine,
  selectedGrade
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center px-4"
      key={`${selectedEngine}-${selectedGrade}-summary`}
    >
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6 lg:p-8">
          <h3 className="text-xl font-bold mb-4">Your Configuration</h3>
          <div className="grid grid-cols-2 gap-6 text-sm mb-6">
            <div>
              <div className="text-muted-foreground mb-1">Engine</div>
              <div className="font-bold text-lg">{selectedEngine}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Grade</div>
              <div className="font-bold text-lg">{selectedGrade}</div>
            </div>
          </div>
          <Button 
            className="w-full py-3 min-h-[44px]"
            onClick={() => {
              const event = new CustomEvent('openCarBuilder', { 
                detail: { step: 3, config: { engine: selectedEngine, grade: selectedGrade } } 
              });
              window.dispatchEvent(event);
            }}
          >
            Configure Your Vehicle
            <Settings className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConfigSummary;
