
import React from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown } from "lucide-react";

interface GradeCarouselStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = [
  { 
    name: "Base", 
    description: "Essential features for everyday driving",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 89,000",
    monthlyEMI: "1,850",
    features: ["Manual A/C", "6 Speakers", "Basic Interior"],
    icon: Shield,
    badge: "Value",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  { 
    name: "SE", 
    description: "Sport edition with enhanced performance",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    price: "From AED 95,000",
    monthlyEMI: "1,980",
    features: ["Sport Seats", "8-inch Display", "Rear Camera"],
    icon: Zap,
    badge: "Sport",
    badgeColor: "bg-red-50 text-red-700 border-red-200"
  },
  { 
    name: "XLE", 
    description: "Premium comfort and convenience",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
    price: "From AED 110,000",
    monthlyEMI: "2,290",
    features: ["Leather Trim", "Premium Audio", "Auto Climate"],
    icon: Star,
    badge: "Most Popular",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200"
  },
  { 
    name: "Limited", 
    description: "Luxury features and premium materials",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 125,000",
    monthlyEMI: "2,600",
    features: ["Premium Leather", "9-inch Touch", "Heated Seats"],
    icon: Crown,
    badge: "Luxury",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
  }
];

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-4 space-y-4">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-2">
          Select Your Grade
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the perfect combination of features and luxury
        </p>
      </motion.div>
      
      <div className="space-y-4">
        {grades.map((grade, index) => {
          const IconComponent = grade.icon;
          const isSelected = config.grade === grade.name;
          
          return (
            <motion.div
              key={grade.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-lg ${
                isSelected 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-primary/20 scale-[1.02]' 
                  : 'bg-card/95 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-xl hover:scale-[1.01]'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, grade: grade.name }))}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-4 right-4 z-20"
                >
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                    <Check className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
              
              <div className="relative z-10 flex items-center p-4">
                {/* Grade Image */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border/50 bg-muted/50">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                {/* Grade Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{grade.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${grade.badgeColor}`}>
                        {grade.badge}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3">{grade.description}</p>
                  
                  {/* Features - Fixed to prevent horizontal scroll */}
                  <div className="grid grid-cols-1 gap-1 mb-3">
                    {grade.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/30"
                      >
                        • {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-foreground">{grade.price}</div>
                      <div className="text-xs text-muted-foreground">AED {grade.monthlyEMI}/month</div>
                    </div>
                    
                    {/* Selection indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary border-primary shadow-md' 
                        : 'border-border bg-background hover:border-primary/50'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeCarouselStep;
