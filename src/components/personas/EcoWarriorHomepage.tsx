import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { VehicleModel } from "@/types/vehicle";
import { 
  Leaf, 
  Wind, 
  Share2, 
  BarChart3,
  Info,
  ArrowRight,
  Heart
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const EcoWarriorHomepage: React.FC = () => {
  const { personaData } = usePersona();
  const { toast } = useToast();
  const [favoriteVehicles, setFavoriteVehicles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("popular");

  // Filter vehicles for eco-friendly options
  const hybridVehicles = vehicles.filter(v => 
    v.category === "Hybrid" || 
    v.features.some(f => f.includes("Eco") || f.includes("Hybrid") || f.includes("Efficiency"))
  );

  // Get top 6 eco vehicles
  const popularEcoVehicles = [...hybridVehicles].sort(() => 0.5 - Math.random()).slice(0, 6);
  
  // Get most efficient vehicles
  const mostEfficientVehicles = [...hybridVehicles].sort((a, b) => {
    // Mock efficiency calculation based on features
    const aEfficiency = a.features.filter(f => 
      f.includes("Eco") || f.includes("Hybrid") || f.includes("Efficiency")
    ).length;
    const bEfficiency = b.features.filter(f => 
      f.includes("Eco") || f.includes("Hybrid") || f.includes("Efficiency")
    ).length;
    return bEfficiency - aEfficiency;
  }).slice(0, 6);

  const handleAddToFavorites = (vehicle: VehicleModel) => {
    if (favoriteVehicles.includes(vehicle.name)) {
      setFavoriteVehicles(favoriteVehicles.filter(v => v !== vehicle.name));
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your eco-friendly vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "1rem" },
      });
    } else {
      setFavoriteVehicles([...favoriteVehicles, vehicle.name]);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your eco-friendly vehicles list.`,
        variant: "default",
        style: { backgroundColor: personaData?.colorScheme.primary, color: "#FFF", borderRadius: "1rem" },
      });
    }
  };

  return (
    <div className="eco-pattern-bg min-h-screen">
      {/* Natural, organic hero section */}
      <section className="relative h-[80vh] overflow-hidden">
        <motion.div
          initial={{ filter: "brightness(0.8)" }}
          animate={{ filter: "brightness(1)" }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img
            src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/eco-toyota.jpg"
            alt="Eco Warrior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20"></div>
          
          {/* Eco-themed wave patterns */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "30%" }}
            transition={{ delay: 0.5, duration: 1.5 }}
          >
            <div className="eco-wave-pattern"></div>
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6 z-10">
          <motion.div className="max-w-4xl mx-auto">
            <motion.div 
              className="inline-block mb-4 bg-[#CDDC39] text-black px-3 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center text-sm font-medium">
                <Leaf className="h-4 w-4 mr-1" /> ECO-FRIENDLY DRIVING
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-light mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              Drive Green, Live Clean
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              Toyota hybrids helping you reduce your carbon footprint without compromise
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-[#2E7D32] hover:bg-[#1d6e21] text-white rounded-full shadow-lg border-2 border-white/20 transform transition-all duration-300 hover:scale-105"
              >
                <Link to="/vehicle/corolla-hybrid" className="flex items-center gap-2 px-8 py-6 text-lg">
                  Explore Eco Options
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Environmental impact section */}
      <section className="py-16 bg-white rounded-t-3xl -mt-10 relative z-10">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-12 text-[#2E7D32]"
          >
            Your Environmental Impact
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                label: "CO₂ Reduction", 
                value: 40, 
                description: "Reduce your carbon emissions by up to 40% compared to conventional vehicles",
                icon: <Wind className="h-8 w-8 text-[#81C784]" />
              },
              { 
                label: "Fuel Efficiency", 
                value: 60, 
                description: "Enjoy up to 60% better fuel efficiency with Toyota's hybrid technology",
                icon: <BarChart3 className="h-8 w-8 text-[#81C784]" />
              },
              { 
                label: "Eco-Materials", 
                value: 25, 
                description: "Toyota hybrids use up to 25% sustainable materials in manufacturing",
                icon: <Leaf className="h-8 w-8 text-[#81C784]" />
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-green-50 rounded-2xl p-6 text-center border border-green-100"
              >
                <div className="mx-auto bg-white rounded-full p-4 mb-4 w-16 h-16 flex items-center justify-center shadow-sm border border-green-50">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 text-[#2E7D32]">{stat.label}</h3>
                <div className="mb-3">
                  <Progress value={stat.value} className="h-2.5 bg-green-100" />
                  <p className="mt-2 font-medium text-2xl text-[#2E7D32]">{stat.value}%</p>
                </div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eco-friendly vehicles section */}
      <section className="py-16 bg-green-50">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-6 text-[#2E7D32]"
          >
            Sustainable Toyota Vehicles
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 text-gray-600"
          >
            Explore our range of environmentally-conscious vehicles designed to reduce emissions while maintaining the performance you expect
          </motion.p>
          
          <Tabs defaultValue="popular" className="mb-8" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="bg-green-100 rounded-full p-1">
                <TabsTrigger 
                  value="popular" 
                  className={cn(
                    "rounded-full text-sm px-6",
                    activeTab === "popular" ? "bg-[#2E7D32] text-white" : "text-gray-700"
                  )}
                >
                  Popular Models
                </TabsTrigger>
                <TabsTrigger 
                  value="efficient" 
                  className={cn(
                    "rounded-full text-sm px-6",
                    activeTab === "efficient" ? "bg-[#2E7D32] text-white" : "text-gray-700"
                  )}
                >
                  Most Efficient
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="popular" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularEcoVehicles.map((vehicle, index) => (
                  <VehicleCard 
                    key={vehicle.name}
                    vehicle={vehicle}
                    index={index}
                    isFavorite={favoriteVehicles.includes(vehicle.name)}
                    onFavoriteToggle={() => handleAddToFavorites(vehicle)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="efficient" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mostEfficientVehicles.map((vehicle, index) => (
                  <VehicleCard 
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
              size="lg"
              className="rounded-full border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
            >
              <Link to="/new-cars" className="flex items-center gap-2">
                View All Eco-Friendly Vehicles
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sustainability section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-12 text-[#2E7D32]"
          >
            Toyota's Commitment to Sustainability
          </motion.h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://www.toyota.ae/-/media/Images/Toyota/Sections-homepage/Desktop/eco-commitment.jpg" 
                alt="Toyota Sustainability"
                className="rounded-2xl shadow-md w-full"
              />
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-medium mb-4 text-[#2E7D32]">Beyond Zero Emissions</h3>
              <p className="text-gray-600 mb-6">
                Toyota is committed to achieving carbon neutrality by 2050. Our hybrid technology is just the beginning of our journey toward a more sustainable automotive future.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "25+ years of hybrid technology leadership",
                  "Over 15 million hybrid vehicles sold worldwide",
                  "Continuous innovation in battery and hydrogen fuel cell technology",
                  "Eco-friendly manufacturing practices across all facilities"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-[#CDDC39] flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E7D32]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              
              <Button 
                asChild
                className="rounded-full bg-[#2E7D32] hover:bg-[#1d6e21] text-white"
              >
                <Link to="/sustainability" className="flex items-center">
                  Learn About Our Initiatives
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Environmental tips carousel */}
      <section className="py-16 bg-[#2E7D3210]">
        <div className="toyota-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-6 text-[#2E7D32]"
          >
            Eco-Driving Tips
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 text-gray-600"
          >
            Maximize your vehicle's efficiency and minimize your environmental impact with these simple driving tips
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Smooth Acceleration",
                description: "Gentle acceleration uses less fuel and reduces emissions. Aim for smooth, gradual speed changes.",
                icon: <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E7D32]"><path d="M12 20V4"></path><path d="M5 11l7-7 7 7"></path></svg>
                </motion.div>
              },
              {
                title: "Maintain Proper Tire Pressure",
                description: "Check your tire pressure monthly. Properly inflated tires improve fuel efficiency by up to 3%.",
                icon: <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E7D32]"><circle cx="12" cy="12" r="10"></circle></svg>
                </motion.div>
              },
              {
                title: "Limit Idling",
                description: "Turn off your engine when stopped for more than 60 seconds to save fuel and reduce emissions.",
                icon: <motion.div 
                  animate={{ rotate: [0, 360] }} 
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E7D32]"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                </motion.div>
              },
              {
                title: "Regular Maintenance",
                description: "Keep your vehicle well-maintained with regular service checks for optimal efficiency.",
                icon: <motion.div 
                  animate={{ rotate: [0, 10, 0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2E7D32]"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </motion.div>
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 text-center h-full border border-green-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-medium mb-3 text-[#2E7D32]">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join eco community section */}
      <section className="py-16 bg-white">
        <div className="toyota-container">
          <div className="bg-[#CDDC3920] p-8 md:p-12 rounded-2xl border border-[#CDDC3950]">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-3xl font-light mb-4 text-[#2E7D32]"
                >
                  Join Our Eco-Conscious Community
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-gray-600 mb-6"
                >
                  Connect with other environmentally-conscious Toyota owners, share tips, and stay updated on the latest sustainable driving practices.
                </motion.p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    asChild
                    className="rounded-full bg-[#2E7D32] hover:bg-[#1d6e21] text-white"
                  >
                    <Link to="/community" className="flex items-center">
                      <Share2 className="mr-2 h-5 w-5" />
                      Join Community
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline" 
                    className="rounded-full border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
                  >
                    <Link to="/eco-events" className="flex items-center">
                      <Info className="mr-2 h-5 w-5" />
                      Eco Events
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-[#2E7D32] rounded-full opacity-10 animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1535483102974-fa1e64d0ca86?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                    alt="Eco Community"
                    className="relative z-10 rounded-full shadow-lg border-4 border-white"
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

// Vehicle card component with eco-friendly styling
interface VehicleCardProps {
  vehicle: VehicleModel;
  index: number;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-green-100"
    >
      <div className="relative">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-48 object-cover" 
        />
        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Heart 
            className="h-5 w-5" 
            fill={isFavorite ? "#2E7D32" : "none"} 
            stroke={isFavorite ? "#2E7D32" : "currentColor"} 
          />
        </button>
        
        {/* Eco badge for hybrid vehicles */}
        {vehicle.category === "Hybrid" && (
          <span className="absolute top-3 left-3 bg-[#CDDC39] text-[#2E7D32] px-2 py-1 rounded-full text-xs font-medium shadow-md">
            Hybrid
          </span>
        )}
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-medium mb-2">{vehicle.name}</h3>
        
        {/* Mock efficiency metrics */}
        <div className="flex items-center justify-between mb-3 bg-green-50 rounded-full px-3 py-1.5">
          <span className="flex items-center text-[#2E7D32] text-sm">
            <Leaf className="h-4 w-4 mr-1" />
            Eco Score
          </span>
          <span className="font-medium text-sm">
            {70 + Math.floor(Math.random() * 25)}%
          </span>
        </div>
        
        <div className="mb-3">
          {vehicle.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center text-sm text-gray-600 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#81C784] mr-1.5" />
              {feature}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-[#2E7D32]">
            ${vehicle.price.toLocaleString()}
          </span>
          <Button
            asChild
            size="sm"
            className="bg-[#2E7D32] hover:bg-[#1d6e21] rounded-full text-white"
          >
            <Link to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}>
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default EcoWarriorHomepage;
