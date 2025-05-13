
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Wifi, Settings, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const TechEnthusiastHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="tech-pattern-bg overflow-hidden">
      {/* Hero Section with Tech Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 tech-grid-overlay opacity-30"></div>
        
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 border border-purple-200">
                <span className="text-purple-800 font-medium text-sm flex items-center">
                  <Cpu className="mr-1 h-4 w-4" /> Next-Gen Technology
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 font-mono">
                <span className="block text-purple-600 tech-text-glow">Cutting-Edge</span>
                Innovation On Wheels
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto md:mx-0 font-mono">
                Experience the future of driving with Toyota's advanced technology and 
                connected driving systems powered by innovative engineering.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                    boxShadow: `0 10px 25px -5px ${personaData.colorScheme.primary}50`
                  }}
                  className="rounded-md border border-white/10 backdrop-blur-sm"
                >
                  <Link to="/new-cars" className="flex items-center gap-2">
                    Explore Tech Features
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-md border-2 border-purple-300 backdrop-blur-sm"
                >
                  <Link to="/connected-services" className="flex items-center gap-2">
                    Connected Services
                    <Wifi size={18} />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-6 relative"
            >
              <div className="relative rounded-md overflow-hidden border border-purple-300 shadow-xl">
                <AspectRatio ratio={16/9} className="bg-purple-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/tech-toyota.jpg" 
                    alt="Toyota Technology" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Tech overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent mix-blend-overlay"></div>
                  <div className="absolute inset-0 grid grid-cols-10 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="border-r border-white/30 h-full" />
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-10 opacity-20">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="border-b border-white/30 w-full" />
                    ))}
                  </div>
                </AspectRatio>
                
                {/* Floating tech elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-purple-800 p-3 rounded-md shadow-lg z-10"
                  animate={{ y: [0, -10, 0], boxShadow: ["0 10px 25px -5px rgba(107, 56, 251, 0.3)", "0 20px 25px -5px rgba(107, 56, 251, 0.6)", "0 10px 25px -5px rgba(107, 56, 251, 0.3)"] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Zap className="h-8 w-8 text-white" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white p-3 rounded-md shadow-lg z-10"
                  animate={{ 
                    y: [0, 10, 0],
                    boxShadow: ["0 10px 25px -5px rgba(107, 56, 251, 0.3)", "0 20px 25px -5px rgba(107, 56, 251, 0.6)", "0 10px 25px -5px rgba(107, 56, 251, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Settings className="h-8 w-8 text-purple-600" />
                </motion.div>
              </div>
              
              {/* Tech spec floating panel */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white rounded-md p-4 shadow-xl border border-purple-200 backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col gap-2 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-800">Connected Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-800">12.3" Touchscreen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-800">Wireless CarPlay</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Tech Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div 
              className="w-96 h-96 rounded-full bg-purple-500 blur-3xl absolute -top-10 -left-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="w-96 h-96 rounded-full bg-blue-300 blur-3xl absolute bottom-0 right-0"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 8, delay: 4, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </div>
      </section>
      
      {/* Tech Features Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 font-mono"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Next-Gen <span className="text-purple-600">Technology</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Toyota's cutting-edge technology enhances every aspect of your driving experience,
            from connectivity to performance.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Wifi size={32} className="text-purple-600" />,
                title: "Connected Services",
                description: "Stay connected with remote access, real-time traffic, and wireless updates."
              },
              {
                icon: <Zap size={32} className="text-purple-600" />,
                title: "Advanced Hybrid System",
                description: "Intelligent power management with real-time performance optimization."
              },
              {
                icon: <Cpu size={32} className="text-purple-600" />,
                title: "Digital Cockpit",
                description: "Customizable 12.3-inch digital display with heads-up projection."
              },
              {
                icon: <Settings size={32} className="text-purple-600" />,
                title: "Drive Mode Select",
                description: "Adaptive driving modes with intelligent suspension and response tuning."
              },
              {
                icon: <Wifi size={32} className="text-purple-600" />,
                title: "Premium Sound System",
                description: "Immersive audio experience with dynamic sound optimization."
              },
              {
                icon: <Zap size={32} className="text-purple-600" />,
                title: "Smart Parking Assist",
                description: "AI-powered parking with 360° camera views and obstacle detection."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-md p-6 shadow-md border border-purple-100 group hover:shadow-lg transition-shadow duration-300 hover:border-purple-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-purple-50 p-4 rounded-md mb-4 group-hover:bg-purple-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tech-Forward Vehicles */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 font-mono"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Tech-Forward <span className="text-purple-600">Vehicles</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Experience Toyota's most technologically advanced vehicles with premium features and cutting-edge innovations.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Prius Prime",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/prius-tech.jpg",
                features: ["Plug-in Hybrid Technology", "Digital Driver Display", "Solar Roof Charging"],
                price: "Starting at $28,770"
              },
              {
                name: "bZ4X",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/bz4x-electric.jpg",
                features: ["All-Electric Powertrain", "Advanced Driver Assistance", "Fast-Charging Capability"],
                price: "Starting at $42,000"
              },
              {
                name: "Crown",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/crown-luxury-tech.jpg",
                features: ["Hybrid Max System", "12.3\" Touchscreen Display", "Adaptive Variable Suspension"],
                price: "Starting at $39,950"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-md overflow-hidden shadow-lg border border-purple-100 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={vehicle.image} 
                      alt={`Toyota ${vehicle.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </AspectRatio>
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                    Tech Innovation
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4 font-mono">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="font-bold text-purple-600 mb-4">{vehicle.price}</div>
                  <Button 
                    className="w-full rounded-md"
                    style={{ backgroundColor: personaData.colorScheme.primary }}
                    asChild
                  >
                    <Link to={`/vehicles/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      Explore {vehicle.name}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="rounded-md border-2 border-purple-300"
            >
              <Link to="/new-cars" className="flex items-center gap-2">
                View All Tech Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Interactive Tech Demo CTA */}
      <section className="py-16 bg-purple-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-md p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full grid grid-cols-20 grid-rows-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="border-r border-white/10 h-full" />
                    <div className="border-b border-white/10 w-full" />
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="relative z-10">
              <motion.div 
                className="flex flex-col md:flex-row items-center justify-between gap-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">Experience Our Tech Lab</h2>
                  <p className="text-lg md:text-xl max-w-xl mb-6 text-purple-100">
                    Get hands-on with Toyota's latest technology features through an interactive demo at your local dealership.
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    asChild
                    className="rounded-md bg-white text-purple-700 hover:bg-purple-50"
                  >
                    <Link to="/tech-demo" className="flex items-center gap-2">
                      Schedule Tech Demo
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </div>
                
                <div className="relative w-full md:w-1/3 aspect-square">
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                  >
                    <div className="relative w-full h-full">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <defs>
                          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00D4FF" />
                            <stop offset="100%" stopColor="#9F7AFF" />
                          </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#techGradient)" strokeWidth="2" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="url(#techGradient)" strokeWidth="2" strokeDasharray="5,5" />
                        
                        {Array.from({ length: 12 }).map((_, i) => {
                          const angle = (i * 30) * Math.PI / 180;
                          const x = 100 + 60 * Math.cos(angle);
                          const y = 100 + 60 * Math.sin(angle);
                          return (
                            <motion.circle 
                              key={i} 
                              cx={x} 
                              cy={y} 
                              r="4" 
                              fill="white"
                              animate={{ opacity: [0.2, 0.8, 0.2] }}
                              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                            />
                          );
                        })}
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="h-20 w-20 bg-white rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Zap className="h-10 w-10 text-purple-600" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
