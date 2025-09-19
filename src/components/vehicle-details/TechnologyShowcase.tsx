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
  
  // These would come from the vehicle data in a real app
  const technologies = [
    {
      id: "safety",
      title: "Toyota Safety Sense™",
      description: "Advanced safety features that help protect you and your passengers.",
      features: [
        "Pre-Collision System with Pedestrian Detection",
        "Lane Departure Alert with Steering Assist",
        "Automatic High Beams",
        "Dynamic Radar Cruise Control",
        "Road Sign Assist"
      ],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      video: "https://www.youtube.com/embed/wPaZJDT88Dg"
    },
    {
      id: "connectivity",
      title: "Connected Services",
      description: "Stay connected with intuitive technology that enhances your drive.",
      features: [
        "8-inch touchscreen with Apple CarPlay® and Android Auto™",
        "Wireless smartphone charging",
        "Premium JBL® sound system",
        "Toyota Smart Key System",
        "Voice recognition"
      ],
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      video: "https://www.youtube.com/embed/kG2zXavpqpo"
    },
    {
      id: "performance",
      title: "Performance Technology",
      description: "Innovative engineering for a more dynamic and efficient drive.",
      features: [
        "Dynamic Force Engine with VVT-i",
        "Direct Shift-CVT with paddle shifters",
        "Drive Mode Select (Eco, Normal, Sport)",
        "Hybrid System (available)",
        "Sport-tuned suspension"
      ],
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      video: "https://www.youtube.com/embed/oJXjxHFNAYE"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Advanced Technology
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Discover the innovative technologies that make the {vehicle.name} a class leader.
        </p>
      </div>

      <Tabs defaultValue="safety" className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </div>

        {technologies.map(tech => (
          <TabsContent key={tech.id} value={tech.id} className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                {!videoPlaying ? (
                  <div className="relative group">
                    <img
                      src={tech.image}
                      alt={tech.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
                        onClick={() => setVideoPlaying(true)}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Watch Video
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`${tech.video}?autoplay=1`}
                      title={tech.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-3">{tech.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {tech.description}
                </p>

                <h4 className="font-medium mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {tech.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="flex-shrink-0 mt-1 mr-3 p-1 bg-toyota-red/10 rounded-full">
                        <Check className="h-4 w-4 text-toyota-red" />
                      </span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {videoPlaying && (
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => setVideoPlaying(false)}
                  >
                    Show Image
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TechnologyShowcase;
