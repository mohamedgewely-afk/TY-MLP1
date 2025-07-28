
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleModel } from "@/types/vehicle";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const specifications = [
    {
      category: "Engine & Performance",
      icon: <Gauge className="h-5 w-5" />,
      specs: [
        { label: "Engine Type", value: "2.0L Hybrid" },
        { label: "Total Power", value: "218 HP" },
        { label: "Torque", value: "221 Nm" },
        { label: "Fuel Economy", value: "25.2 km/L" },
      ]
    },
    {
      category: "Safety & Security",
      icon: <Shield className="h-5 w-5" />,
      specs: [
        { label: "Safety Rating", value: "5-Star NCAP" },
        { label: "Airbags", value: "10 Airbags" },
        { label: "Safety Features", value: "Toyota Safety Sense 3.0" },
        { label: "Security", value: "Smart Entry & Start" },
      ]
    },
    {
      category: "Technology",
      icon: <Smartphone className="h-5 w-5" />,
      specs: [
        { label: "Infotainment", value: "12.3\" Touchscreen" },
        { label: "Connectivity", value: "Wireless Apple CarPlay" },
        { label: "Audio", value: "JBL Premium Sound" },
        { label: "Navigation", value: "Built-in GPS" },
      ]
    },
    {
      category: "Comfort & Convenience",
      icon: <Wind className="h-5 w-5" />,
      specs: [
        { label: "Climate Control", value: "Dual-Zone Auto AC" },
        { label: "Seats", value: "Power Adjustable" },
        { label: "Lighting", value: "LED Headlights" },
        { label: "Keyless", value: "Smart Entry" },
      ]
    }
  ];

  const technologyFeatures = [
    {
      id: "hybrid-system",
      title: "Hybrid Synergy Drive",
      description: "Advanced hybrid technology that seamlessly combines electric and gasoline power for optimal efficiency and performance.",
      icon: <Zap className="h-12 w-12" />,
      color: "from-primary to-primary/70",
      benefits: ["25.2 km/L fuel economy", "Instant electric torque", "Reduced emissions"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true"
    },
    {
      id: "safety-system",
      title: "Toyota Safety Sense 3.0",
      description: "Next-generation safety suite with AI-powered collision prevention and driver assistance technologies.",
      icon: <Shield className="h-12 w-12" />,
      color: "from-green-500 to-emerald-400",
      benefits: ["Pre-collision system", "Lane departure alert", "Adaptive cruise control"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/a7ed1d12-7c0e-4377-84f1-bf4d0230ded6/renditions/4b8651e3-1a7c-4e08-aab5-aa103f6a5b4b?binary=true&mformat=true"
    },
    {
      id: "infotainment",
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless connectivity and intuitive voice control.",
      icon: <Smartphone className="h-12 w-12" />,
      color: "from-blue-500 to-cyan-400",
      benefits: ["Wireless Apple CarPlay", "Android Auto", "Voice commands"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true"
    },
    {
      id: "climate-system",
      title: "Advanced Climate Control",
      description: "Dual-zone automatic climate system with air purification and energy-efficient operation.",
      icon: <Wind className="h-12 w-12" />,
      color: "from-cyan-500 to-teal-400",
      benefits: ["HEPA air filter", "Automatic temperature", "Energy efficient"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true"
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="toyota-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            <Settings className="h-4 w-4 mr-2" />
            Technical Excellence
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
            Specifications & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 ml-2">
              Technology
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the advanced engineering and innovative technology that makes the {vehicle.name} exceptional.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 lg:mb-12 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger 
                value="specifications" 
                className="text-sm lg:text-base font-medium py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Gauge className="h-4 w-4 mr-2" />
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="technology" 
                className="text-sm lg:text-base font-medium py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Zap className="h-4 w-4 mr-2" />
                Technology
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="specifications" className="mt-0">
              <motion.div
                key="specifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
              >
                {specifications.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-muted/50">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg lg:text-xl font-bold text-foreground">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mr-3">
                            {category.icon}
                          </div>
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {category.specs.map((spec, specIndex) => (
                            <div key={specIndex} className="flex justify-between items-center py-2 border-b border-muted/30 last:border-b-0">
                              <span className="text-muted-foreground font-medium">{spec.label}</span>
                              <span className="text-foreground font-bold">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="technology" className="mt-0">
              </motion.div> //
                key="technology"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
              >
                {technologyFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => handleFeatureClick(feature.id)}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-muted/50 group-hover:border-primary/30">
                      <div className="relative">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                        <div className="absolute top-4 right-4">
                          <div className={`p-3 rounded-full bg-white/90 text-primary shadow-lg`}>
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {feature.title}
                          </h3>
                          <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${selectedFeature === feature.id ? 'rotate-90' : ''}`} />
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {feature.description}
                        </p>

                        <AnimatePresence>
                          {selectedFeature === feature.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2 pt-4 border-t border-muted/30"
                            >
                              {feature.benefits.map((benefit, benefitIndex) => (
                                <div key={benefitIndex} className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                                  <span className="text-sm text-muted-foreground">{benefit}</span>
                                </div>
                              ))}
                            </motion.div> 
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
