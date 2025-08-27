
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCategoryProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  highlights: string[];
  benefits: string[];
  isPremium?: boolean;
  onExplore: () => void;
  index: number;
}

const FeatureCategory: React.FC<FeatureCategoryProps> = ({
  title,
  description,
  icon: Icon,
  image,
  highlights,
  benefits,
  isPremium,
  onExplore,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card h-full">
        {/* Image Section */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Icon and Premium Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Icon className="h-4 w-4 text-white" />
            </div>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-semibold">
                Premium
              </Badge>
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg md:text-xl mb-1">
              {title}
            </h3>
            <p className="text-white/90 text-sm line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Key Highlights */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Key Features
            </h4>
            <div className="grid grid-cols-1 gap-1">
              {highlights.slice(0, 3).map((highlight, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                  <span className="text-foreground/80">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Preview */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Benefits
            </h4>
            <div className="flex flex-wrap gap-1">
              {benefits.slice(0, 3).map((benefit, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onExplore}
            className="w-full mt-4 group/btn"
          >
            <span>Explore {title}</span>
            <motion.div
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeatureCategory;
