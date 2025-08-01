
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleModel } from "@/types/vehicle";

interface TechnologyShowcaseProps {
  vehicle: VehicleModel;
}

const TechnologyShowcase: React.FC<TechnologyShowcaseProps> = ({ vehicle }) => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  // Enhanced technology data with premium styling
  const technologies = [
    {
      id: "safety",
      title: "Toyota Safety Sense™ 3.0",
      description: "Next-generation safety features that help protect you and your passengers with AI-powered intelligence.",
      features: [
        "Pre-Collision System with Pedestrian & Cyclist Detection",
        "Lane Departure Alert with Intelligent Steering Assist",
        "Automatic High Beams with Adaptive LED Technology",
        "Dynamic Radar Cruise Control with Full-Speed Range",
        "Road Sign Assist with Speed Limit Recognition"
      ],
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-safety-full-width.jpg",
      video: "https://www.youtube.com/embed/wPaZJDT88Dg",
      badge: "5-Star NCAP",
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "connectivity",
      title: "Smart Connectivity Suite",
      description: "Stay connected with intuitive technology that seamlessly integrates with your digital lifestyle.",
      features: [
        "12.3-inch HD touchscreen with premium audio system",
        "Wireless Apple CarPlay® and Android Auto™ integration",
        "Qi wireless smartphone charging with cooling",
        "Toyota Smart Key System with Push-Button Start",
        "Premium JBL® sound system with spatial audio"
      ],
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-interior-full-width.jpg",
      video: "https://www.youtube.com/embed/kG2zXavpqpo",
      badge: "Premium Audio",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "performance",
      title: "Hybrid Performance Technology",
      description: "Revolutionary engineering that delivers exceptional performance while maximizing efficiency.",
      features: [
        "Advanced Hybrid Synergy Drive with instant electric response",
        "Electronically Controlled CVT with paddle shifters",
        "Drive Mode Select: EV, Eco, Normal, Sport modes",
        "Regenerative braking system for energy recovery",
        "Sport-tuned suspension with enhanced handling"
      ],
      image: "https://www.toyota.ae/-/media/project/tme/tjae/toyota-ae/showroom/npp/corolla/corolla-style-full-width-1.jpg",
      video: "https://www.youtube.com/embed/oJXjxHFNAYE",
      badge: "25.2 km/L",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border/50">
      <div className="p-8 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumEasing }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Advanced Technology
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Discover the innovative technologies that make the {vehicle.name} a leader in automotive excellence.
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="safety" className="w-full">
        <div className="px-8">
          <TabsList className="grid grid-cols-3 mb-8 h-auto p-1 bg-muted/50 rounded-xl">
            {technologies.map((tech) => (
              <TabsTrigger 
                key={tech.id}
                value={tech.id} 
                className="px-6 py-3 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                {tech.id === "safety" ? "Safety" : tech.id === "connectivity" ? "Connectivity" : "Performance"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {technologies.map(tech => (
          <TabsContent key={tech.id} value={tech.id} className="mt-0">
            <motion.div 
              className="grid md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: premiumEasing }}
            >
              <div className="relative group">
                {!videoPlaying ? (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={tech.image}
                      alt={tech.title}
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Premium Badge */}
                    <div className={`absolute top-6 right-6 bg-gradient-to-r ${tech.color} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg`}>
                      {tech.badge}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white/20 border-white text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 rounded-full px-8 py-4"
                        onClick={() => setVideoPlaying(true)}
                      >
                        <PlayCircle className="mr-3 h-6 w-6" />
                        Watch Technology Demo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`${tech.video}?autoplay=1`}
                      title={tech.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-2xl"
                    ></iframe>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">{tech.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-foreground mb-4 flex items-center">
                    Key Features
                    <div className={`ml-3 w-3 h-3 rounded-full bg-gradient-to-r ${tech.color}`}></div>
                  </h4>
                  <ul className="space-y-3">
                    {tech.features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="flex items-start group"
                      >
                        <span className={`flex-shrink-0 mt-1.5 mr-4 p-1.5 bg-gradient-to-r ${tech.color} rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-foreground leading-relaxed font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {videoPlaying && (
                  <Button 
                    variant="outline" 
                    className="mt-6 hover:scale-105 transition-all duration-300"
                    onClick={() => setVideoPlaying(false)}
                  >
                    Show Image Gallery
                  </Button>
                )}
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TechnologyShowcase;
