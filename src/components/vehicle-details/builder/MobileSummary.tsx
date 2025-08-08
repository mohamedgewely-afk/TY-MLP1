
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileSummaryProps {
  config: BuilderConfig;
  totalPrice: number;
  step: number;
  reserveAmount: number;
  deviceCategory: DeviceCategory;
  showPaymentButton?: boolean;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({
  config,
  totalPrice,
  step,
  reserveAmount,
  deviceCategory,
  showPaymentButton = true
}) => {
  const { containerPadding, buttonSize, textSize, touchTarget } = useResponsiveSize();
  const monthlyPayment = Math.round((totalPrice * 0.8 * 0.035) / 12);

  const getGridSpacing = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'gap-1';
      case 'standardMobile': return 'gap-1.5';
      case 'largeMobile': return 'gap-1.5';
      case 'extraLargeMobile': return 'gap-2';
      default: return 'gap-1.5';
    }
  };

  const getCardPadding = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'p-1.5';
      case 'standardMobile': return 'p-2';
      case 'largeMobile': return 'p-2';
      case 'extraLargeMobile': return 'p-2.5';
      default: return 'p-2';
    }
  };

  const getTextSize = () => {
    switch (deviceCategory) {
      case 'smallMobile': return { label: 'text-xs', value: 'text-sm' };
      case 'standardMobile': return { label: 'text-xs', value: 'text-sm' };
      default: return { label: 'text-xs', value: 'text-sm' };
    }
  };

  const textSizes = getTextSize();

  return (
    <div className="bg-card/98 backdrop-blur-xl border-t border-border px-3 py-2">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className={`grid grid-cols-3 ${getGridSpacing()} text-center mb-2`}>
            <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Total Price</div>
              <div className={`${textSizes.value} font-bold truncate text-foreground`}>AED {totalPrice.toLocaleString()}</div>
            </div>
            <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Monthly</div>
              <div className={`${textSizes.value} font-bold truncate text-foreground`}>AED {monthlyPayment.toLocaleString()}</div>
            </div>
            <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Reserve</div>
              <div className={`${textSizes.value} font-bold truncate text-foreground`}>AED {reserveAmount.toLocaleString()}</div>
            </div>
          </div>
          
          {showPaymentButton && step === 4 && (
            <Button className={`w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-lg min-h-[48px] ${textSizes.value}`}>
              <CreditCard className={`mr-2 ${deviceCategory === 'smallMobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className="truncate">Reserve Now</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSummary;
