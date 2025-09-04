
import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, AlertTriangle, Car, Zap, Gauge, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import CollapsibleContent from "@/components/ui/collapsible-content";
import InteractiveDemo from "./shared/InteractiveDemo";

interface SafetySuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
}

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const safetyFeatures = [
    {
      icon: Eye,
      name: "Pre-Collision System",
      description: "Helps detect vehicles and pedestrians ahead and can automatically apply brakes",
      details: "Uses camera and radar to monitor the road ahead, providing alerts and automatic emergency braking when potential collisions are detected.",
      active: true
    },
    {
      icon: AlertTriangle,
      name: "Lane Departure Alert",
      description: "Warns when you drift out of your lane without signaling",
      details: "Camera-based system that monitors lane markings and provides visual and audible alerts to help keep you in your lane.",
      active: true
    },
    {
      icon: Car,
      name: "Dynamic Radar Cruise Control",
      description: "Maintains set speed and following distance automatically",
      details: "Adaptive system that adjusts your speed based on traffic conditions while maintaining a safe following distance.",
      active: false
    },
    {
      icon: Zap,
      name: "Automatic High Beams",
      description: "Switches between high and low beams based on traffic",
      details: "Intelligent lighting system that automatically toggles high beams when no oncoming traffic is detected.",
      active: false
    }
  ];

  const additionalSafety = [
    {
      icon: Gauge,
      title: "Star Safety System",
      features: ["Vehicle Stability Control", "Traction Control", "Anti-lock Brakes", "Electronic Brake-force Distribution", "Brake Assist", "Smart Stop Technology"]
    },
    {
      icon: Users,
      title: "Airbag System",
      features: ["Driver & Front Passenger Advanced Airbags", "Driver & Front Passenger Seat-Mounted Side Airbags", "Rear Seat-Mounted Side Airbags", "Front & Rear Side Curtain Airbags"]
    },
    {
      icon: Heart,
      title: "Active Safety",
      features: ["Blind Spot Monitor", "Rear Cross-Traffic Alert", "Bird's Eye View Camera", "Parking Support Brake"]
    }
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Toyota Safety Sense 2.0
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base">
            Advanced safety features designed to help protect you and your passengers
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <Badge variant="secondary" className="text-sm font-semibold">
                  Standard on All Models
                </Badge>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3">Peace of Mind, Standard</h3>
              <p className="text-muted-foreground mb-6">
                Toyota Safety Sense 2.0 comes standard on every Camry, providing you with advanced safety 
                technologies that help protect what matters most.
              </p>
              
              <InteractiveDemo type="safety" />
            </motion.div>

            {/* Core Safety Features */}
            <div>
              <h3 className="text-xl font-bold mb-4">Core Safety Features</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {safetyFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      feature.active 
                        ? 'border-primary/20 bg-primary/5' 
                        : 'border-muted hover:border-muted-foreground/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        feature.active ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 leading-tight">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                        
                        <CollapsibleContent title="Learn More" className="mt-2 border-0">
                          <p className="text-sm text-muted-foreground">{feature.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Safety Systems */}
            <div>
              <h3 className="text-xl font-bold mb-4">Complete Safety Package</h3>
              <div className="space-y-4">
                {additionalSafety.map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-primary" />
                        <span>{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
            </div>

            {/* Safety Ratings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/30 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Safety Recognition</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5★</div>
                  <div className="font-semibold mb-1">NHTSA Overall Rating</div>
                  <div className="text-sm text-muted-foreground">National Highway Traffic Safety Administration</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">TSP+</div>
                  <div className="font-semibold mb-1">IIHS Top Safety Pick+</div>
                  <div className="text-sm text-muted-foreground">Insurance Institute for Highway Safety</div>
                </div>
              </div>
            </motion.div>
          </div>
        </MobileOptimizedDialogBody>

        <MobileOptimizedDialogFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={onClose} className="sm:w-auto">
              Close
            </Button>
            <Button onClick={onBookTestDrive} className="sm:w-auto">
              Experience Safety Features
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default SafetySuiteModal;
