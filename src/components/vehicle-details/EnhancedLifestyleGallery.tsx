
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Users, Coffee, Heart, Star, Mountain, Waves, ChevronRight
} from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useDeviceInfo } from "@/hooks/use-device-info";

interface EnhancedLifestyleGalleryProps {
  vehicle: VehicleModel;
}

const EnhancedLifestyleGallery: React.FC<EnhancedLifestyleGalleryProps> = ({ vehicle }) => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const { isMobile, deviceCategory } = useDeviceInfo();
  const scrollRef = useRef<HTMLDivElement>(null);

  const lifestyleScenarios = [
    {
      id: "family-adventure",
      title: "Family Adventures",
      shortTitle: "Family",
      description: "Create lasting memories with spacious comfort and advanced safety",
      icon: <Users className="h-4 w-4" />,
      features: ["7-seater capacity", "Safety Sense 3.0", "Panoramic sunroof"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      accentColor: "bg-emerald-500"
    },
    {
      id: "urban-professional",
      title: "Urban Professional",
      shortTitle: "Professional", 
      description: "Navigate city life with hybrid efficiency and connected technology",
      icon: <Coffee className="h-4 w-4" />,
      features: ["Hybrid efficiency", "Wireless connectivity", "Premium interior"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      accentColor: "bg-blue-500"
    },
    {
      id: "coastal-escape",
      title: "Coastal Escapes",
      shortTitle: "Coastal",
      description: "Drive to stunning coastlines with confidence and style",
      icon: <Waves className="h-4 w-4" />,
      features: ["All-weather capability", "Premium sound", "Comfortable seating"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      gradient: "from-cyan-500 via-blue-400 to-teal-500",
      accentColor: "bg-cyan-500"
    },
    {
      id: "desert-exploration",
      title: "Desert Exploration",
      shortTitle: "Desert",
      description: "Discover UAE's landscapes with rugged capability",
      icon: <Mountain className="h-4 w-4" />,
      features: ["AWD capability", "Ground clearance", "Durable build"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      accentColor: "bg-orange-500"
    }
  ];

  const currentScenario = lifestyleScenarios[selectedScenario];

  // Enhanced swipe functionality for mobile
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      const nextIndex = selectedScenario < lifestyleScenarios.length - 1 ? selectedScenario + 1 : 0;
      setSelectedScenario(nextIndex);
    },
    onSwipeRight: () => {
      const prevIndex = selectedScenario > 0 ? selectedScenario - 1 : lifestyleScenarios.length - 1;
      setSelectedScenario(prevIndex);
    },
    threshold: 30,
    preventDefaultTouchmoveEvent: false
  });

  // Auto-scroll the bottom navigation when scenario changes
  useEffect(() => {
    if (scrollRef.current && isMobile) {
      const element = scrollRef.current;
      const tabWidth = element.scrollWidth / lifestyleScenarios.length;
      const scrollPosition = selectedScenario * tabWidth - element.clientWidth / 2 + tabWidth / 2;
      
      element.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [selectedScenario, isMobile]);

  // Desktop version (restored)
  if (!isMobile) {
    return (
      <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
        <div className="toyota-container relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Heart className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Your Lifestyle, Elevated
            </Badge>
            <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-4 md:mb-6 lg:mb-8 leading-tight px-2">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                {vehicle.name.split(' ').pop()} Hybrid
              </span>{" "}
              Lifestyle
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2">
              Discover how your {vehicle.name} seamlessly integrates into every aspect of your life.
            </p>
          </motion.div>

          {/* Desktop Interactive Section */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {/* Scenario Selector Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Choose Your Adventure
              </h3>
              {lifestyleScenarios.map((scenario, index) => (
                <motion.button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    index === selectedScenario
                      ? `bg-gradient-to-r ${scenario.gradient} text-white shadow-xl`
                      : "bg-card border border-border hover:bg-muted/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${
                      index === selectedScenario ? 'bg-white/20' : scenario.accentColor
                    } flex items-center justify-center ${
                      index === selectedScenario ? 'text-white' : 'text-white'
                    }`}>
                      {scenario.icon}
                    </div>
                    <h4 className={`font-semibold ${
                      index === selectedScenario ? 'text-white' : 'text-foreground'
                    }`}>
                      {scenario.title}
                    </h4>
                    {index === selectedScenario && (
                      <ChevronRight className="h-4 w-4 ml-auto text-white/80" />
                    )}
                  </div>
                  <p className={`text-sm ${
                    index === selectedScenario ? 'text-white/90' : 'text-muted-foreground'
                  }`}>
                    {scenario.description}
                  </p>
                </motion.button>
              ))}
            </motion.div>

            {/* Content Display */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedScenario}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Card className="overflow-hidden border-0 shadow-2xl">
                    <div className="relative">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={currentScenario.image}
                          alt={currentScenario.title}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentScenario.gradient} opacity-20`} />
                      </div>
                      
                      {/* Floating Badge */}
                      <div className="absolute top-6 left-6">
                        <Badge className={`${currentScenario.accentColor} text-white border-0 px-3 py-1.5`}>
                          <Star className="h-3 w-3 mr-1.5" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl ${currentScenario.accentColor} flex items-center justify-center text-white shadow-lg`}>
                          {currentScenario.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{currentScenario.title}</h3>
                          <p className="text-muted-foreground">{currentScenario.description}</p>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid md:grid-cols-3 gap-4">
                        {currentScenario.features.map((feature, idx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg"
                          >
                            <div className={`w-2 h-2 rounded-full ${currentScenario.accentColor}`} />
                            <span className="text-sm font-medium text-foreground">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile-first redesign
  return (
    <section className="py-6 bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      <div className="px-4">
        {/* Mobile Header - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium mb-3">
            <Heart className="h-3 w-3 mr-1.5" />
            Your Lifestyle
          </Badge>
          <h2 className="text-xl font-bold text-foreground mb-2 leading-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {vehicle.name.split(' ').pop()}
            </span>{" "}
            Adventures
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover how your {vehicle.name} fits your lifestyle
          </p>
        </motion.div>

        {/* Mobile Card Carousel */}
        <div className="relative mb-6" ref={swipeableRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScenario}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* Main Image Card */}
              <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={currentScenario.image}
                      alt={currentScenario.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentScenario.gradient} opacity-20`} />
                  </div>
                  
                  {/* Swipe Indicator */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="font-medium text-gray-700">Swipe to explore</span>
                      </div>
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className="flex space-x-1">
                      {lifestyleScenarios.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            index === selectedScenario ? 'bg-white scale-125' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${currentScenario.accentColor} flex items-center justify-center text-white shadow-md`}>
                      {currentScenario.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{currentScenario.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentScenario.description}</p>
                    </div>
                  </div>

                  {/* Features - Mobile Optimized */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center">
                      <Star className="h-3 w-3 mr-1.5 text-primary" />
                      Perfect Features
                    </h4>
                    <div className="space-y-1.5">
                      {currentScenario.features.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${currentScenario.accentColor}`} />
                          <span className="text-sm font-medium text-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation - Mobile App Style */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {lifestyleScenarios.map((scenario, index) => (
              <motion.button
                key={scenario.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedScenario(index)}
                className={`flex-shrink-0 min-w-[120px] p-3 rounded-xl text-left transition-all duration-300 ${
                  index === selectedScenario
                    ? `bg-gradient-to-r ${scenario.gradient} text-white shadow-lg`
                    : "bg-card border border-border hover:bg-muted/50"
                }`}
                style={{ 
                  scrollSnapAlign: 'center',
                  minHeight: '44px',
                  minWidth: '120px'
                }}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {scenario.icon}
                  <span className="text-xs font-bold">{scenario.shortTitle}</span>
                  {index === selectedScenario && (
                    <ChevronRight className="h-3 w-3 ml-auto opacity-80" />
                  )}
                </div>
                <p className={`text-xs leading-tight ${
                  index === selectedScenario ? 'text-white/90' : 'text-muted-foreground'
                }`}>
                  {scenario.description.split(' ').slice(0, 4).join(' ')}...
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedLifestyleGallery;
