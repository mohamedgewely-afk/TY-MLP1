
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sun, Wind, Droplet } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const EcoWarriorHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="eco-pattern-bg overflow-hidden">
      {/* Hero Section with Eco Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 eco-wave-pattern opacity-30"></div>
        
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-green-100 border border-green-200">
                <span className="text-green-800 font-medium text-sm flex items-center">
                  <Leaf className="mr-1 h-4 w-4" /> Sustainable Mobility
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                <span className="block text-green-600">Drive Green,</span>
                Live Responsibly
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
                Toyota's eco-friendly vehicles help you reduce your carbon footprint without 
                compromising on performance, comfort, or style.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                    boxShadow: `0 10px 15px -3px ${personaData.colorScheme.primary}40`
                  }}
                  className="rounded-full"
                >
                  <Link to="/hybrid-vehicles" className="flex items-center gap-2">
                    Explore Hybrid Vehicles
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-full border-2 border-green-300"
                >
                  <Link to="/environmental-commitment" className="flex items-center gap-2">
                    Our Green Promise
                    <Leaf size={18} />
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
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <AspectRatio ratio={16/9} className="bg-green-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/eco-toyota.jpg" 
                    alt="Toyota Eco Vehicle" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Nature overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                </AspectRatio>
                
                {/* Eco floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(46, 125, 50, 0.3)", "0 15px 25px -5px rgba(46, 125, 50, 0.5)", "0 10px 15px -3px rgba(46, 125, 50, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Leaf className="h-8 w-8 text-green-600" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-green-600 p-3 rounded-full shadow-lg z-10"
                  animate={{ 
                    y: [0, 10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(46, 125, 50, 0.3)", "0 15px 25px -5px rgba(46, 125, 50, 0.5)", "0 10px 15px -3px rgba(46, 125, 50, 0.3)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Sun className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              
              {/* Eco stats floating panel */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-xl border-2 border-green-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-2 bg-green-100 p-2 rounded-full">
                    <Droplet className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-green-600 mb-1">Eco-Friendly</h3>
                  <p className="text-sm text-gray-600">Up to 50% less CO₂</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Nature Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div 
              className="w-96 h-96 rounded-full bg-green-500 blur-3xl absolute -top-10 -left-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            ></motion.div>
            <motion.div 
              className="w-96 h-96 rounded-full bg-yellow-300 blur-3xl absolute bottom-0 right-0"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 8, delay: 4, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </div>
      </section>
      
      {/* Sustainability Features */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Sustainable <span className="text-green-600">Innovation</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Toyota's commitment to the environment goes beyond efficient engines. Discover 
            our holistic approach to eco-friendly transportation.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf size={40} className="text-green-600" />,
                title: "Hybrid Technology",
                description: "Intelligent systems that seamlessly switch between electric and gasoline power for optimal efficiency."
              },
              {
                icon: <Sun size={40} className="text-green-600" />,
                title: "Renewable Materials",
                description: "Eco-friendly materials and sustainable manufacturing processes that reduce environmental impact."
              },
              {
                icon: <Droplet size={40} className="text-green-600" />,
                title: "Reduced Emissions",
                description: "Advanced systems that significantly lower CO₂ and pollutant emissions during every drive."
              },
              {
                icon: <Wind size={40} className="text-green-600" />,
                title: "Energy Recovery",
                description: "Regenerative braking that captures energy and recharges the battery during deceleration."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-green-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Eco-Friendly Vehicles */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-green-600">Eco-Friendly</span> Lineup
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover Toyota's range of hybrid and electric vehicles that deliver exceptional 
            efficiency without compromising on performance.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Prius",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/prius-hybrid.jpg",
                features: ["58 MPG Combined", "Latest Hybrid Synergy Drive", "Advanced Aerodynamics"],
                price: "Starting at $27,450",
                emissions: "87g CO₂/km"
              },
              {
                name: "RAV4 Prime",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/rav4-prime-phev.jpg",
                features: ["42-mile Electric Range", "302 HP Combined Output", "Plug-in Hybrid System"],
                price: "Starting at $41,515",
                emissions: "22g CO₂/km"
              },
              {
                name: "bZ4X",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/bz4x-electric-suv.jpg",
                features: ["100% Electric", "Up to 252-mile Range", "Zero Emissions While Driving"],
                price: "Starting at $42,000",
                emissions: "0g CO₂/km"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100 group"
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
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Eco-Friendly
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-green-600">{vehicle.price}</span>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                      <Leaf className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs font-medium text-green-800">{vehicle.emissions}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full rounded-full"
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
              className="rounded-full border-2 border-green-300"
            >
              <Link to="/hybrid-vehicles" className="flex items-center gap-2">
                View All Eco-Friendly Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Environmental Commitment Section */}
      <section className="py-16 bg-green-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M0,${50 + i * 3} C${25},${60 - i * 2} ${50},${40 + i * 3} ${75},${60 - i * 2} S100,${50 + i}`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                    fill="none"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 10 + i, repeatType: "mirror" }}
                  />
                ))}
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <motion.div 
                className="md:w-2/3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Environmental Leadership</h2>
                <p className="text-lg mb-6 text-green-50">
                  Toyota is committed to achieving carbon neutrality by 2050. Our Environmental Challenge 2050 
                  sets ambitious goals for reducing our impact on the planet.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "50%", label: "CO₂ Reduction Goal" },
                    { value: "10M+", label: "Hybrids Sold Globally" },
                    { value: "2050", label: "Carbon Neutrality Target" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-green-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  asChild
                  className="rounded-full bg-white text-green-600 hover:bg-green-50"
                >
                  <Link to="/environmental-commitment" className="flex items-center gap-2">
                    Learn About Our Green Initiatives
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                className="md:w-1/3 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative aspect-square">
                  {/* Animated circular elements */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-white/20"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute inset-5 rounded-full border-4 border-dashed border-white/30"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
                  />
                  
                  {/* Center eco icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="bg-white rounded-full h-28 w-28 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <Leaf className="h-14 w-14 text-green-600" />
                    </motion.div>
                  </div>
                  
                  {/* Orbiting eco elements */}
                  {['🌱', '🌳', '💧', '☀️'].map((emoji, index) => {
                    const angle = (index * 90) * Math.PI / 180;
                    return (
                      <motion.div
                        key={index}
                        className="absolute flex items-center justify-center h-12 w-12 bg-white/90 rounded-full shadow-lg text-xl"
                        style={{
                          top: `calc(50% - 24px)`,
                          left: `calc(50% - 24px)`,
                        }}
                        animate={{
                          x: [Math.cos(angle) * 100, Math.cos(angle + Math.PI * 2) * 100],
                          y: [Math.sin(angle) * 100, Math.sin(angle + Math.PI * 2) * 100],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 20,
                          delay: index * 5,
                          ease: "linear"
                        }}
                      >
                        {emoji}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
