
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Link } from "react-router-dom";
import { Users, Shield, Car, Heart, CalendarCheck, CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const FamilyFirstHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);

  // Filter vehicles for family-friendly options
  const familyVehicles = vehicles.filter(v => 
    v.category === "SUV" || 
    v.features.some(f => f.includes("Seating") || f.includes("Safety"))
  ).slice(0, 6);

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your favorites.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF" },
      });
    }
  };

  return (
    <div className="family-friendly-bg min-h-screen">
      {/* Enhanced Hero Section with graphic elements */}
      <section className="relative h-[80vh] overflow-hidden">
        {/* Background image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        >
          <img
            src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/section-05-family-suv-desktop.jpg"
            alt="Family SUV"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>
        </motion.div>

        {/* Decorative graphic elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Circular patterns representing family */}
          <motion.div 
            className="absolute top-[10%] right-[5%] w-[300px] h-[300px] border-4 border-dashed border-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          <motion.div 
            className="absolute bottom-[15%] left-[8%] w-[200px] h-[200px] border-2 border-white/15 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          
          <motion.div 
            className="absolute top-[30%] left-[15%] w-[150px] h-[150px] border-3 border-white/10 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          />
          
          {/* Animated lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M0,250 Q400,150 800,350 T1600,250"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.path
              d="M0,350 Q400,500 800,300 T1600,400"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </svg>
        </div>

        {/* Hero content with enhanced design */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <Badge className="bg-toyota-red text-white text-sm py-1 px-4 rounded-full">
                Family-First Experience
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-4 text-shadow-lg">
              Room for Everyone, Safety for All
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
              Discover Toyota vehicles built with your family's comfort and security in mind
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[#4A6DA7] hover:bg-[#3A5D97] text-white shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              <Link to="/vehicle/highlander" className="flex items-center gap-2 px-8 py-6 text-lg">
                Explore Family Vehicles
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Animated bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[50px]">
            <motion.path 
              d="M0,0 C150,90 350,0 500,50 C650,100 700,10 900,50 C1050,80 1150,20 1200,0 L1200,120 L0,120 Z" 
              fill="white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            />
          </svg>
        </div>
      </section>

      {/* Family-focused priorities section with enhanced design */}
      <section className="py-16 bg-white rounded-3xl mx-4 md:mx-8 -mt-10 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-center font-bold mb-12 text-[#4A6DA7]"
          >
            What Matters Most to Your Family
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Shield className="h-12 w-12 text-toyota-red" />, 
                title: "Safety First", 
                description: "Advanced safety features protect your loved ones on every journey",
                bgColor: "bg-red-50",
                animation: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 3 } }
              },
              { 
                icon: <Users className="h-12 w-12 text-[#4A6DA7]" />, 
                title: "Space for Everyone", 
                description: "Flexible seating configurations and ample room for the whole family",
                bgColor: "bg-blue-50",
                animation: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 3 } }
              },
              { 
                icon: <Car className="h-12 w-12 text-toyota-gray" />, 
                title: "Built to Last", 
                description: "Reliability you can depend on for years of family adventures",
                bgColor: "bg-gray-50",
                animation: { rotate: [-3, 3, -3], transition: { repeat: Infinity, duration: 3 } }
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${item.bgColor} p-8 rounded-2xl text-center shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <motion.div 
                  animate={item.animation}
                  className="mx-auto bg-white rounded-full p-4 mb-4 w-20 h-20 flex items-center justify-center shadow-md"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-serif font-bold mb-2 text-[#4A6DA7]">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family vehicles carousel with enhanced visuals */}
      <section className="py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 100 100" className="absolute w-full h-full">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="2" fill="#4A6DA7"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>

        <div className="toyota-container relative z-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-serif text-center font-bold mb-8 text-[#4A6DA7]"
          >
            Perfect Vehicles for Your Family
          </motion.h2>
          
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {familyVehicles.map((vehicle, index) => (
                <CarouselItem key={vehicle.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img 
                          src={vehicle.image} 
                          alt={vehicle.name}
                          className="w-full h-48 object-cover" 
                        />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <button
                            onClick={() => handleAddToFavorites(vehicle)}
                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Heart 
                              className="h-5 w-5" 
                              fill={favoriteVehicles.includes(vehicle.name) ? "#E50000" : "none"} 
                              stroke={favoriteVehicles.includes(vehicle.name) ? "#E50000" : "currentColor"} 
                            />
                          </button>
                        </motion.div>
                        
                        {/* Safety badge */}
                        {vehicle.features.some(f => f.includes("Safety")) && (
                          <Badge className="absolute bottom-3 left-3 bg-toyota-red text-white">
                            Top Safety Pick
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-serif font-bold mb-2">{vehicle.name}</h3>
                        <div className="flex items-center mb-3">
                          <Badge variant="outline" className="text-sm border-[#4A6DA7] text-[#4A6DA7] mr-2">
                            {vehicle.category}
                          </Badge>
                          {vehicle.features.some(f => f.includes("Seating")) && (
                            <Badge variant="outline" className="text-sm border-green-700 text-green-700">
                              7+ Seats
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-toyota-red">
                            ${vehicle.price.toLocaleString()}
                          </span>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-[#4A6DA7] text-[#4A6DA7] hover:bg-[#4A6DA7] hover:text-white"
                          >
                            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
          
          {/* View all button */}
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-2 border-[#4A6DA7] text-[#4A6DA7] hover:bg-[#4A6DA7] hover:text-white px-8"
            >
              <Link to="/new-cars">
                View All Family Vehicles
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Family help section with enhanced design */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="bg-[#F2C94C10] p-8 md:p-12 rounded-3xl border-2 border-[#F2C94C20] shadow-lg relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 -mt-16 -mr-16 bg-[#F2C94C10] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 -mb-12 -ml-12 bg-[#4A6DA710] rounded-full"></div>
            
            <div className="flex flex-col md:flex-row items-center relative z-10">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-serif font-bold mb-4 text-[#4A6DA7]"
                >
                  Need Help Finding Your Perfect Family Vehicle?
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg text-gray-600 mb-6"
                >
                  Our family vehicle specialists can help you find the perfect Toyota for your family's needs and budget.
                </motion.p>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild className="rounded-xl bg-toyota-red hover:bg-toyota-darkred text-white">
                    <Link to="/test-drive" className="flex items-center">
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Schedule Test Drive
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl border-[#4A6DA7] text-[#4A6DA7] hover:bg-[#4A6DA7] hover:text-white">
                    <Link to="/enquire" className="flex items-center">
                      <CircleHelp className="mr-2 h-5 w-5" />
                      Ask a Question
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A6DA7" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#F2C94C" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M25,-34.6C33.9,-30.4,43.5,-26.5,49.3,-19C55.1,-11.5,57.1,-0.5,54.8,9.4C52.5,19.3,45.9,28.1,37.4,33.8C29,39.5,18.7,42.1,8,44.7C-2.8,47.4,-13.9,50.1,-23,47.4C-32.1,44.7,-39.1,36.5,-42.8,27.1C-46.5,17.8,-47,7.1,-46.2,-3.5C-45.5,-14.2,-43.5,-24.7,-37.8,-30.9C-32,-37.1,-22.5,-39,-14,-37.3C-5.6,-35.6,2,-39.4,8.8,-38.9C15.7,-38.4,22.8,-33.6,25,-34.6Z"
                      transform="translate(100 100)"
                      fill="url(#gradient)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </svg>
                  
                  <img 
                    src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Family specialist" 
                    className="w-full h-auto rounded-full border-4 border-white shadow-lg relative z-10"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FamilyFirstHomepage;
