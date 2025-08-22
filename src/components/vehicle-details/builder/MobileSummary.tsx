
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

  const getGridLayout = () => {
    // Use 2-column layout for very small screens to prevent truncation
    if (deviceCategory === 'smallMobile') {
      return 'grid-cols-2';
    }
    return 'grid-cols-3';
  };

  const getCardPadding = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'p-1';
      case 'standardMobile': return 'p-1.5';
      case 'largeMobile': return 'p-2';
      case 'extraLargeMobile': return 'p-2';
      default: return 'p-2.5';
    }
  };

  const getTextSizes = () => {
    switch (deviceCategory) {
      case 'smallMobile': return { 
        label: 'text-[10px] leading-tight', 
        value: 'text-xs font-bold leading-tight' 
      };
      case 'standardMobile': return { 
        label: 'text-xs leading-tight', 
        value: 'text-sm font-bold leading-tight' 
      };
      default: return { 
        label: 'text-xs leading-tight', 
        value: 'text-sm font-bold leading-tight' 
      };
    }
  };

  const getButtonHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-8';
      case 'standardMobile': return 'h-9';
      case 'largeMobile': return 'h-10';
      default: return 'h-11';
    }
  };

  const textSizes = getTextSizes();

  return (
    <div className="bg-card/98 backdrop-blur-xl border-t border-border px-2 py-1.5">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {/* Responsive Grid Layout */}
          {deviceCategory === 'smallMobile' ? (
            // 2x2 layout for small mobile to prevent truncation
            <div className="space-y-1.5 mb-2">
              <div className="grid grid-cols-2 gap-1.5">
                <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
                  <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Total</div>
                  <div className={`${textSizes.value} truncate text-foreground`}>
                    AED {(totalPrice / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
                  <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Monthly</div>
                  <div className={`${textSizes.value} truncate text-foreground`}>
                    AED {(monthlyPayment / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className={`bg-muted/30 rounded-lg ${getCardPadding()} text-center`}>
                  <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Reserve</div>
                  <div className={`${textSizes.value} truncate text-foreground`}>
                    AED {reserveAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 3-column layout for larger screens
            <div className={`grid ${getGridLayout()} gap-1.5 text-center mb-2`}>
              <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
                <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Total Price</div>
                <div className={`${textSizes.value} truncate text-foreground`}>
                  AED {totalPrice.toLocaleString()}
                </div>
              </div>
              <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
                <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Monthly</div>
                <div className={`${textSizes.value} truncate text-foreground`}>
                  AED {monthlyPayment.toLocaleString()}
                </div>
              </div>
              <div className={`bg-muted/30 rounded-lg ${getCardPadding()}`}>
                <div className={`${textSizes.label} text-muted-foreground mb-0.5`}>Reserve</div>
                <div className={`${textSizes.value} truncate text-foreground`}>
                  AED {reserveAmount.toLocaleString()}
                </div>
              </div>
            </div>
          )}
          
          {showPaymentButton && step === 4 && (
            <Button className={`w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-lg ${getButtonHeight()} ${textSizes.value}`}>
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
