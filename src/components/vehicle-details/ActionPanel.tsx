
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Download, Car, Calculator, PencilRuler } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionPanelProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  onFinanceCalculator: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const isMobile = useIsMobile();

  const handleDownloadBrochure = () => {
    // Create a mock brochure download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${vehicle.name}_brochure.pdf`;
    link.click();
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-20 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl border-t border-border/50"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadBrochure}
            className="flex-1 bg-background/95 backdrop-blur-sm border-border/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Brochure
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onFinanceCalculator}
            className="flex-1 bg-background/95 backdrop-blur-sm border-border/50"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Finance
          </Button>
          <Button
            size="sm"
            onClick={onBookTestDrive}
            className="flex-1 bg-primary text-primary-foreground shadow-lg"
          >
            <Car className="h-4 w-4 mr-2" />
            Test Drive
          </Button>
        </div>
        <Button
          onClick={onCarBuilder}
          className="w-full mt-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
          size="lg"
        >
          <PencilRuler className="h-5 w-5 mr-2" />
          Configure & Build
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 right-8 z-50 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-6 min-w-[300px]"
    >
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-center mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadBrochure}
            className="flex flex-col h-auto py-3 gap-1"
          >
            <Download className="h-5 w-5" />
            <span className="text-xs">Brochure</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onFinanceCalculator}
            className="flex flex-col h-auto py-3 gap-1"
          >
            <Calculator className="h-5 w-5" />
            <span className="text-xs">Finance</span>
          </Button>
        </div>

        <Button
          onClick={onBookTestDrive}
          className="w-full bg-primary text-primary-foreground"
          size="lg"
        >
          <Car className="h-5 w-5 mr-2" />
          Book Test Drive
        </Button>

        <Button
          onClick={onCarBuilder}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
          size="lg"
        >
          <PencilRuler className="h-5 w-5 mr-2" />
          Configure & Build
        </Button>
      </div>
    </motion.div>
  );
};

export default ActionPanel;
