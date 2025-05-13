import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, 
  Wifi, 
  Cpu, 
  ChevronRight, 
  Search, 
  ArrowRight,
  Download,
  Plus,
  Minus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const TechEnthusiastHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const [searchTerm, setSearchTerm] = useState("");
  const [compareVehicles, setCompareVehicles] = useState<string[]>([]);
  const [showTechSpecs, setShowTechSpecs] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Simulate loading progress
  useEffect(() => {
    if (loadingProgress < 100) {
      const timer = setTimeout(() => {
        setLoadingProgress(prevProgress => Math.min(prevProgress + 10, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  // Filter tech-focused vehicles
  const techVehicles = vehicles
    .filter(v => 
      v.category === "Hybrid" || 
      v.category === "GR Performance" ||
      v.features.some(f => f.includes("Tech") || f.includes("Connect"))
    )
    .filter(v => 
      searchTerm ? v.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    );

  const toggleCompare = (vehicleName: string) => {
    if (compareVehicles.includes(vehicleName)) {
      setCompareVehicles(compareVehicles.filter(v => v !== vehicleName));
    } else {
      if (compareVehicles.length < 3) {
        setCompareVehicles([...compareVehicles, vehicleName]);
      }
    }
  };

  const toggleTechSpecs = (vehicleName: string) => {
    setShowTechSpecs(showTechSpecs === vehicleName ? null : vehicleName);
  };

  // Tech-themed interface with dark mode, sharp edges, and grid layout
  return (
    <div className="tech-pattern-bg min-h-screen text-gray-200">
      {/* Cyberpunk-inspired hero section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black z-0"></div>
        <div className="grid grid-cols-10 h-full absolute inset-0 z-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div 
              key={i}
              className="border-r border-[#6B38FB40] h-full"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ delay: i * 0.05, duration: 1 }}
            />
          ))}
        </div>
        
        <motion.video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2 }}
        >
          <source src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/tech-toyota.mp4" type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70 z-20 flex flex-col items-center justify-center text-center p-6">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div 
                className="inline-block mb-4 bg-[#6B38FB] px-4 py-1 rounded-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-mono text-sm font-bold flex items-center">
                  <Zap className="h-4 w-4 mr-1 animate-pulse" /> NEXT-GEN VEHICLES
                </span>
              </motion.div>
              
              <motion.h1
                className="text-4xl md:text-6xl font-mono font-bold mb-4 tech-text-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                TECHNOLOGY THAT MOVES YOU FORWARD
              </motion.h1>
              
              <motion.div 
                className="overflow-hidden mb-6"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto">
                  Experience the future of driving with Toyota's advanced hybrid & connected technology
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button 
                  asChild
                  className="bg-[#6B38FB] hover:bg-[#5A27EA] text-white rounded-md shadow-lg border border-white/20 backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(107,56,251,0.5)]"
                  size="lg"
                >
                  <Link to="/vehicle/gr-supra" className="flex items-center gap-2 px-6 py-6 text-base sm:text-lg font-mono">
                    EXPLORE TECH FEATURES
                    <ArrowRight className="h-5 w-5 ml-1 animate-pulse" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated code-like decorative elements */}
        <div className="absolute inset-0 z-15 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-[#6B38FB40] font-mono text-xs"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {`${Math.random().toString(16).substr(2, 8)}`}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech specs & vehicle finder section */}
      <section className="py-12 bg-[#12071B]">
        <div className="toyota-container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-mono font-bold mb-4 md:mb-0 text-[#9F7AFF] tech-text-glow"
            >
              TECH_OPTIMIZED VEHICLES
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="search"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-gray-200 rounded-md focus:border-[#6B38FB] focus:ring-[#6B38FB]"
                />
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "grid" | "list")}>
                <ToggleGroupItem value="grid" className="data-[state=on]:bg-[#6B38FB] data-[state=on]:text-white">
                  <span className="sr-only">Grid view</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                </ToggleGroupItem>
                <ToggleGroupItem value="list" className="data-[state=on]:bg-[#6B38FB] data-[state=on]:text-white">
                  <span className="sr-only">List view</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                </ToggleGroupItem>
              </ToggleGroup>
            </motion.div>
          </div>
          
          {loadingProgress < 100 ? (
            <div className="py-16 flex flex-col items-center">
              <Progress value={loadingProgress} className="w-64 h-2 bg-gray-800" />
              <p className="mt-4 font-mono text-gray-400">Loading vehicles... {loadingProgress}%</p>
            </div>
          ) : (
            <div className={cn(
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
            )}>
              {techVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "overflow-hidden",
                    viewMode === "grid" ? "rounded-md border border-gray-800 bg-gray-900/60 backdrop-blur-md hover:border-[#6B38FB40]" : 
                    "rounded-md border border-gray-800 bg-gray-900/60 backdrop-blur-md hover:border-[#6B38FB40] flex items-stretch"
                  )}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="relative">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => toggleCompare(vehicle.name)}
                            className={cn(
                              "p-1.5 rounded",
                              compareVehicles.includes(vehicle.name) 
                                ? "bg-[#6B38FB] text-white" 
                                : "bg-gray-900/70 hover:bg-gray-900/90 text-gray-300"
                            )}
                          >
                            {compareVehicles.includes(vehicle.name) ? 
                              <Minus className="h-4 w-4" /> : 
                              <Plus className="h-4 w-4" />
                            }
                          </button>
                          <button
                            onClick={() => toggleTechSpecs(vehicle.name)}
                            className="p-1.5 bg-gray-900/70 hover:bg-gray-900/90 rounded text-gray-300"
                          >
                            <Cpu className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-mono font-bold text-white">{vehicle.name}</h3>
                          <span className="text-xs bg-[#6B38FB40] text-[#9F7AFF] px-2 py-0.5 rounded">
                            {vehicle.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-3 text-sm text-gray-400">
                          {vehicle.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="flex items-center mr-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#9F7AFF] mr-1.5" />
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <AnimatePresence>
                          {showTechSpecs === vehicle.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gray-950 p-3 rounded border border-gray-800 mb-3">
                                <div className="space-y-2 font-mono text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">HORSEPOWER</span>
                                    <span className="text-[#00D4FF]">{200 + Math.floor(Math.random() * 200)} HP</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">CONNECTIVITY</span>
                                    <span className="text-[#00D4FF]">WIRELESS + 5G</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">OS VERSION</span>
                                    <span className="text-[#00D4FF]">TOYOTA TECH 4.2</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-mono font-bold text-[#00D4FF]">
                            ${vehicle.price.toLocaleString()}
                          </span>
                          <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="bg-[#6B38FB] hover:bg-[#5A27EA] rounded-md text-xs font-mono"
                          >
                            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center">
                              SPECS
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <div className="relative w-36">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-lg font-mono font-bold text-white">{vehicle.name}</h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => toggleCompare(vehicle.name)}
                              className={cn(
                                "p-1 rounded",
                                compareVehicles.includes(vehicle.name) 
                                  ? "bg-[#6B38FB] text-white" 
                                  : "bg-gray-900/70 hover:bg-gray-900/90 text-gray-300"
                              )}
                            >
                              {compareVehicles.includes(vehicle.name) ? 
                                <Minus className="h-3 w-3" /> : 
                                <Plus className="h-3 w-3" />
                              }
                            </button>
                            <button
                              onClick={() => toggleTechSpecs(vehicle.name)}
                              className="p-1 bg-gray-900/70 hover:bg-gray-900/90 rounded text-gray-300"
                            >
                              <Cpu className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <span className="text-xs bg-[#6B38FB40] text-[#9F7AFF] px-2 py-0.5 rounded">
                          {vehicle.category}
                        </span>
                        
                        <div className="flex items-center my-2 text-sm text-gray-400">
                          {vehicle.features.slice(0, 2).map((feature, i) => (
                            <span key={i} className="flex items-center mr-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#9F7AFF] mr-1.5" />
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <AnimatePresence>
                          {showTechSpecs === vehicle.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-gray-950 p-2 rounded border border-gray-800 mb-2">
                                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                                  <div>
                                    <span className="text-gray-400">HORSEPOWER</span>
                                    <span className="block text-[#00D4FF]">{200 + Math.floor(Math.random() * 200)} HP</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">CONNECTIVITY</span>
                                    <span className="block text-[#00D4FF]">WIRELESS + 5G</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">OS VERSION</span>
                                    <span className="block text-[#00D4FF]">TOYOTA TECH 4.2</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-mono font-bold text-[#00D4FF]">
                            ${vehicle.price.toLocaleString()}
                          </span>
                          <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="bg-[#6B38FB] hover:bg-[#5A27EA] rounded-md text-xs font-mono"
                          >
                            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center">
                              VIEW SPECS
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Compare floating box */}
          {compareVehicles.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-950/90 backdrop-blur-md border-t border-[#6B38FB40] p-4 z-50"
            >
              <div className="toyota-container flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <span className="font-mono text-sm mr-3">
                    <span className="text-[#9F7AFF]">{compareVehicles.length}</span>/{3} VEHICLES SELECTED
                  </span>
                  <div className="flex -space-x-2">
                    {compareVehicles.map((name, i) => {
                      const vehicle = vehicles.find(v => v.name === name);
                      return vehicle ? (
                        <div key={name} className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-950">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareVehicles([])}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 font-mono text-xs"
                  >
                    CLEAR ALL
                  </Button>
                  <Button 
                    asChild
                    size="sm"
                    className="bg-[#6B38FB] hover:bg-[#5A27EA] font-mono text-xs"
                  >
                    <Link to="/compare">
                      COMPARE SPECS
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Connectivity features section */}
      <section className="py-16 bg-[#0D0517]">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-mono font-bold mb-10 text-[#9F7AFF] tech-text-glow text-center"
          >
            NEXT-GEN CONNECTIVITY
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Wifi className="h-10 w-10 text-[#00D4FF]" />,
                title: "ALWAYS CONNECTED",
                description: "5G connectivity keeps your vehicle & devices seamlessly integrated"
              },
              {
                icon: <Cpu className="h-10 w-10 text-[#00D4FF]" />,
                title: "INTELLIGENT INTERFACE",
                description: "AI-powered system anticipates your needs before you do"
              },
              {
                icon: <Download className="h-10 w-10 text-[#00D4FF]" />,
                title: "WIRELESS UPDATES",
                description: "Over-the-air updates keep your vehicle at the cutting edge"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-900/60 backdrop-blur-md p-6 rounded-md border border-gray-800"
              >
                <div className="bg-gray-950 rounded-md p-4 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-mono font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive tech demo section */}
      <section className="py-16 bg-[#12071B]">
        <div className="toyota-container">
          <div className="bg-gray-900/60 backdrop-blur-md border border-[#6B38FB40] rounded-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl font-mono font-bold mb-4 text-[#9F7AFF]"
                >
                  EXPERIENCE THE TECH ADVANTAGE
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-gray-300 mb-6"
                >
                  Book a personal tech demo with our specialists to experience cutting-edge Toyota technology first-hand.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    asChild
                    className="bg-[#6B38FB] hover:bg-[#5A27EA] text-white rounded-md shadow-lg border border-white/20 hover:shadow-[0_0_15px_rgba(107,56,251,0.5)]"
                  >
                    <Link to="/test-drive" className="flex items-center">
                      SCHEDULE TECH DEMO
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
              
              <div className="md:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#12071B] to-transparent z-10 md:hidden"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf" 
                  alt="Tech Demo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute bg-[#00D4FF]"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: '1px',
                        height: '1px',
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 3, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 5
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechEnthusiastHomepage;
