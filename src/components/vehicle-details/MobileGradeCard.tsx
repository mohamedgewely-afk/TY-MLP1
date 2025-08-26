
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
          {/* Enhanced Image Section with Parallax Effect */}
          <div className="relative overflow-hidden">
            <Badge className={`absolute top-4 left-4 z-10 ${grade.badgeColor} text-white px-3 py-2 text-sm font-medium shadow-lg backdrop-blur-sm`}>
              {grade.badge}
            </Badge>
            
            {/* Grade Info Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, ...springConfigs.luxurious }}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-2 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1"
            >
              <Info className="h-3 w-3" />
              Premium Grade
            </motion.div>

            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={springConfigs.cinematic}
              whileHover={{ scale: 1.02 }}
              src={grade.image}
              alt={grade.name}
              className="w-full h-56 sm:h-64 object-cover"
            />
            
            {/* Gradient Overlay for Better Text Readability */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Enhanced Content Section */}
          <div className="p-4 sm:p-6 space-y-5">
            {/* Header with Enhanced Styling */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...springConfigs.luxurious }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary-foreground fill-current" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black">{grade.name}</h4>
                  <p className="text-xs text-muted-foreground">{grade.specs.engine}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{grade.description}</p>
              
              {/* Enhanced Pricing Display */}
              <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-4 rounded-xl space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-primary">
                    AED {grade.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  From <span className="font-semibold text-foreground">AED {grade.monthlyFrom}/month</span> with financing
                </div>
              </div>
            </motion.div>

            {/* Enhanced Key Features with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springConfigs.luxurious }}
            >
              <h5 className="font-bold mb-4 text-sm flex items-center gap-2">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                Key Features
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {grade.features.map((feature, index) => (
                  <motion.div 
                    key={feature} 
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, ...springConfigs.snappy }}
                    whileHover={{ x: 4, transition: springConfigs.snappy }}
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
                {grade.features.length > 4 && (
                  <motion.div 
                    className="text-xs text-muted-foreground mt-2 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Info className="h-3 w-3" />
                    +{grade.features.length - 4} more premium features included
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Action Buttons with Better UX */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ...springConfigs.luxurious }}
              className="space-y-4 pt-2"
            >
              {/* Primary Action with Gradient */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={springConfigs.snappy}
              >
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground min-h-[52px] font-semibold shadow-lg"
                  onClick={() => handleButtonClick(onSelect, 'configComplete')}
                >
                  Select This Grade
                </Button>
              </motion.div>
              
              {/* Secondary Actions with Enhanced Design */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springConfigs.snappy}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="gap-2 min-h-[48px] w-full font-medium border-2 hover:border-primary hover:text-primary"
                    onClick={() => handleButtonClick(onTestDrive)}
                  >
                    <Car className="h-4 w-4" />
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
                    className="gap-2 min-h-[48px] w-full font-medium border-2 hover:border-primary hover:text-primary"
                    onClick={() => handleButtonClick(onConfigure)}
                  >
                    <Wrench className="h-4 w-4" />
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
