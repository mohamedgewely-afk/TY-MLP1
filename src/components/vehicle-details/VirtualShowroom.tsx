
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Camera, Play, RotateCcw, ZoomIn, ZoomOut, 
  Maximize, Eye, Move3D, MousePointer, 
  Smartphone, Monitor, Headphones, Volume2, Settings
} from "lucide-react";

interface VirtualShowroomProps {
  vehicle: VehicleModel;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicle }) => {
  const [activeView, setActiveView] = useState("360");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewOptions = [
    { id: "360", label: "360° View", icon: <RotateCcw className="h-4 w-4" /> },
    { id: "interior", label: "Interior", icon: <Eye className="h-4 w-4" /> },
    { id: "exterior", label: "Exterior", icon: <Camera className="h-4 w-4" /> },
    { id: "ar", label: "AR View", icon: <Smartphone className="h-4 w-4" /> }
  ];

  const features = [
    { name: "High Resolution", description: "4K quality visuals" },
    { name: "Interactive Controls", description: "Full camera control" },
    { name: "Sound Experience", description: "Engine and cabin audio" },
    { name: "VR Compatible", description: "Works with VR headsets" }
  ];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Move3D className="h-4 w-4 mr-2" />
            Virtual Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6 leading-tight">
            Virtual{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Showroom
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience every detail of your {vehicle.name} from the comfort of your home with our immersive virtual showroom.
          </p>
        </motion.div>

        {/* Main Virtual Showroom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Virtual Display */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-muted to-background">
                    {/* Mock 360 viewer */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="relative"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                          alt="Virtual Showroom"
                          className="w-80 h-48 object-cover rounded-lg shadow-2xl"
                        />
                      </motion.div>
                    </div>
                    
                    {/* Controls Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="bg-black/70 rounded-lg p-2 backdrop-blur-sm">
                        <div className="flex gap-2">
                          {viewOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setActiveView(option.id)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                activeView === option.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-white hover:bg-white/20'
                              }`}
                            >
                              {option.icon}
                              <span className="ml-1 hidden sm:inline">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm hover:bg-black/80 transition-colors"
                      >
                        <Maximize className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bottom Controls */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/70 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <button className="text-white hover:text-primary transition-colors p-1">
                              <ZoomIn className="h-4 w-4" />
                            </button>
                            <button className="text-white hover:text-primary transition-colors p-1">
                              <ZoomOut className="h-4 w-4" />
                            </button>
                            <button className="text-white hover:text-primary transition-colors p-1">
                              <Volume2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-white text-sm">
                            <MousePointer className="h-4 w-4 inline mr-1" />
                            Click & drag to explore
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features & Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Experience Features</h3>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">{feature.name}</h4>
                          <p className="text-muted-foreground text-xs">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Available Views</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop Experience
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile AR View
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Headphones className="h-4 w-4 mr-2" />
                      VR Headset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Virtual Tour
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: "Interior 360°", description: "Explore cabin details", icon: <Eye className="h-6 w-6" /> },
            { title: "Engine Bay", description: "Under the hood view", icon: <Settings className="h-6 w-6" /> },
            { title: "Color Options", description: "See all variants", icon: <Camera className="h-6 w-6" /> },
            { title: "Sound Experience", description: "Engine & cabin audio", icon: <Volume2 className="h-6 w-6" /> }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center h-full cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-xs">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualShowroom;
