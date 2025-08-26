
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, AlertTriangle, Car, TestTube, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ModalHeader from "./shared/ModalHeader";
import InteractiveDemo from "./shared/InteractiveDemo";
import AnimatedCounter from "@/components/ui/animated-counter";

interface SafetySuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}

const safetyFeatures = [
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Pre-Collision System",
    description: "Detects pedestrians, cyclists, and vehicles",
    rating: "5-Star NCAP"
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Lane Departure Alert",
    description: "Alerts when drifting without signaling",
    rating: "IIHS Top Pick"
  },
  {
    icon: <Car className="h-6 w-6" />,
    title: "Adaptive Cruise Control",
    description: "Maintains safe following distance",
    rating: "Superior Rated"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Blind Spot Monitor",
    description: "Alerts to vehicles in blind spots",
    rating: "5-Star Overall"
  }
];

const demoSteps = [
  {
    id: "precollision",
    title: "Pre-Collision Detection",
    description: "Advanced sensors detect potential collisions and apply brakes automatically",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "lanekeeping",
    title: "Lane Keeping Assist",
    description: "Gentle steering correction keeps you centered in your lane",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "adaptivecruise",
    title: "Adaptive Cruise Control",
    description: "Automatically adjusts speed to maintain safe following distance",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
  }
];

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const isMobile = useIsMobile();
  const [activeFeature, setActiveFeature] = useState(0);

  const DialogComponent = isMobile ? MobileDialog : Dialog;
  const DialogContentComponent = isMobile ? MobileDialogContent : DialogContent;

  return (
    <DialogComponent open={isOpen} onOpenChange={onClose}>
      <DialogContentComponent className={isMobile ? "" : "max-w-6xl max-h-[90vh] p-0"}>
        <ModalHeader
          title="Toyota Safety Sense 3.0"
          subtitle="Advanced safety features that protect what matters most"
          onClose={onClose}
        />
        
        <div className="overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Hero Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 bg-muted/30 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  <AnimatedCounter value={5} duration={2} />
                </div>
                <div className="text-sm text-muted-foreground">NCAP Stars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  <AnimatedCounter value={95} duration={2} />%
                </div>
                <div className="text-sm text-muted-foreground">Accident Prevention</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  <AnimatedCounter value={12} duration={2} />
                </div>
                <div className="text-sm text-muted-foreground">Safety Features</div>
              </div>
            </motion.div>

            {/* Interactive Demo */}
            <InteractiveDemo
              title="Safety in Action"
              description="See how Toyota Safety Sense 3.0 protects you on the road"
              demoSteps={demoSteps}
              autoPlay={true}
            />

            {/* Safety Features Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Safety Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {safetyFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeFeature === index ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeFeature === index ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {feature.rating}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TestTube className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Safety Test Results</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">IIHS Awards</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Top Safety Pick+
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Superior Front Crash Prevention
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">NHTSA Rating</h4>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">Overall 5-Star</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={onBookTestDrive}
              >
                Experience Safety Features
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={onClose}
              >
                Learn More Online
              </Button>
            </div>
          </div>
        </div>
      </DialogContentComponent>
    </DialogComponent>
  );
};

export default SafetySuiteModal;
