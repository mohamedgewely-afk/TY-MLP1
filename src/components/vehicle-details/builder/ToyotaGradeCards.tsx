
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap, Car, Crown } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ToyotaGradeCardsProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const ToyotaGradeCards: React.FC<ToyotaGradeCardsProps> = ({ config, setConfig }) => {
  const getGradeImage = (grade: string) => {
    const gradeImages = {
      "Base": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-base-grade.jpg",
      "SE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-se-grade.jpg",
      "XLE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-xle-grade.jpg",
      "Limited": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-limited-grade.jpg"
    };
    return gradeImages[grade as keyof typeof gradeImages] || gradeImages["Base"];
  };

  const grades = [
    {
      name: "Base",
      price: 0,
      icon: <Car className="h-5 w-5" />,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-700",
      features: ["17-inch Alloy Wheels", "Toyota Safety Sense", "8-inch Display"],
      description: "Essential features with Toyota quality"
    },
    {
      name: "SE",
      price: 2000,
      icon: <Zap className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      features: ["Sport Suspension", "Paddle Shifters", "Sport Seats"],
      description: "Enhanced performance and sportiness"
    },
    {
      name: "XLE",
      price: 4000,
      icon: <Star className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      features: ["Leather Seats", "Moonroof", "Premium Audio"],
      description: "Comfort and luxury features"
    },
    {
      name: "Limited",
      price: 6000,
      icon: <Crown className="h-5 w-5" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      features: ["Advanced Safety", "Premium Interior", "Navigation"],
      description: "Top-tier luxury and technology"
    }
  ];

  return (
    <div className="space-y-4 toyota-spacing-md">
      <h3 className="text-xl font-semibold text-center text-foreground">
        Select Your Grade
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grades.map((grade, index) => (
          <motion.button
            key={grade.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
            onClick={() => setConfig(prev => ({ ...prev, grade: grade.name }))}
            className="w-full text-left"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`h-full transition-all duration-200 border-2 ${
                config.grade === grade.name
                  ? 'border-toyota-red toyota-shadow-md'
                  : `${grade.borderColor} hover:border-toyota-red/30`
              }`}
            >
              <CardContent className="toyota-spacing-md">
                {/* Grade Image */}
                <div className="flex justify-center mb-4">
                  <img 
                    src={getGradeImage(grade.name)}
                    alt={grade.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div className={`${grade.bgColor} toyota-spacing-sm toyota-border-radius mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`toyota-spacing-sm toyota-border-radius ${
                        config.grade === grade.name ? 'bg-toyota-red text-white' : 'bg-gray-100'
                      }`}>
                        {grade.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${config.grade === grade.name ? 'text-toyota-red' : 'text-foreground'}`}>
                          {grade.name}
                        </h4>
                        {grade.price > 0 && (
                          <p className="text-sm text-muted-foreground">
                            +AED {grade.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={`${grade.bgColor} ${grade.textColor} ${grade.borderColor}`}>
                      {grade.name}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {grade.description}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Key Features:</p>
                  {grade.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 toyota-border-radius bg-toyota-red"></div>
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ToyotaGradeCards;
