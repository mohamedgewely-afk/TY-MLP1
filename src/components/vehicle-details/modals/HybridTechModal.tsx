
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Battery, Zap, Gauge, TreePine, Fuel } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ModalHeader from "./shared/ModalHeader";
import InteractiveDemo from "./shared/InteractiveDemo";
import AnimatedCounter from "@/components/ui/animated-counter";

interface HybridTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}

const hybridModes = [
  {
    name: "EV Mode",
    icon: <Battery className="h-6 w-6" />,
    description: "Pure electric driving for quiet city cruising",
    efficiency: "0 L/100km",
    range: "2-3 km"
  },
  {
    name: "Hybrid Mode",
    icon: <Zap className="h-6 w-6" />,
    description: "Optimal balance of power and efficiency",
    efficiency: "4.5 L/100km",
    range: "1000+ km"
  },
  {
    name: "Power Mode",
    icon: <Gauge className="h-6 w-6" />,
    description: "Maximum performance for highway driving",
    efficiency: "5.2 L/100km",
    range: "900+ km"
  }
];

const demoSteps = [
  {
    id: "system",
    title: "Hybrid System Overview",
    description: "See how the engine and electric motor work together seamlessly",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "regeneration",
    title: "Regenerative Braking",
    description: "Energy recovery system charges the battery while braking",
    image: "https://images.unsplash.com/photo-1609501676725-7186f76444f8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "efficiency",
    title: "Efficiency Optimization",
    description: "Smart system automatically chooses the most efficient power source",
    image: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=80"
  }
];

const HybridTechModal: React.FC<HybridTechModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const isMobile = useIsMobile();
  const [activeMode, setActiveMode] = useState(0);

  const DialogComponent = isMobile ? MobileDialog : Dialog;
  const DialogContentComponent = isMobile ? MobileDialogContent : DialogContent;

  return (
    <DialogComponent open={isOpen} onOpenChange={onClose}>
      <DialogContentComponent className={isMobile ? "" : "max-w-6xl max-h-[90vh] p-0"}>
        <ModalHeader
          title="Hybrid Technology"
          subtitle="Advanced hybrid powertrain for efficiency and performance"
          onClose={onClose}
        />
        
        <div className="overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Efficiency Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  <AnimatedCounter value={4.5} decimals={1} duration={2} />L
                </div>
                <div className="text-sm text-muted-foreground">Fuel Consumption</div>
                <div className="text-xs text-muted-foreground">per 100km</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  <AnimatedCounter value={218} duration={2} />HP
                </div>
                <div className="text-sm text-muted-foreground">Total Power</div>
                <div className="text-xs text-muted-foreground">Combined Output</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  <AnimatedCounter value={40} duration={2} />%
                </div>
                <div className="text-sm text-muted-foreground">CO₂ Reduction</div>
                <div className="text-xs text-muted-foreground">vs Conventional</div>
              </div>
            </motion.div>

            {/* Interactive Demo */}
            <InteractiveDemo
              title="Hybrid System in Action"
              description="Watch how the hybrid powertrain adapts to different driving conditions"
              demoSteps={demoSteps}
              autoPlay={true}
            />

            {/* Driving Modes */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Driving Modes</h3>
              <div className="grid gap-4">
                {hybridModes.map((mode, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeMode === index ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setActiveMode(index)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activeMode === index ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {mode.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{mode.name}</h4>
                          <p className="text-sm text-muted-foreground">{mode.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{mode.efficiency}</div>
                        <div className="text-xs text-muted-foreground">{mode.range} range</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TreePine className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold">Environmental Benefits</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <span>40% lower CO₂ emissions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-green-600" />
                    <span>Superior fuel economy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Battery className="h-5 w-5 text-green-600" />
                    <span>Zero emissions in EV mode</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold mb-2">Annual Savings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fuel Cost Savings</span>
                      <span className="font-semibold">AED 2,400/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Reduction</span>
                      <span className="font-semibold">1.2 tons/year</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Explained */}
            <div className="bg-muted/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Electric Motor</h4>
                  <p className="text-sm text-muted-foreground">Provides instant torque and silent operation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Battery className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Hybrid Battery</h4>
                  <p className="text-sm text-muted-foreground">Stores energy from regenerative braking</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gauge className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Engine</h4>
                  <p className="text-sm text-muted-foreground">Efficient gasoline engine for long-range driving</p>
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
                Experience Hybrid Efficiency
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={onClose}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </DialogContentComponent>
    </DialogComponent>
  );
};

export default HybridTechModal;
