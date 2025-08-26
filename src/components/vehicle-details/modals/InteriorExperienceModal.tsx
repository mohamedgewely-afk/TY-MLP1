
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Thermometer, Music, Smartphone, Palette, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ModalHeader from "./shared/ModalHeader";

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}

const interiorFeatures = [
  {
    icon: <Thermometer className="h-6 w-6" />,
    title: "Dual-Zone Climate Control",
    description: "Individual temperature settings for driver and passenger",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=600&q=80"
  },
  {
    icon: <Music className="h-6 w-6" />,
    title: "Premium Audio System",
    description: "JBL premium sound with 9 speakers",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Wireless Charging Pad",
    description: "Convenient wireless charging for compatible devices",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Power Moonroof",
    description: "Tilt and slide moonroof with one-touch operation",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80"
  }
];

const colorOptions = [
  { name: "Black Leather", color: "#1a1a1a", premium: true },
  { name: "Beige Leather", color: "#d4c4a0", premium: true },
  { name: "Gray Fabric", color: "#6b7280", premium: false }
];

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const isMobile = useIsMobile();
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [viewMode, setViewMode] = useState<'features' | 'customization'>('features');

  const DialogComponent = isMobile ? MobileDialog : Dialog;
  const DialogContentComponent = isMobile ? MobileDialogContent : DialogContent;

  return (
    <DialogComponent open={isOpen} onOpenChange={onClose}>
      <DialogContentComponent className={isMobile ? "" : "max-w-6xl max-h-[90vh] p-0"}>
        <ModalHeader
          title="Interior Experience"
          subtitle="Discover comfort, technology, and premium materials"
          onClose={onClose}
        />
        
        <div className="overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* View Mode Toggle */}
            <div className="flex justify-center">
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'features' 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                  onClick={() => setViewMode('features')}
                >
                  Interior Features
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'customization' 
                      ? 'bg-background shadow-sm' 
                      : 'hover:bg-background/50'
                  }`}
                  onClick={() => setViewMode('customization')}
                >
                  Customization
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === 'features' ? (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {/* 360° Interior View */}
                  <div className="relative bg-muted rounded-2xl overflow-hidden">
                    <img
                      src={interiorFeatures[activeFeature].image}
                      alt="Interior View"
                      className="w-full h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {interiorFeatures[activeFeature].title}
                      </h3>
                      <p className="text-white/90">
                        {interiorFeatures[activeFeature].description}
                      </p>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        360° Interactive View
                      </Badge>
                    </div>
                  </div>

                  {/* Feature Navigation */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {interiorFeatures.map((feature, index) => (
                      <motion.button
                        key={index}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          activeFeature === index 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setActiveFeature(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`p-2 rounded-lg mb-3 w-fit ${
                          activeFeature === index 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                      </motion.button>
                    ))}
                  </div>

                  {/* Comfort Features */}
                  <div className="bg-muted/30 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">Comfort & Convenience</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        "Heated & Ventilated Seats",
                        "Power-Adjustable Driver Seat",
                        "Leather-Wrapped Steering Wheel",
                        "Ambient Interior Lighting",
                        "Premium Soft-Touch Materials",
                        "Spacious Rear Seating"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="customization"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Color Customization */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Interior Colors & Materials</h3>
                    
                    {/* Color Preview */}
                    <div className="relative bg-muted rounded-2xl overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80"
                        alt="Interior Preview"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h4 className="text-xl font-bold mb-1">
                          {colorOptions[selectedColor].name}
                        </h4>
                        <p className="text-white/90">
                          {colorOptions[selectedColor].premium ? "Premium leather upholstery" : "Durable fabric upholstery"}
                        </p>
                      </div>
                    </div>

                    {/* Color Options */}
                    <div className="grid grid-cols-3 gap-4">
                      {colorOptions.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`p-4 rounded-xl border transition-all ${
                            selectedColor === index 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedColor(index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: option.color }}
                            />
                            <div className="text-center">
                              <p className="font-semibold text-sm">{option.name}</p>
                              {option.premium && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Material Details */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Palette className="h-6 w-6 text-amber-600" />
                      <h3 className="text-xl font-bold">Premium Materials</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Leather Options</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Perforated leather seating surfaces</li>
                          <li>• Contrast stitching details</li>
                          <li>• Premium leather door trim</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Interior Accents</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Soft-touch dashboard materials</li>
                          <li>• Piano black trim accents</li>
                          <li>• Metallic speaker grilles</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={onBookTestDrive}
              >
                Experience Interior Comfort
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
                onClick={onClose}
              >
                Customize Your Interior
              </Button>
            </div>
          </div>
        </div>
      </DialogContentComponent>
    </DialogComponent>
  );
};

export default InteriorExperienceModal;
