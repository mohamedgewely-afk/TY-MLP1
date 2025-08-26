
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Car, Wrench } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className={`overflow-hidden ${isActive ? 'ring-2 ring-primary shadow-lg' : 'border-border'}`}>
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative">
            <Badge className={`absolute top-4 left-4 z-10 ${grade.badgeColor} text-white px-3 py-1 text-sm font-medium`}>
              {grade.badge}
            </Badge>
            <img
              src={grade.image}
              alt={grade.name}
              className="w-full h-48 sm:h-56 object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <h4 className="text-xl sm:text-2xl font-bold">{grade.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
              
              {/* Pricing */}
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black">AED {grade.price.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">From AED {grade.monthlyFrom}/month</div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h5 className="font-semibold mb-3 text-sm">Key Features</h5>
              <div className="grid grid-cols-1 gap-2">
                {grade.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {grade.features.length > 4 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    +{grade.features.length - 4} more features
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="space-y-3 pt-2">
              {/* Primary Action */}
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 min-h-[48px]"
                onClick={onSelect}
              >
                Select This Grade
              </Button>
              
              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 min-h-[48px]"
                  onClick={onTestDrive}
                >
                  <Car className="h-4 w-4" />
                  {isMobile ? "Drive" : "Test Drive"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 min-h-[48px]"
                  onClick={onConfigure}
                >
                  <Wrench className="h-4 w-4" />
                  {isMobile ? "Build" : "Configure"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileGradeCard;
