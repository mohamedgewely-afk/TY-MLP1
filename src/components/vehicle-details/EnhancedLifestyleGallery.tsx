
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Users, Coffee, Mountain, Camera, Heart } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedLifestyleGalleryProps {
  vehicle: VehicleModel;
}

const EnhancedLifestyleGallery: React.FC<EnhancedLifestyleGalleryProps> = ({ vehicle }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const lifestyleScenarios = [
    {
      id: "family-adventure",
      title: `Family Adventures with ${vehicle.name}`,
      description: "Spacious comfort meets adventure-ready capability for unforgettable family moments",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      icon: Users,
      highlights: ["7-Seater Comfort", "Advanced Safety", "Entertainment System"]
    },
    {
      id: "urban-professional",
      title: `Urban Elegance in ${vehicle.name}`,
      description: "Navigate city streets with sophisticated style and cutting-edge technology",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      icon: Coffee,
      highlights: ["Premium Interior", "Smart Connectivity", "Fuel Efficiency"]
    },
    {
      id: "weekend-explorer",
      title: `Weekend Escapes with ${vehicle.name}`,
      description: "From mountain trails to coastal roads, your perfect adventure companion",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      icon: Mountain,
      highlights: ["All-Terrain Ready", "Cargo Space", "Off-Road Capability"]
    },
    {
      id: "special-moments",
      title: `Life's Special Moments in ${vehicle.name}`,
      description: "Creating memories that last a lifetime with comfort and reliability",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      icon: Heart,
      highlights: ["Luxury Features", "Smooth Ride", "Dependable Performance"]
    }
  ];

  React.useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % lifestyleScenarios.length);
      }, 5000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, lifestyleScenarios.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % lifestyleScenarios.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + lifestyleScenarios.length) % lifestyleScenarios.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Your Lifestyle, Elevated with {vehicle.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover how the {vehicle.name} seamlessly integrates into every aspect of your life, 
            enhancing each moment with comfort, style, and performance tailored to your unique journey.
          </p>
        </motion.div>

        {/* Enhanced Lifestyle Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="relative"
              >
                <div className="aspect-[21/9] relative overflow-hidden">
                  <img
                    src={lifestyleScenarios[currentSlide].image}
                    alt={lifestyleScenarios[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="p-8 lg:p-12 text-white max-w-2xl">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-3">
                          {React.createElement(lifestyleScenarios[currentSlide].icon, {
                            className: "h-8 w-8 text-primary"
                          })}
                          <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-sm font-medium border border-primary/30">
                            Lifestyle Experience
                          </span>
                        </div>
                        
                        <h3 className="text-3xl lg:text-4xl font-bold leading-tight">
                          {lifestyleScenarios[currentSlide].title}
                        </h3>
                        
                        <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                          {lifestyleScenarios[currentSlide].description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 pt-2">
                          {lifestyleScenarios[currentSlide].highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:-left-16">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6 lg:h-8 lg:w-8" />
            </motion.button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:-right-16">
            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6 lg:h-8 lg:w-8" />
            </motion.button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {lifestyleScenarios.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Auto-play Control */}
          <div className="absolute bottom-4 right-4">
            <motion.button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isAutoPlay ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="w-2 h-2 border border-white rounded-full"
                />
              ) : (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Make Every Journey Extraordinary
            </h3>
            <p className="text-muted-foreground mb-8">
              Experience firsthand how the {vehicle.name} transforms ordinary moments into extraordinary memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Camera className="h-5 w-5 mr-2" />
                Schedule Test Drive
              </Button>
              <Button variant="outline" size="lg">
                <MapPin className="h-5 w-5 mr-2" />
                Find Dealer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedLifestyleGallery;
