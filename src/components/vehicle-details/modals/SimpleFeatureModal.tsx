
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";

interface FeatureDetail {
  title: string;
  description: string;
  image: string;
  specs: string[];
  benefits: string[];
}

interface SimpleFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  title: string;
  description: string;
  category: string;
  features: FeatureDetail[];
}

const SimpleFeatureModal: React.FC<SimpleFeatureModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  title,
  description,
  category,
  features
}) => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = React.useState(0);
  
  const nextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeatureIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const currentFeature = features[currentFeatureIndex];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{category}</Badge>
              </div>
              <MobileOptimizedDialogTitle className="text-xl lg:text-2xl font-bold">
                {title}
              </MobileOptimizedDialogTitle>
              <MobileOptimizedDialogDescription className="text-base">
                {description}
              </MobileOptimizedDialogDescription>
            </div>
          </div>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Feature Navigation */}
            {features.length > 1 && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevFeature}
                  disabled={features.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentFeatureIndex + 1} of {features.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextFeature}
                  disabled={features.length <= 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Current Feature */}
            <motion.div
              key={currentFeatureIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Image */}
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img
                    src={currentFeature.image}
                    alt={currentFeature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">{currentFeature.title}</h3>
                  <p className="text-muted-foreground">{currentFeature.description}</p>
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <div className="space-y-1">
                    {currentFeature.specs.map((spec, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentFeature.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Dots */}
            {features.length > 1 && (
              <div className="flex justify-center gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatureIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentFeatureIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </MobileOptimizedDialogBody>

        <MobileOptimizedDialogFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={onClose} className="sm:w-auto">
              Close
            </Button>
            <Button onClick={onBookTestDrive} className="sm:w-auto">
              Experience This Feature
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default SimpleFeatureModal;
