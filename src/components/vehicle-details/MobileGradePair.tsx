
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Car, Wrench } from "lucide-react";

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

interface MobileGradePairProps {
  grades: [Grade, Grade];
  selectedIndex: number;
  onSelectGrade: (index: number) => void;
  onTestDrive: (grade: Grade) => void;
  onConfigure: (grade: Grade) => void;
}

const MobileGradePair: React.FC<MobileGradePairProps> = ({
  grades,
  selectedIndex,
  onSelectGrade,
  onTestDrive,
  onConfigure
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3 px-4"
    >
      {grades.map((grade, index) => {
        const isActive = index === selectedIndex;
        
        return (
          <Card key={grade.name} className={`overflow-hidden ${isActive ? 'ring-2 ring-primary shadow-lg' : 'border-border'}`}>
            <CardContent className="p-0">
              {/* Image Section */}
              <div className="relative">
                <Badge className={`absolute top-2 left-2 z-10 ${grade.badgeColor} text-white px-2 py-1 text-xs font-medium`}>
                  {grade.badge}
                </Badge>
                <img
                  src={grade.image}
                  alt={grade.name}
                  className="w-full h-32 object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-3 space-y-3">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <h4 className="text-sm font-bold">{grade.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{grade.description}</p>
                  
                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="text-lg font-black">AED {grade.price.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">From AED {grade.monthlyFrom}/month</div>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <h5 className="font-semibold mb-2 text-xs">Key Features</h5>
                  <div className="space-y-1">
                    {grade.features.slice(0, 2).map((feature) => (
                      <div key={feature} className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="h-2 w-2 text-primary-foreground" />
                        </div>
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                    {grade.features.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{grade.features.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Button 
                    size="sm" 
                    className="w-full bg-primary hover:bg-primary/90 min-h-[40px] text-xs"
                    onClick={() => onSelectGrade(index)}
                  >
                    Select Grade
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 min-h-[36px] text-xs"
                      onClick={() => onTestDrive(grade)}
                    >
                      <Car className="h-3 w-3" />
                      Drive
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 min-h-[36px] text-xs"
                      onClick={() => onConfigure(grade)}
                    >
                      <Wrench className="h-3 w-3" />
                      Build
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </motion.div>
  );
};

export default MobileGradePair;
