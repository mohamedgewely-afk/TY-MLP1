
import React from "react";
import { motion } from "framer-motion";
import { Car, Thermometer, Volume2, Smartphone, Armchair, Sun, Wind, Coffee } from "lucide-react";
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

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
}

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const comfortFeatures = [
    {
      icon: Armchair,
      name: "Premium Seating",
      description: "Ergonomically designed seats with multiple adjustment options",
      details: "8-way power-adjustable driver seat with lumbar support, heated and ventilated front seats, and premium leather-appointed surfaces for ultimate comfort.",
      specs: ["8-way Power Adjustment", "Lumbar Support", "Heated & Ventilated", "Memory Settings"]
    },
    {
      icon: Thermometer,
      name: "Dual-Zone Climate Control",
      description: "Independent temperature control for driver and passenger",
      details: "Advanced automatic climate control system with individual temperature settings, air quality sensor, and pollen filter for optimal cabin comfort.",
      specs: ["Auto Climate", "Air Quality Sensor", "Pollen Filter", "Individual Controls"]
    },
    {
      icon: Volume2,
      name: "JBL Premium Audio",
      description: "Concert-quality sound system with spatial audio",
      details: "9-speaker JBL premium audio system with Clari-Fi technology that restores audio clarity to compressed music files.",
      specs: ["9 Speakers", "Clari-Fi Technology", "Spatial Audio", "Premium Acoustics"]
    },
    {
      icon: Sun,
      name: "Panoramic Sunroof",
      description: "Expansive glass roof with power tilt and slide",
      details: "Large panoramic moonroof with one-touch open/close, tilt feature, and sliding sunshade for customizable natural light and ventilation.",
      specs: ["One-touch Operation", "Tilt Feature", "Sliding Sunshade", "Wind Deflector"]
    }
  ];

  const convenienceFeatures = [
    {
      icon: Smartphone,
      title: "Technology Integration",
      features: ["Wireless Phone Charging", "Multiple USB Ports", "12V Power Outlets", "Smart Device Integration"]
    },
    {
      icon: Coffee,
      title: "Storage & Convenience",
      features: ["Cup Holders with Adjustable Arms", "Center Console Storage", "Door Panel Storage", "Seatback Pockets"]
    },
    {
      icon: Wind,
      title: "Air Quality",
      features: ["Cabin Air Filter", "Fresh Air Mode", "Recirculation Control", "Allergen Reduction"]
    },
    {
      icon: Car,
      title: "Interior Lighting",
      features: ["LED Interior Lighting", "Ambient Lighting", "Reading Lights", "Illuminated Entry"]
    }
  ];

  const materialFinishes = [
    {
      name: "SofTex® Seating",
      description: "Premium synthetic leather that's durable and easy to maintain",
      benefits: ["Weather Resistant", "Easy to Clean", "Soft Touch", "Eco-Friendly"]
    },
    {
      name: "Piano Black Trim",
      description: "Elegant high-gloss finish for a sophisticated appearance",
      benefits: ["Premium Look", "Scratch Resistant", "Easy Maintenance", "Refined Style"]
    },
    {
      name: "Metallic Accents",
      description: "Brushed aluminum and chrome details throughout the cabin",
      benefits: ["Modern Design", "Quality Feel", "Corrosion Resistant", "Luxury Appeal"]
    }
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Interior Experience
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base">
            Discover the comfort, technology, and craftsmanship of the Camry interior
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-8 w-8 text-amber-500" />
                <Badge variant="secondary" className="text-sm font-semibold bg-amber-100 text-amber-700">
                  Premium Comfort
                </Badge>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3">Crafted for Comfort</h3>
              <p className="text-muted-foreground mb-6">
                Step into a cabin designed around you, featuring premium materials, advanced technology, 
                and thoughtful amenities that make every drive extraordinary.
              </p>
              
              {/* Space Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">100.4</div>
                  <div className="text-xs text-muted-foreground">cu ft Interior</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">42.1</div>
                  <div className="text-xs text-muted-foreground">Front Legroom</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">38.0</div>
                  <div className="text-xs text-muted-foreground">Rear Legroom</div>
                </div>
              </div>
              
              <InteractiveDemo type="interior" />
            </motion.div>

            {/* Comfort Features */}
            <div>
              <h3 className="text-xl font-bold mb-4">Comfort & Technology Features</h3>
              <div className="space-y-4">
                {comfortFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border hover:border-amber-200 transition-all duration-300 hover:bg-amber-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 leading-tight">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                        
                        <CollapsibleContent title="Feature Details" className="border-0">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{feature.details}</p>
                            <div>
                              <h5 className="font-medium mb-2 text-sm">Key Features:</h5>
                              <div className="grid gap-1 sm:grid-cols-2">
                                {feature.specs.map((spec, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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

            {/* Convenience Features */}
            <div>
              <h3 className="text-xl font-bold mb-4">Convenience & Storage</h3>
              <div className="space-y-4">
                {convenienceFeatures.map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-amber-500" />
                        <span>{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
            </div>

            {/* Materials & Finishes */}
            <div>
              <h3 className="text-xl font-bold mb-4">Premium Materials & Finishes</h3>
              <div className="space-y-4">
                {materialFinishes.map((material, index) => (
                  <motion.div
                    key={material.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100"
                  >
                    <h4 className="font-semibold text-amber-900 mb-2">{material.name}</h4>
                    <p className="text-sm text-amber-800 mb-3">{material.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {material.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dimensions & Space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100"
            >
              <h3 className="text-xl font-bold mb-4 text-amber-900">Interior Dimensions</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700">100.4</div>
                  <div className="text-sm text-amber-600">Passenger Volume (cu ft)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700">15.1</div>
                  <div className="text-sm text-amber-600">Trunk Space (cu ft)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700">57.1</div>
                  <div className="text-sm text-amber-600">Shoulder Room Front (in)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700">38.9</div>
                  <div className="text-sm text-amber-600">Headroom Front (in)</div>
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
              Experience Interior
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default InteriorExperienceModal;
