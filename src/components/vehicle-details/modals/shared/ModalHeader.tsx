
import React from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onBack?: () => void;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  onClose,
  onBack,
  showProgress,
  currentStep = 1,
  totalSteps = 1
}) => {
  return (
    <motion.div 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between p-4 lg:p-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showProgress && (
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{currentStep} of {totalSteps}</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalHeader;
