
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Clock, Phone, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const BusinessCommuterHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="business-pattern-bg overflow-hidden">
      {/* Hero Section with Professional Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <div className="inline-block mb-4 px-4 py-1 bg-gray-100 border-b-2 border-gray-300">
                <span className="text-gray-800 font-medium text-sm flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" /> Executive Class
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-gray-800">
                <span className="block text-gray-500">Elevate Your</span>
                Daily Commute
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Toyota vehicles with premium features designed for business professionals who 
                value comfort, efficiency, and sophistication.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                  }}
                  className="rounded-none border-b-2"
                >
                  <Link to="/executive-vehicles" className="flex items-center gap-2">
                    Explore Executive Vehicles
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-none border-b-2 border-gray-300"
                >
                  <Link to="/premium-features" className="flex items-center gap-2">
                    Premium Features
                    <Briefcase size={18} />
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
              <div className="relative overflow-hidden shadow-xl">
                <AspectRatio ratio={16/9} className="bg-gray-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/business-toyota.jpg" 
                    alt="Toyota Business Sedan" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Business overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                  
                  {/* Clean grid lines */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                      {Array.from({ length: 10 }).map((_, i) => (
                        <line 
                          key={i} 
                          x1={`${i * 10}%`} 
                          y1="0" 
                          x2={`${i * 10}%`} 
                          y2="100%" 
                          stroke="rgba(255,255,255,0.2)" 
                          strokeWidth="0.2" 
                        />
                      ))}
                    </svg>
                  </div>
                </AspectRatio>
                
                {/* Business elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-3 shadow-lg z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.1)", "0 15px 25px -5px rgba(0, 0, 0, 0.2)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Briefcase className="h-8 w-8 text-gray-700" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-gray-800 p-3 shadow-lg z-10"
                  animate={{ 
                    y: [0, 10, 0],
                    boxShadow: ["0 10px 15px -3px rgba(0, 0, 0, 0.2)", "0 15px 25px -5px rgba(0, 0, 0, 0.3)", "0 10px 15px -3px rgba(0, 0, 0, 0.2)"]
                  }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Clock className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              
              {/* Business stats floating badge */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white p-4 shadow-xl border-b-2 border-gray-300"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-start">
                  <h3 className="font-bold text-gray-800 mb-1">Executive Comfort</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Premium Commuting Experience</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <motion.div 
              className="w-full h-1 bg-gray-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
            />
            
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div 
                key={i}
                className="absolute w-full h-0.5 bg-gray-500"
                style={{ top: `${(i + 1) * 10}%` }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Premium Features */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-light text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Premium <span className="text-gray-500">Features</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Toyota's executive vehicles combine luxury with functionality, offering advanced features 
            that enhance your daily commute and business travel.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Briefcase size={40} className="text-gray-700" />,
                title: "Premium Comfort",
                description: "Luxurious interiors with quality materials and adjustable settings for a comfortable commute."
              },
              {
                icon: <Phone size={40} className="text-gray-700" />,
                title: "Connectivity",
                description: "Seamless mobile integration and wireless charging for uninterrupted productivity."
              },
              {
                icon: <Clock size={40} className="text-gray-700" />,
                title: "Efficient Performance",
                description: "Balanced power and efficiency for economical business travel and reduced downtime."
              },
              {
                icon: <Car size={40} className="text-gray-700" />,
                title: "Executive Styling",
                description: "Sophisticated design that makes a professional statement wherever you arrive."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 shadow-md border-b-2 border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-gray-50 p-4 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Executive Vehicles */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-light text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Executive <span className="text-gray-500">Fleet</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover Toyota's premium vehicles that combine sophistication, comfort, and efficiency
            for the discerning business professional.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Camry",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/camry-executive.jpg",
                features: ["Premium Interior", "Advanced Safety Suite", "Efficient Hybrid Option"],
                price: "Starting at $25,945",
                highlight: "The business standard"
              },
              {
                name: "Avalon",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/avalon-luxury.jpg",
                features: ["Premium JBL Audio", "Executive Comfort", "Advanced Driver Assistance"],
                price: "Starting at $36,825",
                highlight: "Flagship luxury"
              },
              {
                name: "Crown",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/crown-premium.jpg",
                features: ["Distinctive Styling", "Hybrid Max Powertrain", "Leather-Trimmed Interior"],
                price: "Starting at $39,950",
                highlight: "Modern executive appeal"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
                style={{ borderBottom: '2px solid #263238' }}
              >
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={vehicle.image} 
                      alt={`Toyota ${vehicle.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </AspectRatio>
                  <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 text-sm font-medium">
                    Executive Choice
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-1 h-8 bg-gray-300 mr-3"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">{vehicle.price}</span>
                    <div className="flex items-center bg-gray-100 px-2 py-1">
                      <Briefcase className="h-4 w-4 text-gray-700 mr-1" />
                      <span className="text-xs font-medium text-gray-800">{vehicle.highlight}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full rounded-none"
                    style={{ backgroundColor: personaData.colorScheme.primary }}
                    asChild
                  >
                    <Link to={`/vehicles/${vehicle.name.toLowerCase()}`}>
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
              className="rounded-none border-b-2 border-gray-300"
            >
              <Link to="/executive-vehicles" className="flex items-center gap-2">
                View All Executive Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Business Advantage */}
      <section className="py-16 bg-gray-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.5" />
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.line 
                    key={i} 
                    x1={`${i * 10}%`} 
                    y1="0" 
                    x2={`${i * 10}%`} 
                    y2="100%" 
                    stroke="white" 
                    strokeWidth="0.2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
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
                <h2 className="text-3xl md:text-4xl font-light mb-4">The Business Advantage</h2>
                <p className="text-lg mb-6 text-gray-200">
                  Toyota's executive vehicles offer the perfect balance of professional styling, 
                  comfort, efficiency, and reliability that business professionals demand.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "10%", label: "Lower Total Cost of Ownership" },
                    { value: "97%", label: "Reliability Rating" },
                    { value: "20%", label: "Higher Resale Value" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 p-4 border-b border-white/20">
                      <div className="text-2xl font-bold mb-1 text-white">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  asChild
                  className="bg-white text-gray-800 hover:bg-gray-100 rounded-none"
                >
                  <Link to="/business-concierge" className="flex items-center gap-2">
                    Schedule Executive Consultation
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
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      
                      {/* Ticking markers like a watch */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i * 30) * Math.PI / 180;
                        const x1 = 50 + 40 * Math.cos(angle);
                        const y1 = 50 + 40 * Math.sin(angle);
                        const x2 = 50 + 45 * Math.cos(angle);
                        const y2 = 50 + 45 * Math.sin(angle);
                        return (
                          <line 
                            key={i} 
                            x1={x1} 
                            y1={y1} 
                            x2={x2} 
                            y2={y2} 
                            stroke="white" 
                            strokeWidth={i % 3 === 0 ? "2" : "1"} 
                          />
                        );
                      })}
                    </svg>
                  </motion.div>
                  
                  {/* Business icons rotating */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                  >
                    {['💼', '⏱️', '📊', '🚗'].map((emoji, index) => {
                      const angle = (index * 90) * Math.PI / 180;
                      const radius = 60;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      
                      return (
                        <motion.div
                          key={index}
                          className="absolute top-1/2 left-1/2 h-12 w-12 -ml-6 -mt-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <span className="text-2xl">{emoji}</span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  
                  {/* Center business icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="bg-white rounded-full h-24 w-24 flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <Briefcase className="h-12 w-12 text-gray-800" />
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
