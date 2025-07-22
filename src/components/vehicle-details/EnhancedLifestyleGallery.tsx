
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  ChevronLeft, ChevronRight, MapPin, Users, Calendar, 
  Mountain, Waves, Coffee, Car, Heart, Star
} from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";

interface EnhancedLifestyleGalleryProps {
  vehicle: VehicleModel;
}

const EnhancedLifestyleGallery: React.FC<EnhancedLifestyleGalleryProps> = ({ vehicle }) => {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const lifestyleScenarios = [
    {
      id: "family-adventure",
      title: "Family Weekend Adventures",
      description: "Create lasting memories with spacious comfort and advanced safety features",
      icon: <Users className="h-6 w-6" />,
      location: "Hatta Mountains, UAE",
      season: "Perfect for all seasons",
      features: ["7-seater capacity", "Safety Sense 3.0", "Panoramic sunroof"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      color: "from-green-500 to-emerald-400"
    },
    {
      id: "urban-professional",
      title: "Urban Professional Life",
      description: "Navigate city life with hybrid efficiency and connected technology",
      icon: <Coffee className="h-6 w-6" />,
      location: "Downtown Dubai",
      season: "Daily commuting comfort",
      features: ["Hybrid efficiency", "Wireless connectivity", "Premium interior"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: "coastal-escape",
      title: "Coastal Escapes",
      description: "Drive to stunning coastlines with confidence and style",
      icon: <Waves className="h-6 w-6" />,
      location: "Fujairah Coast",
      season: "Year-round coastal drives",
      features: ["All-weather capability", "Premium sound", "Comfortable seating"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      color: "from-cyan-500 to-teal-400"
    },
    {
      id: "desert-exploration",
      title: "Desert Exploration",
      description: "Discover the beauty of UAE's landscapes with rugged capability",
      icon: <Mountain className="h-6 w-6" />,
      location: "Al Hajar Mountains",
      season: "Adventure awaits",
      features: ["AWD capability", "Ground clearance", "Durable build"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      color: "from-orange-500 to-red-400"
    }
  ];

  const currentScenario = lifestyleScenarios[selectedScenario];

  // Add swipe functionality
  const swipeableRef = useSwipeable({
    onSwipeLeft: () => setSelectedScenario(prev => prev < lifestyleScenarios.length - 1 ? prev + 1 : 0),
    onSwipeRight: () => setSelectedScenario(prev => prev > 0 ? prev - 1 : lifestyleScenarios.length - 1),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Your Lifestyle, Elevated
          </Badge>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 lg:mb-8 leading-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {vehicle.name.split(' ').pop()} Hybrid
            </span>{" "}
            Lifestyle
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover how your {vehicle.name} seamlessly integrates into every aspect of your life,
            from daily commutes to weekend adventures across the UAE.
          </p>
        </motion.div>

        {/* Interactive Lifestyle Experience */}
        <div className="relative" ref={swipeableRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScenario}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Lifestyle Image */}
              <div className="relative overflow-hidden rounded-3xl">
                <motion.img
                  src={currentScenario.image}
                  alt={currentScenario.title}
                  className="w-full h-96 lg:h-[500px] object-cover"
                  layoutId={`lifestyle-image-${selectedScenario}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${currentScenario.color} opacity-20`} />
                
                {/* Floating Info Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-6 left-6"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{currentScenario.location}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-6 right-6"
                >
                  <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{currentScenario.season}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Lifestyle Details */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentScenario.color} flex items-center justify-center text-white shadow-2xl`}>
                      {currentScenario.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-bold">{currentScenario.title}</h3>
                      <p className="text-muted-foreground text-lg">{currentScenario.description}</p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <Card className="bg-gradient-to-br from-card to-muted/30 border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-4 flex items-center">
                        <Star className="h-5 w-5 mr-2 text-primary" />
                        Perfect Features for This Lifestyle
                      </h4>
                      <div className="space-y-3">
                        {currentScenario.features.map((feature, idx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center space-x-3 p-3 bg-background/60 rounded-xl"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentScenario.color}`} />
                            <span className="font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => setSelectedScenario(prev => prev > 0 ? prev - 1 : lifestyleScenarios.length - 1)}
            className="absolute left-2 top-48 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={() => setSelectedScenario(prev => prev < lifestyleScenarios.length - 1 ? prev + 1 : 0)}
            className="absolute right-2 top-48 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg hover:scale-110"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Scenario Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {lifestyleScenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedScenario(index)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                  index === selectedScenario
                    ? `bg-gradient-to-br ${scenario.color} text-white shadow-xl`
                    : "bg-card hover:bg-muted/50 border border-border"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {scenario.icon}
                  <h4 className="font-bold text-sm">{scenario.title}</h4>
                </div>
                <p className={`text-xs ${index === selectedScenario ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {scenario.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedLifestyleGallery;
