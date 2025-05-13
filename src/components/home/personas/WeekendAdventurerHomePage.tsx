
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Mountain, Tent, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const WeekendAdventurerHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="adventure-pattern-bg overflow-hidden">
      {/* Hero Section with Adventure Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 adventure-terrain-pattern opacity-40"></div>
        
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 rounded-lg bg-orange-100 border border-dashed border-orange-300">
                <span className="text-orange-800 font-medium text-sm flex items-center">
                  <Compass className="mr-1 h-4 w-4" /> Weekend Explorer
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-800 adventure-text-shadow">
                <span className="block text-orange-600">Unleash Your</span>
                Weekend Spirit
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
                Toyota vehicles built for adventure, with rugged capability and versatile features
                that take you from weekday commute to weekend exploration.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                    boxShadow: `0 10px 15px -3px ${personaData.colorScheme.primary}40`
                  }}
                  className="rounded-lg font-bold"
                >
                  <Link to="/adventure-vehicles" className="flex items-center gap-2">
                    Explore Adventure Vehicles
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-lg border-2 border-dashed border-orange-300 font-bold"
                >
                  <Link to="/off-road-features" className="flex items-center gap-2">
                    Off-Road Capability
                    <Mountain size={18} />
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
              <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-orange-300 shadow-2xl">
                <AspectRatio ratio={16/9} className="bg-orange-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/adventure-toyota.jpg" 
                    alt="Toyota Adventure Vehicle" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Adventure overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent mix-blend-multiply"></div>
                </AspectRatio>
                
                {/* Adventure floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-3 rounded-lg shadow-lg z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(191, 54, 12, 0.3)", "0 15px 25px -5px rgba(191, 54, 12, 0.5)", "0 10px 15px -3px rgba(191, 54, 12, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Mountain className="h-8 w-8 text-orange-600" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-orange-600 p-3 rounded-lg shadow-lg z-10"
                  animate={{ 
                    y: [0, 10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(191, 54, 12, 0.3)", "0 15px 25px -5px rgba(191, 54, 12, 0.5)", "0 10px 15px -3px rgba(191, 54, 12, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Compass className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              
              {/* Adventure capabilities floating badge */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white rounded-lg p-4 shadow-xl border-2 border-dashed border-orange-300"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-2 bg-orange-100 p-2 rounded-lg">
                    <Tent className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-orange-600 mb-1">Adventure Ready</h3>
                  <p className="text-sm text-gray-600">All-Terrain Capability</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Adventure Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M0,${50 + i * 5} Q${25 + i * 2},${40 + i * 3} ${50 + i},${60 - i * 2} T100,${45 + i * 2}`}
                  stroke="rgba(191, 54, 12, 0.4)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.2, duration: 2 }}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>
      
      {/* Adventure Features */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-800 adventure-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Built For <span className="text-orange-600">Adventure</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Toyota's adventure-ready vehicles are equipped with features that help you conquer challenging 
            terrain and reach your destination with confidence.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Mountain size={40} className="text-orange-600" />,
                title: "Off-Road Capability",
                description: "Advanced 4WD systems and rugged construction for tackling tough terrain and trails."
              },
              {
                icon: <Car size={40} className="text-orange-600" />,
                title: "Versatile Storage",
                description: "Flexible cargo solutions and roof rack options for all your adventure gear."
              },
              {
                icon: <Compass size={40} className="text-orange-600" />,
                title: "Adventure Technology",
                description: "Trail navigation systems and off-road monitoring for confident exploration."
              },
              {
                icon: <Tent size={40} className="text-orange-600" />,
                title: "Outdoor Comfort",
                description: "Durable, easy-clean interiors that transition from weekday to weekend adventures."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-md border-2 border-dashed border-orange-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-orange-50 p-4 rounded-lg mb-4 group-hover:bg-orange-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Adventure Vehicles */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-800 adventure-text-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Weekend <span className="text-orange-600">Warriors</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover Toyota vehicles designed to fuel your adventurous spirit and tackle any
            terrain with confidence and capability.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "4Runner",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/4runner-offroad.jpg",
                features: ["Rugged Body-on-Frame Construction", "Available 4WD with Active Traction Control", "Multi-terrain Select System"],
                price: "Starting at $38,805",
                terrain: "All-terrain mastery"
              },
              {
                name: "Tacoma",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/tacoma-adventure.jpg",
                features: ["TRD Off-Road Package", "Crawl Control System", "Multi-terrain Monitor"],
                price: "Starting at $27,950",
                terrain: "Trail blazer"
              },
              {
                name: "RAV4 Adventure",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/rav4-adventure-trail.jpg",
                features: ["Dynamic Torque Vectoring AWD", "8.6\" Ground Clearance", "Adventure-Ready Styling"],
                price: "Starting at $33,530",
                terrain: "Weekend ready"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-orange-200 group"
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
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    Adventure Series
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-orange-600">{vehicle.price}</span>
                    <div className="flex items-center bg-orange-100 px-2 py-1 rounded-md">
                      <Mountain className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-xs font-medium text-orange-800">{vehicle.terrain}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full rounded-lg font-bold"
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
              className="rounded-lg border-2 border-dashed border-orange-300 font-bold"
            >
              <Link to="/adventure-vehicles" className="flex items-center gap-2">
                View All Adventure Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Adventure Destinations */}
      <section className="py-16 bg-orange-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-orange-700 to-orange-500 rounded-lg p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full">
                {/* Mountain silhouettes */}
                <polygon points="0,100 20,60 40,80 60,40 80,60 100,20 100,100" fill="rgba(255,255,255,0.1)" />
                <polygon points="0,100 30,70 50,85 70,55 100,75 100,100" fill="rgba(255,255,255,0.15)" />
                <polygon points="0,100 10,80 30,90 50,70 70,85 90,65 100,70 100,100" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="md:w-2/3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 adventure-text-shadow">Weekend Getaway Guide</h2>
                <p className="text-lg mb-6 text-orange-50">
                  Your Toyota is the perfect companion for weekend adventures. Discover incredible destinations 
                  and trails that are just waiting to be explored.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: '🏔️', label: "Mountain Trails" },
                    { icon: '🏝️', label: "Coastal Drives" },
                    { icon: '🌲', label: "Forest Exploration" },
                  ].map((destination, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                      <div className="text-2xl mb-1">{destination.icon}</div>
                      <div className="text-sm font-bold text-white">{destination.label}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  asChild
                  className="rounded-lg bg-white text-orange-600 hover:bg-orange-50 font-bold"
                >
                  <Link to="/adventure-guide" className="flex items-center gap-2">
                    Get Your Adventure Guide
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
                      className="w-full h-full flex items-center justify-center"
                    >
                      {/* Circular frame */}
                      <motion.div 
                        className="relative w-64 h-64"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30" />
                        
                        {/* Adventure icons on the circle */}
                        {['⛰️', '🏕️', '🚙', '🧗‍♂️'].map((emoji, index) => {
                          const angle = (index * 90) * Math.PI / 180;
                          const radius = 120;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          
                          return (
                            <motion.div
                              key={index}
                              className="absolute top-1/2 left-1/2 h-12 w-12 -ml-6 -mt-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                              style={{ transform: `translate(${x}px, ${y}px)` }}
                              whileHover={{ scale: 1.2 }}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                            >
                              <span className="text-2xl">{emoji}</span>
                            </motion.div>
                          );
                        })}
                        
                        {/* Center compass icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="bg-white rounded-full h-24 w-24 flex items-center justify-center shadow-lg"
                            animate={{ rotate: [0, 15, 0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                          >
                            <Compass className="h-12 w-12 text-orange-600" />
                          </motion.div>
                        </div>
                      </motion.div>
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
