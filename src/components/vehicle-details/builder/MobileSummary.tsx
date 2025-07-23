
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
  const { containerPadding, buttonSize, textSize, touchTarget, mobileSpacing, responsiveText } = useResponsiveSize();
  const monthlyPayment = Math.round((totalPrice * 0.8 * 0.035) / 12);

  const getCardPadding = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'p-1.5';
      case 'standardMobile': return 'p-2';
      case 'largeMobile': return 'p-2.5';
      case 'extraLargeMobile': return 'p-3';
      default: return 'p-2';
    }
  };

  const getTextSizes = () => {
    switch (deviceCategory) {
      case 'smallMobile': return {
        label: 'text-xs',
        value: 'text-sm',
        button: 'text-xs'
      };
      case 'standardMobile': return {
        label: 'text-xs',
        value: 'text-sm',
        button: 'text-sm'
      };
      case 'largeMobile': return {
        label: 'text-sm',
        value: 'text-base',
        button: 'text-sm'
      };
      default: return {
        label: 'text-sm',
        value: 'text-base',
        button: 'text-sm'
      };
    }
  };

  const sizes = getTextSizes();

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-card/95 backdrop-blur-xl border-t border-border ${containerPadding}`}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className={`grid grid-cols-3 ${mobileSpacing.xs} text-center ${
            deviceCategory === 'smallMobile' ? 'mb-2' : 'mb-3'
          }`}>
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()} min-w-0`}>
              <div className={`${sizes.label} text-muted-foreground mb-1 ${responsiveText.truncate}`}>
                Total Price
              </div>
              <div className={`${sizes.value} font-bold ${responsiveText.truncate}`}>
                AED {totalPrice.toLocaleString()}
              </div>
            </div>
            
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()} min-w-0`}>
              <div className={`${sizes.label} text-muted-foreground mb-1 ${responsiveText.truncate}`}>
                Monthly
              </div>
              <div className={`${sizes.value} font-bold ${responsiveText.truncate}`}>
                AED {monthlyPayment.toLocaleString()}
              </div>
            </div>
            
            <div className={`bg-muted/50 rounded-lg ${getCardPadding()} min-w-0`}>
              <div className={`${sizes.label} text-muted-foreground mb-1 ${responsiveText.truncate}`}>
                Reserve
              </div>
              <div className={`${sizes.value} font-bold ${responsiveText.truncate}`}>
                AED {reserveAmount.toLocaleString()}
              </div>
            </div>
          </div>
          
          {showPaymentButton && step === 4 && (
            <Button className={`w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-lg ${touchTarget} ${buttonSize}`}>
              <CreditCard className={`mr-2 ${
                deviceCategory === 'smallMobile' ? 'h-3 w-3' : 
                deviceCategory === 'standardMobile' ? 'h-4 w-4' : 'h-4 w-4'
              }`} />
              <span className={`${sizes.button} ${responsiveText.truncate}`}>
                Reserve Now
              </span>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileSummary;
