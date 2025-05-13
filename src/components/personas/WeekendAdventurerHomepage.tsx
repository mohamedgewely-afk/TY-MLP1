
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { VehicleModel } from "@/types/vehicle";
import { 
  Compass, 
  Mountain, 
  Heart, 
  ArrowRight,
  Map,
  CheckCircle,
  ChevronRight,
  Award,
  Video,
  Camera
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const WeekendAdventurerHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all-terrain");
  
  // Filter vehicles for adventure enthusiasts
  const adventureVehicles = vehicles.filter(v => 
    v.category === "SUV" || 
    v.category === "GR Performance" ||
    v.features.some(f => f.includes("Off") || f.includes("AWD") || f.includes("Terrain"))
  );

  // Categorize vehicles
  const allTerrainVehicles = adventureVehicles.filter(v => 
    v.features.some(f => f.includes("Terrain") || f.includes("Off"))
  ).slice(0, 6);
  
  const performanceVehicles = adventureVehicles.filter(v => 
    v.category === "GR Performance"
  ).slice(0, 6);

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your adventure vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0.5rem" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your adventure vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "0.5rem" },
      });
    }
  };

  return (
    <div className="adventure-pattern-bg min-h-screen">
      {/* Adventurous hero section with rugged terrain visuals */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/adventure-toyota.jpg"
            alt="Weekend Adventurer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30"></div>
          
          {/* Adventure terrain pattern overlay */}
          <div className="absolute inset-0 adventure-terrain-pattern"></div>
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 z-10">
          <motion.div className="max-w-4xl mx-auto">
            <motion.div 
              className="inline-block mb-6 bg-[#FFD54F] text-[#BF360C] px-4 py-2 rounded-lg font-bold text-sm"
              initial={{ opacity: 0, y: -20, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="flex items-center">
                <Mountain className="h-4 w-4 mr-2" /> ADVENTURE-READY VEHICLES
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg tracking-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textShadow: "2px 2px 4px rgba(191,54,12,0.5)" }}
            >
              Weekdays to Weekends, Road to Off-Road
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
            >
              Toyota vehicles built to take you farther, wherever your adventures lead
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-[#BF360C] hover:bg-[#a12e0a] text-white rounded-lg shadow-lg font-bold transform transition-all duration-300"
              >
                <Link to="/new-cars" className="flex items-center px-8 py-6 text-lg">
                  Find Adventure-Ready Models
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated mountains and adventure elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <motion.path 
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.15, pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              fill="#BF360C" fillOpacity="0.3"
              d="M0,256L48,250.7C96,245,192,235,288,224C384,213,480,203,576,202.7C672,203,768,213,864,229.3C960,245,1056,267,1152,261.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* Adventure vehicle categories */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-4 text-[#BF360C]">
              ADVENTURE-READY VEHICLES
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover Toyota models designed to handle any terrain and built for your weekend adventures
            </p>
          </motion.div>
          
          <Tabs defaultValue="all-terrain" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-orange-50 p-1 rounded-lg border border-orange-100">
                <TabsTrigger 
                  value="all-terrain" 
                  className={cn(
                    "rounded-md px-6 py-2 font-medium",
                    activeTab === "all-terrain" ? "bg-[#BF360C] text-white" : "text-[#BF360C]"
                  )}
                >
                  All-Terrain Vehicles
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className={cn(
                    "rounded-md px-6 py-2 font-medium",
                    activeTab === "performance" ? "bg-[#BF360C] text-white" : "text-[#BF360C]"
                  )}
                >
                  Performance Models
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all-terrain" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTerrainVehicles.map((vehicle, index) => (
                  <AdventureVehicleCard
                    key={vehicle.name}
                    vehicle={vehicle}
                    index={index}
                    isFavorite={favoriteVehicles.includes(vehicle.name)}
                    onFavoriteToggle={() => handleAddToFavorites(vehicle)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceVehicles.map((vehicle, index) => (
                  <AdventureVehicleCard
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
          
          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              className="border-2 border-[#BF360C] text-[#BF360C] hover:bg-[#BF360C] hover:text-white rounded-lg font-medium"
            >
              <Link to="/new-cars" className="flex items-center">
                View All Adventure Vehicles
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Adventure capabilities section */}
      <section className="py-16 bg-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="mountainPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 70 L25 30 L50 70 Z" fill="#BF360C" />
              <path d="M50 70 L75 20 L100 70 Z" fill="#BF360C" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#mountainPattern)" />
          </svg>
        </div>
        
        <div className="toyota-container relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold mb-4 text-[#BF360C]">
              BUILT FOR ANY ADVENTURE
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Toyota's adventure-ready vehicles come equipped with features designed for off-road capability and weekend exploration
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "All-Wheel Drive",
                description: "Enhanced traction on unpredictable surfaces and off-road trails",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C]"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="m8.5 14 7-4"/><path d="m8.5 10 7 4"/></svg>
              },
              {
                title: "High Ground Clearance",
                description: "Navigate rough terrain, rocks, and unpaved paths with confidence",
                icon: <Mountain className="h-8 w-8 text-[#BF360C]" />
              },
              {
                title: "Roof Rail Systems",
                description: "Easily transport bikes, kayaks, cargo boxes, and adventure gear",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C]"><rect width="18" height="10" x="3" y="8" rx="1"/><path d="M9 8V5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v3"/></svg>
              },
              {
                title: "Durable Interiors",
                description: "Water-resistant and easy-to-clean materials perfect for outdoor activities",
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C]"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-orange-100"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-center mb-2 text-[#BF360C]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adventure destinations showcase */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 bg-[#FFD54F] text-[#BF360C] rounded-md font-bold text-sm mb-4">
              DESTINATION INSPIRATION
            </span>
            <h2 className="text-3xl font-extrabold mb-4 text-[#BF360C]">
              WHERE WILL YOUR TOYOTA TAKE YOU?
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Discover breathtaking destinations perfectly suited for your adventure-ready Toyota
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Mountain Trails",
                description: "Conquer rugged mountain passes with confidence in your Toyota 4x4",
                image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "OFF-ROAD"
              },
              {
                title: "Coastal Adventures",
                description: "Drive along scenic coastal routes and discover hidden beaches",
                image: "https://images.unsplash.com/photo-1566024287286-457247b70310?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "SCENIC DRIVE"
              },
              {
                title: "Desert Exploration",
                description: "Navigate challenging dunes and experience unforgettable desert sunsets",
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                tag: "ADVENTURE"
              }
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <Badge className="self-start mb-2 bg-[#FFD54F] text-[#BF360C] hover:bg-[#FFD54F]">
                    {destination.tag}
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">{destination.title}</h3>
                  <p className="text-gray-200 mb-4">{destination.description}</p>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm"
                    className="self-start border-white text-white hover:bg-white hover:text-[#BF360C] rounded-lg"
                  >
                    <Link to="/destinations">
                      Explore More
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adventure community and stories */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 bg-[#BF360C] text-white rounded-md font-bold text-sm mb-4">
              ADVENTURE COMMUNITY
            </span>
            <h2 className="text-3xl font-extrabold mb-4">
              JOIN THE ADVENTURE MOVEMENT
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connect with fellow Toyota adventurers, share stories, and get inspired for your next journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-6 border-l-4 border-[#BF360C]"
            >
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-[#FFD54F] mr-3" />
                <h3 className="text-xl font-bold">Adventure Challenge</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Join our monthly adventure challenge and share photos of your Toyota in stunning locations. Win exclusive gear and get featured on our social channels.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="aspect-square rounded overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${1550000000000 + num * 1000}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`} 
                      alt={`Adventure photo ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="w-full rounded-lg bg-[#BF360C] hover:bg-[#a12e0a] text-white"
              >
                <Link to="/adventure-challenge">
                  Join the Challenge
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-lg p-6 border-l-4 border-[#BF360C]"
            >
              <div className="flex items-center mb-4">
                <Camera className="h-8 w-8 text-[#FFD54F] mr-3" />
                <h3 className="text-xl font-bold">Owner Stories</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    quote: "My Land Cruiser took me through the mountains of Ras Al Khaimah with zero issues. Best adventure companion ever!",
                    author: "Mohammed A.",
                    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  },
                  {
                    quote: "Weekend camping trips are so much easier with my Toyota 4Runner. Plenty of space for all our gear and handles any terrain.",
                    author: "Sarah L.",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                ].map((story, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={story.avatar} alt={story.author} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm mb-1">"{story.quote}"</p>
                      <p className="text-[#FFD54F] font-medium">{story.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-lg border-[#FFD54F] text-[#FFD54F] hover:bg-[#FFD54F] hover:text-[#BF360C]"
                >
                  <Link to="/owner-stories">
                    Share Your Story
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button
              asChild
              className="rounded-lg bg-[#BF360C] hover:bg-[#a12e0a] text-white"
            >
              <Link to="/adventures" className="flex items-center">
                <Map className="mr-2 h-5 w-5" />
                Find Group Adventures
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white text-white hover:bg-white hover:text-[#BF360C]"
            >
              <Link to="/adventure-videos" className="flex items-center">
                <Video className="mr-2 h-5 w-5" />
                Watch Adventure Videos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Adventure-ready checklist */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-[#FFD54F] text-[#BF360C] rounded-md font-bold text-sm mb-4">
                GET ADVENTURE READY
              </span>
              <h2 className="text-3xl font-extrabold mb-6 text-[#BF360C]">
                PREPARE FOR YOUR NEXT ADVENTURE
              </h2>
              
              <p className="text-gray-700 mb-8">
                Before heading off the beaten path, make sure your Toyota is prepared for the journey. Our adventure checklist ensures you're ready for anything the trail might throw at you.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Schedule a pre-adventure service check",
                  "Verify your tire pressure and tread depth",
                  "Test your vehicle's 4WD system if equipped",
                  "Pack essential recovery gear for off-road exploration",
                  "Update your navigation system with the latest maps"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#BF360C] mr-3 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="rounded-lg bg-[#BF360C] hover:bg-[#a12e0a] text-white"
                >
                  <Link to="/adventure-prep">
                    Complete Adventure Checklist
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="rounded-lg border-2 border-[#BF360C] text-[#BF360C] hover:bg-[#BF360C] hover:text-white"
                >
                  <Link to="/service" className="flex items-center">
                    Schedule Service
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1518128358718-8ff1fcaeb1b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Adventure Ready Toyota"
                    className="rounded-lg shadow-lg border-4 border-white"
                  />
                </div>
                <div className="absolute top-6 -right-6 bottom-6 -left-6 bg-[#FFD54F] rounded-lg -z-10"></div>
                <div className="absolute -top-3 -right-3 bg-white p-3 rounded-lg shadow-lg z-20 border-2 border-[#BF360C]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C]"><path d="M8 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z"/><path d="m8 14 8-8"/><path d="M8 8v6h6"/></svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Adventure test drive CTA */}
      <section className="py-16 bg-[#BF360C] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="tirePattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="20" fill="none" stroke="#FFD54F" strokeWidth="2" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="#FFD54F" strokeWidth="2" />
              <path d="M30 10 L30 50 M10 30 L50 30" stroke="#FFD54F" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tirePattern)" />
          </svg>
        </div>
        
        <div className="toyota-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 bg-[#FFD54F] text-[#BF360C] rounded-md font-bold text-sm mb-4"
            >
              EXPERIENCE THE CAPABILITY
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold mb-6"
            >
              TEST DRIVE ON REAL TERRAIN
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-100 mb-8"
            >
              Experience the true off-road capability of Toyota adventure vehicles with our special off-road test drive program. Test on real terrain, not just city streets.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-[#BF360C] hover:bg-gray-100 font-bold rounded-lg shadow-lg"
              >
                <Link to="/test-drive" className="flex items-center px-8 py-6 text-lg">
                  BOOK OFF-ROAD TEST DRIVE
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

// Adventure-styled vehicle card component
interface AdventureVehicleCardProps {
  vehicle: VehicleModel;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const AdventureVehicleCard: React.FC<AdventureVehicleCardProps> = ({ vehicle, index, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-orange-100"
    >
      <div className="relative">
        <img 
          src={vehicle.images[0]} 
          alt={vehicle.name}
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between">
          <Badge variant="secondary" className="bg-[#BF360C] text-white hover:bg-[#BF360C]">
            {vehicle.category}
          </Badge>
          <button
            onClick={onFavoriteToggle}
            className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className="h-4 w-4" 
              fill={isFavorite ? "#BF360C" : "none"} 
              stroke={isFavorite ? "#BF360C" : "currentColor"} 
            />
          </button>
        </div>
        
        {/* Adventure readiness score */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium text-sm">Adventure Ready</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill={i < (3 + Math.floor(Math.random() * 3)) ? "#FFD54F" : "none"}
                  stroke="#FFD54F" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-0.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-[#BF360C] mb-2">{vehicle.name}</h3>
        
        <div className="mb-4">
          {vehicle.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center text-sm text-gray-600 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD54F] mr-1.5" />
              {feature}
            </div>
          ))}
        </div>
        
        {/* Adventure capabilities */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="bg-orange-50 p-2 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C] mr-1"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
            <span className="font-medium">
              {vehicle.category === "SUV" ? "Excellent" : "Good"} Clearance
            </span>
          </div>
          <div className="bg-orange-50 p-2 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#BF360C] mr-1"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-8.48 8.48"/><path d="m7.76 7.76 8.48 8.48"/></svg>
            <span className="font-medium">
              {vehicle.category === "SUV" || vehicle.category === "GR Performance" ? "4WD Available" : "2WD"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-[#BF360C]">
            ${vehicle.price.toLocaleString()}
          </span>
          <Button
            asChild
            size="sm"
            className="rounded-lg bg-[#BF360C] hover:bg-[#a12e0a] text-white"
          >
            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
              Explore
            </Link>
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default WeekendAdventurerHomepage;
