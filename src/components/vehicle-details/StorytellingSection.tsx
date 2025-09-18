import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
}

// Simplified storytelling component with integrated navigation
const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore,
}) => {
  const [currentSection, setCurrentSection] = useState(0);

  const storySections = [
    {
      id: "safety",
      title: "Advanced Safety",
      subtitle: "Protection Beyond Compare",
      description: "Toyota Safety Sense 3.0 delivers comprehensive protection with pre-collision systems, lane departure alerts, and adaptive cruise control.",
      image: galleryImages[0] || "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      action: onSafetyExplore,
      buttonText: "Explore Safety Features"
    },
    {
      id: "connectivity",
      title: "Connected Intelligence",
      subtitle: "Stay Connected On Every Journey",
      description: "Seamless smartphone integration with wireless Apple CarPlay and Android Auto, plus premium JBL audio for an immersive experience.",
      image: galleryImages[1] || "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      action: onConnectivityExplore,
      buttonText: "Discover Technology"
    },
    {
      id: "hybrid",
      title: "Hybrid Synergy Drive",
      subtitle: "Efficiency Meets Performance",
      description: "Our advanced hybrid system seamlessly combines electric and gasoline power for exceptional fuel efficiency without compromising performance.",
      image: galleryImages[2] || "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      action: onHybridTechExplore,
      buttonText: "Learn About Hybrid"
    },
    {
      id: "interior",
      title: "Premium Interior",
      subtitle: "Comfort & Luxury Refined",
      description: "Experience thoughtfully designed interiors featuring premium materials, spacious seating, and intuitive controls for the ultimate driving comfort.",
      image: galleryImages[3] || "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true",
      action: onInteriorExplore,
      buttonText: "Explore Interior"
    }
  ];

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % storySections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + storySections.length) % storySections.length);
  };

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Discover What Makes It
            <span className="text-primary block">Exceptional</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the innovative features and technologies that set this vehicle apart
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="order-2 md:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">
                    {storySections[currentSection].title}
                  </h3>
                  <p className="text-lg text-primary mb-4 font-medium">
                    {storySections[currentSection].subtitle}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {storySections[currentSection].description}
                  </p>
                  <Button
                    onClick={storySections[currentSection].action}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    {storySections[currentSection].buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="order-1 md:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl shadow-2xl"
                >
                  <img
                    src={storySections[currentSection].image}
                    alt={storySections[currentSection].title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSection}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots Navigation */}
            <div className="flex gap-2">
              {storySections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSection
                      ? "bg-primary scale-110"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSection}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;