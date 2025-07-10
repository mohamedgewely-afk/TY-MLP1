
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, Eye, Camera, Video, Maximize2 } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const mediaItems = [
    {
      id: "360-view",
      type: "360",
      title: `${vehicle.name} 360° Interior View`,
      description: "Explore every detail of your future vehicle's cabin",
      thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
      icon: Eye
    },
    {
      id: "lifestyle-video",
      type: "video",
      title: `${vehicle.name} Lifestyle Experience`,
      description: "See how this vehicle fits perfectly into your daily adventures",
      thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      icon: Video
    },
    {
      id: "tech-showcase",
      type: "interactive",
      title: `${vehicle.name} Technology Tour`,
      description: "Discover advanced features that enhance your driving experience",
      thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      icon: Camera
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Experience Your {vehicle.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in the world of {vehicle.name} through our interactive media experience. 
            From 360° views to lifestyle stories, discover what makes this vehicle perfect for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Play Button */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveMedia(item.id)}
                    >
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                        <Icon className="h-8 w-8 text-primary ml-1" />
                      </div>
                    </motion.div>

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {item.type === "360" ? "360° View" : item.type === "video" ? "Video" : "Interactive"}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => setActiveMedia(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.type === "360" ? "View 360°" : item.type === "video" ? "Watch Now" : "Explore"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience {vehicle.name} in Person?
            </h3>
            <p className="text-muted-foreground mb-6">
              While our digital experience showcases the {vehicle.name}'s capabilities, 
              nothing compares to the real thing. Book a test drive and feel the difference yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Book Test Drive
              </Button>
              <Button variant="outline" size="lg">
                Visit Showroom
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleMediaShowcase;
