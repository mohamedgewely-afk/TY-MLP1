
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
  showPaymentButton = false
}) => {
  const { containerPadding, buttonSize, textSize } = useResponsiveSize();
  const monthlyPayment = Math.round((totalPrice * 0.8 * 0.035) / 12);

  const getGridSpacing = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'gap-1.5';
      case 'standardMobile': return 'gap-2';
      case 'largeMobile': return 'gap-2';
      default: return 'gap-2';
    }
  };

  const getCardPadding = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'p-1.5';
      case 'standardMobile': return 'p-2';
      case 'largeMobile': return 'p-2';
      default: return 'p-2';
    }
  };

  const getButtonHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'min-h-[44px]';
      case 'standardMobile': return 'min-h-[48px]';
      case 'largeMobile': return 'min-h-[52px]';
      default: return 'min-h-[44px]';
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-card/95 backdrop-blur-xl border-t border-border ${containerPadding}`}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className={`grid grid-cols-3 ${getGridSpacing()} text-center ${deviceCategory === 'smallMobile' ? 'mb-2' : 'mb-3'}`}>
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSize.xs} text-muted-foreground mb-1`}>Total Price</div>
              <div className={`${textSize.sm} font-bold`}>AED {totalPrice.toLocaleString()}</div>
            </div>
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSize.xs} text-muted-foreground mb-1`}>Monthly</div>
              <div className={`${textSize.sm} font-bold`}>AED {monthlyPayment.toLocaleString()}</div>
            </div>
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()}`}>
              <div className={`${textSize.xs} text-muted-foreground mb-1`}>Reserve</div>
              <div className={`${textSize.sm} font-bold`}>AED {reserveAmount.toLocaleString()}</div>
            </div>
          </div>
          
          {showPaymentButton && (
            <Button className={`w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-lg ${getButtonHeight()} ${buttonSize}`}>
              <CreditCard className={`mr-2 ${deviceCategory === 'smallMobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={textSize.sm}>Reserve Now</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileSummary;
