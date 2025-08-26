
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, Mic, Car, Zap, Music } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ModalHeader from "./shared/ModalHeader";
import InteractiveDemo from "./shared/InteractiveDemo";

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}

const connectivityFeatures = [
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Apple CarPlay & Android Auto",
    description: "Seamless smartphone integration",
    apps: ["Maps", "Music", "Messages", "Phone"]
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "Wi-Fi Hotspot",
    description: "Keep up to 5 devices connected",
    apps: ["4G LTE", "Data Plans", "Multiple Users"]
  },
  {
    icon: <Mic className="h-6 w-6" />,
    title: "Voice Assistant",
    description: "Hey Toyota voice commands",
    apps: ["Navigation", "Climate", "Music", "Calls"]
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Wireless Charging",
    description: "Charge compatible devices wirelessly",
    apps: ["Qi Compatible", "Fast Charging", "Multiple Zones"]
  }
];

const demoSteps = [
  {
    id: "carplay",
    title: "Apple CarPlay Integration",
    description: "Access your iPhone apps directly on the infotainment screen",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "voice",
    title: "Voice Control",
    description: "Control navigation, music, and climate with natural voice commands",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "wireless",
    title: "Wireless Charging",
    description: "Keep your devices powered without cables",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80"
  }
];

const ConnectivityModal: React.FC<ConnectivityModalProps> = ({
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
          title="Connected Experience"
          subtitle="Stay connected, entertained, and informed on every journey"
          onClose={onClose}
        />
        
        <div className="overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Interactive Demo */}
            <InteractiveDemo
              title="Connectivity in Action"
              description="Experience seamless integration between your device and vehicle"
              demoSteps={demoSteps}
              autoPlay={true}
            />

            {/* Phone Integration Showcase */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Smartphone Integration</h3>
                  <p className="text-muted-foreground mb-6">
                    Your smartphone becomes part of your driving experience with wireless Apple CarPlay and Android Auto.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <span>Wireless connection - no cables needed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Music className="h-4 w-4 text-white" />
                      </div>
                      <span>Access to your music, podcasts, and audiobooks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Car className="h-4 w-4 text-white" />
                      </div>
                      <span>Native app experience on the car display</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
                    alt="CarPlay Interface"
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Connectivity Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Connectivity Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {connectivityFeatures.map((feature, index) => (
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
                        <div className="flex flex-wrap gap-1">
                          {feature.apps.map((app, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Voice Commands Showcase */}
            <div className="bg-muted/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Voice Commands</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Navigation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>"Navigate to downtown Dubai"</li>
                    <li>"Find the nearest gas station"</li>
                    <li>"Avoid toll roads"</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Entertainment</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>"Play my driving playlist"</li>
                    <li>"Call John from contacts"</li>
                    <li>"Read my messages"</li>
                  </ul>
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
                Test Connectivity Features
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

export default ConnectivityModal;
