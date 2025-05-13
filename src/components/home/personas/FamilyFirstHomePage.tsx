
import React from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Car, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const FamilyFirstHomePage: React.FC = () => {
  const { personaData } = usePersona();
  
  if (!personaData) return null;

  return (
    <div className="family-friendly-bg overflow-hidden">
      {/* Hero Section with Family Focus */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="toyota-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-6 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">
                <span className="block text-toyota-red">Safety & Space</span>
                For Your Family Journey
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
                Toyota vehicles designed with your family in mind, featuring top safety ratings, 
                spacious interiors, and smart storage solutions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  style={{
                    backgroundColor: personaData.colorScheme.primary,
                    boxShadow: `0 10px 15px -3px ${personaData.colorScheme.primary}40`
                  }}
                  className="rounded-xl text-white"
                >
                  <Link to="/new-cars" className="flex items-center gap-2">
                    Explore Family Vehicles
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="rounded-xl border-2 border-blue-300"
                >
                  <Link to="/safety-features" className="flex items-center gap-2">
                    Safety Features
                    <ShieldCheck size={18} />
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
                <AspectRatio ratio={16/9} className="bg-blue-50">
                  <img 
                    src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/section-05-family-suv-desktop.jpg" 
                    alt="Toyota Family SUV" 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                
                {/* Decorative floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ShieldCheck className="h-8 w-8 text-blue-500" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white p-3 rounded-full shadow-lg z-10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  <Users className="h-8 w-8 text-blue-500" />
                </motion.div>
              </div>
              
              {/* Family-centric floating badge */}
              <motion.div 
                className="absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 bg-white rounded-xl p-4 shadow-xl border-2 border-blue-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                  <h3 className="font-bold text-blue-600">Family-Approved</h3>
                  <p className="text-sm text-gray-600">Top Safety Pick+</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="w-96 h-96 rounded-full bg-blue-300 blur-3xl absolute -top-10 -left-10"></div>
            <div className="w-96 h-96 rounded-full bg-yellow-200 blur-3xl absolute bottom-0 right-0"></div>
          </div>
        </div>
      </section>
      
      {/* Family Priority Features */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Designed For What Matters <span className="text-toyota-red">Most</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck size={40} className="text-blue-500" />,
                title: "Safety First, Always",
                description: "Advanced driver assistance systems and top safety ratings to protect your family."
              },
              {
                icon: <Users size={40} className="text-blue-500" />,
                title: "Room For Everyone",
                description: "Flexible seating configurations and generous legroom for growing families."
              },
              {
                icon: <Car size={40} className="text-blue-500" />,
                title: "Easy Loading Access",
                description: "Power sliding doors, hands-free liftgates, and child-friendly entry features."
              },
              {
                icon: <Heart size={40} className="text-blue-500" />,
                title: "Lasting Durability",
                description: "Built to withstand the demands of family life with quality craftsmanship."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Vehicle Recommendations */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Perfect For <span className="text-toyota-red">Family Adventures</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Discover Toyota vehicles designed with families in mind, offering the perfect blend of safety, space, and smart features.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Highlander",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/highlander-family-suv.jpg",
                features: ["7-8 Passenger Seating", "Top Safety Pick+", "Spacious Cargo Area"],
                price: "Starting at $35,405"
              },
              {
                name: "Sienna",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/sienna-minivan.jpg",
                features: ["Hybrid Efficiency", "Power Sliding Doors", "Family-Friendly Interior"],
                price: "Starting at $34,710"
              },
              {
                name: "RAV4",
                image: "https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/rav4-compact-suv.jpg",
                features: ["Versatile Space", "Advanced Safety", "All-Weather Capability"],
                price: "Starting at $26,975"
              },
            ].map((vehicle, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-100 group"
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
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Family Choice
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Toyota {vehicle.name}</h3>
                  <div className="mb-4">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="font-bold text-blue-600 mb-4">{vehicle.price}</div>
                  <Button 
                    className="w-full rounded-xl"
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
              className="rounded-xl border-2 border-blue-300"
            >
              <Link to="/new-cars" className="flex items-center gap-2">
                View All Family Vehicles
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Personalized CTA */}
      <section className="py-16 bg-blue-50">
        <div className="toyota-container">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 opacity-20">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M0,${40 + i * 5} Q${25 + i * 2},${60 - i * 3} ${50 + i},${40 + i * 2} T100,${55 - i * 2}`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    fill="none"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 10 + i * 2, repeatType: "mirror" }}
                  />
                ))}
              </svg>
            </div>
            
            <div className="relative z-10">
              <motion.div 
                className="flex flex-col md:flex-row items-center justify-between gap-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Schedule Your Family Test Drive</h2>
                  <p className="text-lg md:text-xl max-w-xl mb-6 text-blue-50">
                    Bring the whole family and experience the comfort, space, and safety of our Toyota vehicles firsthand.
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    asChild
                    className="rounded-xl bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Link to="/test-drive" className="flex items-center gap-2">
                      Book Family Test Drive
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </div>
                
                <div className="relative w-full md:w-1/3 aspect-square">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-5/6 h-5/6">
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-white/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      />
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                      >
                        {Array.from({ length: 6 }).map((_, index) => (
                          <motion.div
                            key={index}
                            className="absolute h-full w-8 flex items-center justify-center origin-bottom"
                            style={{ rotate: `${index * 60}deg` }}
                          >
                            <div className="h-1/4 w-full flex justify-center">
                              <div className="h-12 w-12 rounded-full bg-white/80 shadow-lg flex items-center justify-center">
                                {index === 0 && <ShieldCheck className="h-6 w-6 text-blue-500" />}
                                {index === 1 && <Users className="h-6 w-6 text-blue-500" />}
                                {index === 2 && <Car className="h-6 w-6 text-blue-500" />}
                                {index === 3 && <Heart className="h-6 w-6 text-blue-500" />}
                                {index === 4 && <ShieldCheck className="h-6 w-6 text-blue-500" />}
                                {index === 5 && <Users className="h-6 w-6 text-blue-500" />}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full h-3/5 w-3/5 flex items-center justify-center">
                          <div className="text-5xl">👨‍👩‍👧‍👦</div>
                        </div>
                      </div>
                    </div>
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
