
import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Wifi, Radio, Navigation, Phone, Music, MessageSquare, Settings } from "lucide-react";
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

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
}

const ConnectivityModal: React.FC<ConnectivityModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const connectivityFeatures = [
    {
      icon: Smartphone,
      name: "Apple CarPlay & Android Auto",
      description: "Seamlessly connect your smartphone for apps, music, and navigation",
      details: "Wireless connectivity allows you to access your favorite apps, make calls, send messages, and navigate using your phone's interface on the vehicle's display.",
      compatibility: ["iPhone 5s and later", "Android phones with Android 6.0+"]
    },
    {
      icon: Wifi,
      name: "Wi-Fi Connect",
      description: "Built-in 4G LTE Wi-Fi hotspot for up to 5 devices",
      details: "Stay connected on the go with high-speed internet access for passengers to stream, browse, and work from anywhere.",
      compatibility: ["Up to 5 devices", "4G LTE speeds", "Data plan required"]
    },
    {
      icon: Navigation,
      name: "Connected Navigation",
      description: "Real-time traffic updates and intelligent route planning",
      details: "Cloud-based navigation with live traffic data, weather information, and points of interest updates.",
      compatibility: ["Real-time traffic", "Weather integration", "POI updates"]
    },
    {
      icon: Radio,
      name: "SiriusXM Connected Services",
      description: "Premium audio content and connected vehicle services",
      details: "Access to satellite radio, podcasts, and vehicle health reports with remote monitoring capabilities.",
      compatibility: ["360+ channels", "Travel Link", "Vehicle health alerts"]
    }
  ];

  const smartFeatures = [
    {
      icon: Phone,
      title: "Remote Connect",
      features: ["Remote Start", "Door Lock/Unlock", "Vehicle Locator", "Guest Driver Monitor"]
    },
    {
      icon: Music,
      title: "Audio Plus",
      features: ["Amazon Alexa Built-in", "Premium Audio System", "Wireless Charging", "Multiple USB Ports"]
    },
    {
      icon: MessageSquare,
      title: "Communication",
      features: ["Hands-free Calling", "Voice-to-Text Messaging", "Email Notifications", "Social Media Integration"]
    },
    {
      icon: Settings,
      title: "Customization",
      features: ["Driver Profiles", "Climate Presets", "Seat Memory", "Mirror Positions"]
    }
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Connected Services
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base">
            Stay connected, entertained, and informed with advanced connectivity features
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Wifi className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary" className="text-sm font-semibold bg-blue-100 text-blue-700">
                  Always Connected
                </Badge>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-3">Your Digital Companion</h3>
              <p className="text-muted-foreground mb-6">
                Experience seamless integration between your digital life and your Toyota Camry with 
                cutting-edge connectivity features.
              </p>
              
              <InteractiveDemo type="connectivity" />
            </motion.div>

            {/* Core Connectivity Features */}
            <div>
              <h3 className="text-xl font-bold mb-4">Core Connectivity Features</h3>
              <div className="space-y-4">
                {connectivityFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 leading-tight">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                        
                        <CollapsibleContent title="Technical Details" className="border-0">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">{feature.details}</p>
                            <div>
                              <h5 className="font-medium mb-2 text-sm">Compatibility:</h5>
                              <div className="grid gap-1 sm:grid-cols-2">
                                {feature.compatibility.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-xs">{item}</span>
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

            {/* Smart Features */}
            <div>
              <h3 className="text-xl font-bold mb-4">Smart Features & Services</h3>
              <div className="space-y-4">
                {smartFeatures.map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-blue-500" />
                        <span>{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
            </div>

            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
            >
              <h3 className="text-xl font-bold mb-4 text-blue-900">Service Plans</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Complimentary Trial</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Remote Connect (1 year)</li>
                    <li>• SiriusXM All Access (3 months)</li>
                    <li>• Connected Services (1 year)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Extended Plans</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monthly & annual options</li>
                    <li>• Family sharing plans</li>
                    <li>• Premium features available</li>
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
              Test Connectivity Features
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default ConnectivityModal;
