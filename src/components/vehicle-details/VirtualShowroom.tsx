import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Monitor, Smartphone, Maximize2, ExternalLink, Eye } from "lucide-react";

interface VirtualShowroomProps {
  vehicle: VehicleModel;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showroomUrl = "https://www.virtualshowroom.toyota.ae/configurator/land-cruiser/en";

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExternalLink = () => {
    window.open(showroomUrl, "_blank");
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,75,75,0.2),transparent_50%)]" />
      </div>

      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Eye className="h-4 w-4 mr-2" />
            Virtual Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6 leading-tight">
            Virtual{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Showroom
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the {vehicle.name} in our immersive virtual showroom.
            Configure colors, explore features, and get a 360° view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
                <div className="flex items-center space-x-4">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Interactive Configurator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleFullscreen} className="h-8 w-8 p-0">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExternalLink} className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`relative ${isFullscreen ? 'h-screen' : 'h-[400px] lg:h-[600px]'} transition-all duration-300`}>
                <iframe
                  src={showroomUrl}
                  title={`${vehicle.name} Virtual Showroom`}
                  className="w-full h-full border-0"
                  allow="fullscreen; accelerometer; gyroscope; magnetometer; vr"
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />

                <div className="absolute inset-0 bg-muted/90 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading Virtual Showroom...</p>
                  </div>
                </div>
              </div>

              <div className="lg:hidden p-4 bg-muted/30 border-t">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4 flex-shrink-0" />
                  <span>Tap and drag to explore • Pinch to zoom • Use device rotation for 360° view</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: <Eye className="h-6 w-6" />,
                title: "360° Experience",
                description: "Complete virtual tour of interior and exterior"
              },
              {
                icon: <Monitor className="h-6 w-6" />,
                title: "Real-time Configuration",
                description: "Customize colors, wheels, and accessories instantly"
              },
              {
                icon: <ExternalLink className="h-6 w-6" />,
                title: "Immersive Details",
                description: "Explore every feature with high-resolution imagery"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={handleFullscreen}
        >
          <div className="absolute top-4 right-4 z-60">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default VirtualShowroom;
