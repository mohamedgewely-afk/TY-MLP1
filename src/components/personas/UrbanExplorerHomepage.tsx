
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { VehicleModel } from "@/types/vehicle";
import { 
  MapPin, 
  Compass, 
  Coffee, 
  ChevronRight, 
  Heart,
  ArrowRight,
  Map,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const UrbanExplorerHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);
  
  // Filter vehicles for urban explorers
  const urbanVehicles = vehicles.filter(v => 
    v.category === "Sedan" || 
    v.category === "Hybrid" ||
    v.features.some(f => f.includes("Compact") || f.includes("City"))
  );

  // Categorize vehicles
  const compactVehicles = urbanVehicles.filter(v => v.features.some(f => f.includes("Compact"))).slice(0, 4);
  const cityVehicles = urbanVehicles.filter(v => v.features.some(f => f.includes("City"))).slice(0, 4);
  const hybridVehicles = urbanVehicles.filter(v => v.category === "Hybrid").slice(0, 4);

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your urban vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0.25rem" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your urban vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0.25rem" },
      });
    }
  };

  // Urban cityscape-inspired design with sharp angles and cityscapes
  return (
    <div className="urban-pattern-bg min-h-screen">
      {/* Urban skyline hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/urban-toyota.jpg"
            alt="Urban Explorer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* City grid overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.rect
                  key={i}
                  x={Math.random() * 90}
                  y={Math.random() * 90}
                  width={5 + Math.random() * 10}
                  height={5 + Math.random() * 20}
                  fill="rgba(255,255,255,0.03)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                />
              ))}
            </svg>
          </div>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6 z-10">
          <motion.div className="max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block mb-6 bg-[#FF5722] px-3 py-1 text-white uppercase tracking-widest text-sm font-bold"
            >
              City-ready vehicles
            </motion.span>
            
            <motion.h1
              className="text-4xl md:text-6xl uppercase font-bold mb-4 text-shadow-lg tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Smart, Silent, City-Ready
            </motion.h1>
            
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Navigate city streets with confidence in a Toyota designed for urban life
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#455A64] hover:bg-[#354a54] text-white rounded-none shadow-lg border-b-2 border-[#FF5722] transform transition-all duration-300 hover:scale-105"
              >
                <Link to="/new-cars" className="flex items-center px-8 py-6 text-lg">
                  VIEW CITY-SMART MODELS
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Urban vehicle categories with tabs */}
      <section className="py-16 bg-white border-t-4 border-[#FF5722]">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl uppercase font-bold tracking-wide mb-10 text-[#455A64] text-center"
          >
            PERFECT FOR CITY LIVING
          </motion.h2>
          
          <Tabs defaultValue="compact" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger 
                  value="compact" 
                  className="data-[state=active]:bg-[#455A64] data-[state=active]:text-white px-6"
                >
                  Compact
                </TabsTrigger>
                <TabsTrigger 
                  value="city" 
                  className="data-[state=active]:bg-[#455A64] data-[state=active]:text-white px-6"
                >
                  City-Smart
                </TabsTrigger>
                <TabsTrigger 
                  value="hybrid" 
                  className="data-[state=active]:bg-[#455A64] data-[state=active]:text-white px-6"
                >
                  Hybrid
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="compact" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {compactVehicles.map((vehicle, index) => (
                  <UrbanVehicleCard
                    key={vehicle.name}
                    vehicle={vehicle}
                    index={index}
                    isFavorite={favoriteVehicles.includes(vehicle.name)}
                    onFavoriteToggle={() => handleAddToFavorites(vehicle)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="city" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cityVehicles.map((vehicle, index) => (
                  <UrbanVehicleCard
                    key={vehicle.name}
                    vehicle={vehicle}
                    index={index}
                    isFavorite={favoriteVehicles.includes(vehicle.name)}
                    onFavoriteToggle={() => handleAddToFavorites(vehicle)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hybrid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {hybridVehicles.map((vehicle, index) => (
                  <UrbanVehicleCard
                    key={vehicle.name}
                    vehicle={vehicle}
                    index={index}
                    isFavorite={favoriteVehicles.includes(vehicle.name)}
                    onFavoriteToggle={() => handleAddToFavorites(vehicle)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none border-[#455A64] text-[#455A64] hover:bg-[#455A64] hover:text-white border-b-2"
            >
              <Link to="/new-cars" className="flex items-center">
                VIEW ALL URBAN VEHICLES
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Urban lifestyle grid */}
      <section className="py-16 bg-gray-100">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl uppercase font-bold tracking-wide mb-3 text-[#455A64]">
              YOUR CITY, YOUR STYLE
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Toyota vehicles designed to match your urban lifestyle, whether you're navigating busy streets or finding the perfect parking spot
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "EASY PARKING",
                description: "Compact designs and advanced parking assistance make tight city spots a breeze",
                image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                color: "#455A64"
              },
              {
                title: "NAVIGATE WITH EASE",
                description: "Integrated navigation systems designed specifically for complex urban environments",
                image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                color: "#FF5722"
              },
              {
                title: "URBAN EFFICIENCY",
                description: "Excellent fuel economy and hybrid options perfect for stop-and-go city traffic",
                image: "https://images.unsplash.com/photo-1503410781609-75b1d892dd28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                color: "#455A64"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.description}</p>
                  <div className="mt-4">
                    <span className="inline-block h-1 w-12" style={{ backgroundColor: item.color }}></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* City maps and locations */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl uppercase font-bold tracking-wide mb-6 text-[#455A64] border-b-2 border-[#FF5722] pb-3 inline-block">
                CITY NAVIGATION PERFECTED
              </h2>
              
              <p className="text-gray-600 mb-8">
                Toyota's urban models come equipped with advanced navigation systems specifically designed for city driving. Find the fastest routes, avoid traffic jams, and discover the best parking spots in your area.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "REAL-TIME TRAFFIC UPDATES",
                    icon: <MapPin className="h-5 w-5 text-[#FF5722]" />
                  },
                  {
                    title: "SMART PARKING ASSISTANCE",
                    icon: <Coffee className="h-5 w-5 text-[#FF5722]" />
                  },
                  {
                    title: "POINT-OF-INTEREST DISCOVERY",
                    icon: <Compass className="h-5 w-5 text-[#FF5722]" />
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-10 w-10 rounded-none bg-[#455A64] flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#455A64] mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">
                        {index === 0 && "Stay ahead of congestion with live traffic updates and intelligent rerouting."}
                        {index === 1 && "Find available parking spaces and navigate to them with turn-by-turn directions."}
                        {index === 2 && "Discover restaurants, cafes, and attractions in unfamiliar urban areas."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button
                  asChild
                  className="bg-[#455A64] hover:bg-[#354a54] text-white rounded-none border-b-2 border-[#FF5722]"
                >
                  <Link to="/technology/navigation" className="flex items-center">
                    <Map className="mr-2 h-5 w-5" />
                    EXPLORE NAVIGATION FEATURES
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-dashed border-[#455A64] opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="City Map Navigation"
                  className="w-full shadow-lg border-8 border-white"
                />
                
                {/* Interactive map markers */}
                {[
                  { top: "20%", left: "30%" },
                  { top: "40%", left: "70%" },
                  { top: "70%", left: "50%" }
                ].map((position, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-4 h-4 rounded-full bg-[#FF5722] shadow-lg z-10"
                    style={{ top: position.top, left: position.left }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      delay: index * 0.5
                    }}
                  >
                    <span className="absolute -inset-1 rounded-full border-2 border-[#FF5722] animate-ping opacity-75"></span>
                  </motion.div>
                ))}
                
                {/* Car marker */}
                <motion.div
                  className="absolute top-[45%] left-[20%] bg-[#455A64] p-1 rounded-sm shadow-lg z-20"
                  animate={{
                    x: [0, 100, 200, 150],
                    y: [0, -20, 50, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 17H5V11.5H19V17Z" fill="white"/>
                    <path d="M17.5 6L15.1 10H8.9L6.5 6H17.5Z" fill="white"/>
                    <path d="M6.5 18C7.33 18 8 17.33 8 16.5C8 15.67 7.33 15 6.5 15C5.67 15 5 15.67 5 16.5C5 17.33 5.67 18 6.5 18Z" fill="white"/>
                    <path d="M17.5 18C18.33 18 19 17.33 19 16.5C19 15.67 18.33 15 17.5 15C16.67 15 16 15.67 16 16.5C16 17.33 16.67 18 17.5 18Z" fill="white"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Urban lifestyle testimonials */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 bg-[#FF5722] text-white uppercase tracking-widest text-sm font-bold mb-4">
              Customer Stories
            </span>
            <h2 className="text-3xl uppercase font-bold tracking-wide mb-3">
              URBAN EXPLORERS LOVE TOYOTA
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from real city drivers who navigate urban environments with Toyota vehicles
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "My Corolla handles city parking like a dream. I can fit into spaces that my friends' cars could never manage.",
                author: "Alex M., Los Angeles",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              },
              {
                quote: "The hybrid system is perfect for city driving. I barely use any gas in stop-and-go traffic, and the regenerative braking is fantastic.",
                author: "Mia K., Chicago",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 border-l-4 border-[#FF5722]"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-none overflow-hidden border-2 border-[#FF5722]">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#FF5722] text-[#FF5722]" />
                      ))}
                    </div>
                    <p className="italic text-gray-300 mb-4">"{testimonial.quote}"</p>
                    <p className="font-bold text-[#FF5722]">{testimonial.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urban test drive CTA */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#455A64] opacity-10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={i}
                x1={i * 10} y1="0" x2={i * 10} y2="100"
                stroke="rgba(69, 90, 100, 0.1)"
                strokeWidth="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 1 }}
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={i + 10}
                x1="0" y1={i * 10} x2="100" y2={i * 10}
                stroke="rgba(69, 90, 100, 0.1)"
                strokeWidth="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 1 }}
              />
            ))}
          </svg>
        </div>
        
        <div className="toyota-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl uppercase font-bold tracking-wide mb-6 text-[#455A64]"
            >
              TEST DRIVE THE CITY LIFE
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 mb-8"
            >
              Experience how Toyota vehicles handle real urban environments. Schedule a test drive through city streets, parking challenges, and tight corners.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#FF5722] hover:bg-[#F4511E] text-white shadow-lg"
              >
                <Link to="/test-drive" className="flex items-center px-8 py-6 text-lg">
                  SCHEDULE URBAN TEST DRIVE
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Urban-styled vehicle card component
interface UrbanVehicleCardProps {
  vehicle: VehicleModel;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const UrbanVehicleCard: React.FC<UrbanVehicleCardProps> = ({ vehicle, index, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white shadow-md group"
    >
      <div className="relative overflow-hidden">
        <img 
          src={vehicle.images[0]} 
          alt={vehicle.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center">
          <Badge variant="secondary" className="bg-[#455A64] text-white hover:bg-[#455A64] rounded-none">
            {vehicle.category}
          </Badge>
          <button
            onClick={onFavoriteToggle}
            className="bg-white p-1.5 shadow-md hover:shadow-lg transition-all duration-300"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className="h-4 w-4" 
              fill={isFavorite ? "#FF5722" : "none"} 
              stroke={isFavorite ? "#FF5722" : "currentColor"} 
            />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#455A64]">{vehicle.name}</h3>
        
        <div className="mt-2 mb-3">
          {vehicle.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center text-sm text-gray-500 mb-1">
              <span className="h-1 w-1 bg-[#FF5722] mr-2" />
              {feature}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
          <span className="font-bold text-[#455A64]">
            ${vehicle.price.toLocaleString()}
          </span>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-[#455A64] hover:text-[#FF5722] p-0"
          >
            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center">
              DETAILS
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UrbanExplorerHomepage;
