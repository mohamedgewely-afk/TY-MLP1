
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Car, Wrench, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { contextualHaptic } from "@/utils/haptic";
import { springConfigs } from "@/utils/animation-configs";

interface Grade {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface MobileGradeCardProps {
  grade: Grade;
  isActive?: boolean;
  onSelect: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

const MobileGradeCard: React.FC<MobileGradeCardProps> = ({
  grade,
  isActive = false,
  onSelect,
  onTestDrive,
  onConfigure
}) => {
  const isMobile = useIsMobile();

  const handleButtonClick = (action: () => void, hapticType: 'buttonPress' | 'configComplete' = 'buttonPress') => {
    contextualHaptic[hapticType]();
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={springConfigs.luxurious}
      className="w-full"
    >
      <Card className={`overflow-hidden shadow-xl ${isActive ? 'ring-2 ring-primary shadow-2xl' : 'border-border'}`}>
        <CardContent className="p-0">
          {/* Enhanced Image Section - Reduced height for mobile */}
          <div className="relative overflow-hidden">
            <Badge className={`absolute top-3 left-3 z-10 ${grade.badgeColor} text-white px-2 py-1 text-xs font-medium shadow-lg backdrop-blur-sm`}>
              {grade.badge}
            </Badge>
            
            {/* Grade Info Badge - Smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, ...springConfigs.luxurious }}
              className="absolute top-3 right-3 z-10 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1"
            >
              <Info className="h-2 w-2" />
              Premium
            </motion.div>

            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={springConfigs.cinematic}
              whileHover={{ scale: 1.02 }}
              src={grade.image}
              alt={grade.name}
              className="w-full h-32 sm:h-48 object-cover" // Reduced from h-56 to h-32
            />
            
            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Enhanced Content Section - Compact spacing */}
          <div className="p-3 sm:p-6 space-y-3 sm:space-y-5"> {/* Reduced padding and spacing */}
            {/* Header with Enhanced Styling - Smaller text on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...springConfigs.luxurious }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 sm:h-5 sm:w-5 text-primary-foreground fill-current" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-2xl font-black">{grade.name}</h4> {/* Reduced from text-xl */}
                  <p className="text-xs text-muted-foreground">{grade.specs.engine}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{grade.description}</p>
              
              {/* Enhanced Pricing Display - Smaller on mobile */}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 rounded-xl space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-black text-primary"> {/* Reduced from text-3xl */}
                    AED {grade.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  From <span className="font-semibold text-foreground">AED {grade.monthlyFrom}/month</span> with financing
                </div>
              </div>
            </motion.div>

            {/* Enhanced Key Features - Limited to 3 on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springConfigs.luxurious }}
            >
              <h5 className="font-bold mb-3 text-sm flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="h-2 w-2 text-primary" />
                </div>
                Key Features
              </h5>
              <div className="grid grid-cols-1 gap-2">
                {grade.features.slice(0, isMobile ? 3 : 4).map((feature, index) => (
                  <motion.div 
                    key={feature} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, ...springConfigs.snappy }}
                    whileHover={{ x: 4, transition: springConfigs.snappy }}
                  >
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="h-2 w-2 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
                {grade.features.length > (isMobile ? 3 : 4) && (
                  <motion.div 
                    className="text-xs text-muted-foreground mt-1 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Info className="h-3 w-3" />
                    +{grade.features.length - (isMobile ? 3 : 4)} more features included
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Action Buttons - Compact on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...springConfigs.luxurious }}
              className="space-y-3 pt-2"
            >
              {/* Primary Action - Smaller height on mobile */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springConfigs.snappy}
              >
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground min-h-[44px] sm:min-h-[52px] font-semibold shadow-lg" // Reduced mobile height
                  onClick={() => handleButtonClick(onSelect, 'configComplete')}
                >
                  Select This Grade
                </Button>
              </motion.div>
              
              {/* Secondary Actions - Smaller on mobile */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springConfigs.snappy}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 min-h-[40px] sm:min-h-[48px] w-full font-medium border-2 hover:border-primary hover:text-primary" // Reduced mobile height
                    onClick={() => handleButtonClick(onTestDrive)}
                  >
                    <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                    {isMobile ? "Drive" : "Test Drive"}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springConfigs.snappy}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 min-h-[40px] sm:min-h-[48px] w-full font-medium border-2 hover:border-primary hover:text-primary" // Reduced mobile height
                    onClick={() => handleButtonClick(onConfigure)}
                  >
                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
                    {isMobile ? "Build" : "Configure"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileGradeCard;
