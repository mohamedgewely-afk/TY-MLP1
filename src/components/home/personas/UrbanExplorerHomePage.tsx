
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Compass, Coffee, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const UrbanExplorerHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="urban-pattern-bg overflow-hidden">
      {/* Hero Section with Urban Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 rounded-md bg-slate-100 border border-slate-200">
                <span className="text-slate-800 font-medium text-sm flex items-center">
                  <MapPin className="mr-1 h-4 w-4" /> Urban Mobility
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 uppercase tracking-wide">
                <span className="block text-slate-600">Navigate The</span>
                Urban Landscape
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
                Toyota vehicles designed for city life, with nimble handling, compact dimensions,
                and tech that makes navigating urban environments effortless.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                    boxShadow: `0 10px 15px -3px ${personaData.colorScheme.primary}40`
                  }}
                  className="rounded-none border-b-2 border-orange-400"
                >
                  <Link to="/city-vehicles" className="flex items-center gap-2">
                    Explore City Vehicles
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-none border-b-2 border-slate-400"
                >
                  <Link to="/city-driving-features" className="flex items-center gap-2">
                    Urban Features
                    <MapPin size={18} />
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
              <div className="relative rounded-none overflow-hidden border-0 shadow-xl">
                <AspectRatio ratio={16/9} className="bg-slate-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/urban-toyota.jpg" 
                    alt="Toyota Urban Vehicle" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Urban overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-8 opacity-20">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="border-r border-white/30 h-full" />
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-8 opacity-20">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="border-b border-white/30 w-full" />
                    ))}
                  </div>
                </AspectRatio>
                
                {/* Urban floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-3 rounded-md shadow-lg z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(69, 90, 100, 0.3)", "0 15px 25px -5px rgba(69, 90, 100, 0.5)", "0 10px 15px -3px rgba(69, 90, 100, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Compass className="h-8 w-8 text-slate-600" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-orange-500 p-3 rounded-md shadow-lg z-10"
                  animate={{ 
                    y: [0, 10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(255, 87, 34, 0.3)", "0 15px 25px -5px rgba(255, 87, 34, 0.5)", "0 10px 15px -3px rgba(255, 87, 34, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <MapPin className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              
              {/* Urban living floating badge */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white rounded-none p-4 shadow-xl border-l-4 border-orange-500"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-center mb-2">
                    <Coffee className="h-5 w-5 text-slate-600 mr-2" />
                    <h3 className="font-bold text-slate-800">City Smart</h3>
                  </div>
                  <p className="text-sm text-gray-600">Compact & Nimble</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Urban Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.rect
                  key={i}
                  x={Math.random() * 90}
                  y={Math.random() * 90}
                  width={5 + Math.random() * 10}
                  height={5 + Math.random() * 20}
                  fill="rgba(100,120,140,0.3)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>
      
      {/* Urban Advantages */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 uppercase tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Made For <span className="text-orange-500">City Life</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Toyota's urban vehicles are packed with features that make navigating busy city streets
            and tight parking spaces a breeze.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin size={40} className="text-slate-600" />,
                title: "Easy Parking",
                description: "Compact dimensions and advanced parking sensors make squeezing into tight spots effortless."
              },
              {
                icon: <Car size={40} className="text-slate-600" />,
                title: "Nimble Handling",
                description: "Responsive steering and tight turning radius for navigating narrow streets and traffic."
              },
              {
                icon: <Compass size={40} className="text-slate-600" />,
                title: "Smart Navigation",
                description: "Intelligent GPS with real-time traffic and urban points of interest."
              },
              {
                icon: <Coffee size={40} className="text-slate-600" />,
                title: "Urban Comfort",
                description: "Premium interiors designed for comfortable daily commutes and weekend adventures."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 shadow-md border-0 flex flex-col hover:shadow-lg transition-shadow duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                style={{ borderBottom: '4px solid #FF5722' }}
              >
                <div className="bg-slate-50 p-4 mb-4 group-hover:bg-slate-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Urban Vehicles */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 uppercase tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Urban <span className="text-orange-500">Fleet</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover Toyota vehicles perfectly suited for city driving, with efficiency,
            maneuverability, and urban-ready features.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Yaris",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/yaris-city-car.jpg",
                features: ["Compact & Nimble", "City-Friendly MPG", "Smart Parking Assist"],
                price: "Starting at $18,555",
                highlight: "Perfect for tight spots"
              },
              {
                name: "Corolla Hatchback",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/corolla-hatchback.jpg",
                features: ["Dynamic Handling", "Sporty Design", "Apple CarPlay Integration"],
                price: "Starting at $22,815",
                highlight: "Urban style icon"
              },
              {
                name: "C-HR",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/c-hr-crossover.jpg",
                features: ["Elevated Seating Position", "Distinctive Design", "Advanced Safety"],
                price: "Starting at $24,280",
                highlight: "Stand out in the city"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white overflow-hidden shadow-lg group relative"
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
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-sm font-medium">
                    City Explorer
                  </div>
                </div>
                
                <div className="p-6 border-l-4 border-orange-500">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-orange-500 mr-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-700">{vehicle.price}</span>
                    <div className="flex items-center bg-slate-100 px-2 py-1">
                      <MapPin className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-xs font-medium text-slate-800">{vehicle.highlight}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
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
              className="rounded-none border-b-2 border-slate-400"
            >
              <Link to="/city-vehicles" className="flex items-center gap-2">
                View All City Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Urban Lifestyle */}
      <section className="py-16 bg-slate-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full">
                {/* Stylized city skyline */}
                {Array.from({ length: 10 }).map((_, i) => {
                  const width = 5 + Math.random() * 10;
                  const height = 30 + Math.random() * 50;
                  const x = i * 10;
                  return (
                    <motion.rect
                      key={i}
                      x={`${x}%`}
                      y={`${100 - height}%`}
                      width={`${width}%`}
                      height={`${height}%`}
                      fill="rgba(255,255,255,0.1)"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="md:w-2/3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white uppercase tracking-wide">Urban Lifestyle</h2>
                <p className="text-lg mb-6 text-slate-100">
                  Whether it's navigating busy downtown streets, finding the coolest new spots, or escaping 
                  for a weekend adventure, your Toyota is your perfect urban companion.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "5 min", label: "Average Parking Time" },
                    { value: "32 mpg", label: "City Fuel Economy" },
                    { value: "60%", label: "Less Stress in Traffic" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 p-4">
                      <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                      <div className="text-sm text-slate-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  asChild
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Link to="/city-test-drive" className="flex items-center gap-2">
                    Schedule Urban Test Drive
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                className="md:w-1/3"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative aspect-square">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="relative w-80 h-80"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    >
                      {/* City locations orbiting */}
                      {Array.from({ length: 8 }).map((_, index) => {
                        const angle = (index * 45) * Math.PI / 180;
                        const radius = 120;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        return (
                          <motion.div
                            key={index}
                            className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            whileHover={{ scale: 1.2 }}
                          >
                            {index % 4 === 0 && <Coffee className="h-6 w-6 text-slate-600" />}
                            {index % 4 === 1 && <MapPin className="h-6 w-6 text-orange-500" />}
                            {index % 4 === 2 && <Compass className="h-6 w-6 text-slate-600" />}
                            {index % 4 === 3 && <Car className="h-6 w-6 text-slate-600" />}
                          </motion.div>
                        );
                      })}
                      
                      {/* Center city icon */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <motion.div 
                          className="flex items-center justify-center h-20 w-20 bg-white rounded-full shadow-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <span className="text-4xl">🌆</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
