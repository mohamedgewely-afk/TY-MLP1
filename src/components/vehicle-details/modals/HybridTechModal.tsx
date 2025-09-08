import React from "react";
import { motion } from "framer-motion";
import { Battery, Zap, Gauge, Leaf, Car, RotateCcw, TrendingUp, Award } from "lucide-react";
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

interface HybridTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
}

const HybridTechModal: React.FC<HybridTechModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const hybridComponents = [
    {
      icon: Car,
      name: "2.5L 4-Cylinder Engine",
      description: "Efficient gasoline engine optimized for hybrid operation",
      details: "Atkinson cycle engine designed for maximum fuel efficiency while maintaining performance. Features direct injection and variable valve timing.",
      specs: ["176 HP", "Atkinson Cycle", "Direct Injection", "VVT-i Technology"]
    },
    {
      icon: Zap,
      name: "Electric Motor System",
      description: "Powerful electric motors for instant torque and efficiency",
      details: "Dual electric motor setup provides immediate power delivery and regenerative braking capabilities for enhanced efficiency.",
      specs: ["118 HP Combined", "Instant Torque", "Regenerative Braking", "Silent Operation"]
    },
    {
      icon: Battery,
      name: "Hybrid Battery Pack",
      description: "Advanced lithium-ion battery system",
      details: "Compact, lightweight lithium-ion battery pack positioned for optimal weight distribution and maximum cabin space.",
      specs: ["Lithium-ion", "8-Year Warranty", "Minimal Maintenance", "Compact Design"]
    },
    {
      icon: RotateCcw,
      name: "Power Control Unit",
      description: "Intelligent system that manages power flow",
      details: "Sophisticated computer system that seamlessly switches between gasoline and electric power for optimal efficiency and performance.",
      specs: ["Seamless Switching", "Smart Management", "Real-time Optimization", "Predictive Logic"]
    }
  ];

  const drivingModes = [
    {
      icon: Leaf,
      title: "EV Mode",
      description: "Pure electric driving for short distances",
      features: ["Silent Operation", "Zero Emissions", "City Driving", "Parking Lots"]
    },
    {
      icon: TrendingUp,
      title: "Eco Mode",
      description: "Maximum fuel efficiency optimization",
      features: ["Extended Range", "Gentle Acceleration", "Climate Optimization", "Efficiency Coaching"]
    },
    {
      icon: Gauge,
      title: "Normal Mode",
      description: "Balanced performance and efficiency",
      features: ["Everyday Driving", "Smooth Power", "Automatic Switching", "Optimal Balance"]
    },
    {
      icon: Zap,
      title: "Sport Mode",
      description: "Enhanced performance and responsiveness",
      features: ["Quick Acceleration", "Responsive Handling", "Performance Focus", "Dynamic Feel"]
    }
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Hybrid Synergy Drive®
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base">
            Advanced hybrid technology delivering exceptional fuel efficiency and performance
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Battery className="h-8 w-8 text-green-500" />
                <Badge variant="secondary" className="text-sm font-semibold bg-green-100 text-green-700">
                  25+ Years of Innovation
                </Badge>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3">The Future of Efficiency</h3>
              <p className="text-muted-foreground mb-6">
                Experience Toyota's proven hybrid technology that seamlessly combines gasoline and 
                electric power for exceptional fuel economy without compromise.
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">52</div>
                  <div className="text-xs text-muted-foreground">City MPG</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">208</div>
                  <div className="text-xs text-muted-foreground">Total HP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">AT-PZEV</div>
                  <div className="text-xs text-muted-foreground">Emissions</div>
                </div>
              </div>
              
              <InteractiveDemo type="hybrid" />
            </motion.div>

            {/* Hybrid Components */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hybrid System Components</h3>
              <div className="space-y-4">
                {hybridComponents.map((component, index) => (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border hover:border-green-200 transition-all duration-300 hover:bg-green-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-50 text-green-600">
                        <component.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 leading-tight">{component.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{component.description}</p>
                        
                        <CollapsibleContent title="Technical Specifications" className="border-0">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{component.details}</p>
                            <div>
                              <h5 className="font-medium mb-2 text-sm">Key Specifications:</h5>
                              <div className="grid gap-1 sm:grid-cols-2">
                                {component.specs.map((spec, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-xs">{spec}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Driving Modes */}
            <div>
              <h3 className="text-xl font-bold mb-4">Intelligent Driving Modes</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {drivingModes.map((mode, index) => (
                  <motion.div
                    key={mode.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-green-200 bg-green-50/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <mode.icon className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">{mode.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{mode.description}</p>
                    <div className="space-y-1">
                      {mode.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-green-500" />
                          <span className="text-xs text-green-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">Environmental Benefits</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Reduced Emissions</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• AT-PZEV certified</li>
                    <li>• 70% fewer emissions than gas-only</li>
                    <li>• Cleaner air contribution</li>
                    <li>• Sustainable technology</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Fuel Savings</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Up to 52 MPG city rating</li>
                    <li>• Reduced fuel consumption</li>
                    <li>• Lower carbon footprint</li>
                    <li>• Long-term cost savings</li>
                  </ul>
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
              Experience Hybrid Drive
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default HybridTechModal;
