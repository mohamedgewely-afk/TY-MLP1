import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, ShieldCheck, User, Zap, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Persona } from "@/types/persona";
import { VehicleModel } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface VehicleRecommendationsProps {
  personaData: Persona | null;
  vehicles: VehicleModel[];
}

const VehicleRecommendations: React.FC<VehicleRecommendationsProps> = ({
  personaData,
  vehicles
}) => {
  const [perfectMatch, setPerfectMatch] = useState<VehicleModel | null>(null);
  const [recommendations, setRecommendations] = useState<VehicleModel[]>([]);
  
  useEffect(() => {
    if (personaData && vehicles.length > 0) {
      // Generate personalized vehicle recommendations
      const priorityCategories = personaData.recommendedVehicleTypes || [];
      const priorityFeatures = personaData.recommendedFeatures || [];
      
      // Calculate a match score for each vehicle
      const scoredVehicles = vehicles.map(vehicle => {
        let score = 0;
        
        // Category match (highest priority)
        if (priorityCategories.includes(vehicle.category)) {
          score += 50;
        }
        
        // Specific model match
        if (priorityCategories.some(cat => vehicle.name.toLowerCase().includes(cat.toLowerCase()))) {
          score += 30;
        }
        
        // Feature matches
        vehicle.features.forEach(feature => {
          if (priorityFeatures.some(pf => feature.toLowerCase().includes(pf.toLowerCase()))) {
            score += 10;
          }
        });
        
        // Persona-specific bonuses
        if (personaData.id === "family-first" && 
            (vehicle.name.includes("Highlander") || 
             vehicle.name.includes("Fortuner") ||
             vehicle.name.includes("Land Cruiser"))) {
          score += 20;
        } else if (personaData.id === "tech-enthusiast" && 
                  (vehicle.category === "Hybrid" || 
                   vehicle.category === "Electric")) {
          score += 20;
        } else if (personaData.id === "eco-warrior" && 
                  (vehicle.category === "Hybrid" || 
                   vehicle.category === "Electric")) {
          score += 40; // Extra emphasis for eco-warriors
        }
        
        return { vehicle, score };
      });
      
      // Sort by score
      scoredVehicles.sort((a, b) => b.score - a.score);
      
      // Set perfect match and recommendations
      if (scoredVehicles.length > 0) {
        setPerfectMatch(scoredVehicles[0].vehicle);
        setRecommendations(scoredVehicles.slice(1, 4).map(sv => sv.vehicle));
      }
    } else {
      setPerfectMatch(null);
      setRecommendations([]);
    }
  }, [personaData, vehicles]);
  
  if (!personaData || !perfectMatch) return null;
  
  // Generate persona-specific reasons
  const getPersonaReasons = () => {
    switch(personaData.id) {
      case "family-first":
        return [
          { icon: <ShieldCheck className="h-5 w-5 text-blue-500" />, text: "Enhanced safety features for your family" },
          { icon: <User className="h-5 w-5 text-blue-500" />, text: "Spacious interior for everyone's comfort" },
          { icon: <Check className="h-5 w-5 text-blue-500" />, text: "Reliable performance for daily family use" }
        ];
      case "tech-enthusiast":
        return [
          { icon: <Zap className="h-5 w-5 text-purple-500" />, text: "Cutting-edge technology and connectivity" },
          { icon: <Check className="h-5 w-5 text-purple-500" />, text: "Advanced driver assistance systems" },
          { icon: <ShieldCheck className="h-5 w-5 text-purple-500" />, text: "Latest entertainment and interface options" }
        ];
      case "eco-warrior":
        return [
          { icon: <Check className="h-5 w-5 text-green-600" />, text: "Exceptional fuel efficiency and lower emissions" },
          { icon: <Zap className="h-5 w-5 text-green-600" />, text: "Eco-friendly sustainable materials" },
          { icon: <ShieldCheck className="h-5 w-5 text-green-600" />, text: "Advanced hybrid technology" }
        ];
      case "urban-explorer":
        return [
          { icon: <Check className="h-5 w-5 text-slate-600" />, text: "Perfect size for city parking and navigation" },
          { icon: <ShieldCheck className="h-5 w-5 text-slate-600" />, text: "Fuel efficient for urban commutes" },
          { icon: <Zap className="h-5 w-5 text-slate-600" />, text: "Stylish design for city lifestyle" }
        ];
      case "business-commuter":
        return [
          { icon: <Check className="h-5 w-5 text-gray-700" />, text: "Professional appearance and comfort" },
          { icon: <ShieldCheck className="h-5 w-5 text-gray-700" />, text: "Advanced connectivity for business needs" },
          { icon: <DollarSign className="h-5 w-5 text-gray-700" />, text: "Excellent value retention" }
        ];
      case "weekend-adventurer":
        return [
          { icon: <Check className="h-5 w-5 text-orange-600" />, text: "Exceptional off-road capability" },
          { icon: <ShieldCheck className="h-5 w-5 text-orange-600" />, text: "Durable construction for adventure" },
          { icon: <Zap className="h-5 w-5 text-orange-600" />, text: "Versatile cargo options" }
        ];
      default:
        return [
          { icon: <Check className="h-5 w-5" />, text: "Perfect match for your needs" },
          { icon: <ShieldCheck className="h-5 w-5" />, text: "Toyota reliability and quality" },
          { icon: <Zap className="h-5 w-5" />, text: "Excellent performance" }
        ];
    }
  };

  const vehicleSlug = perfectMatch.id || perfectMatch.name.toLowerCase().replace(/\s+/g, '-');
  const reasons = getPersonaReasons();
  
  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="toyota-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: personaData.colorScheme.primary }}>
            Your Perfect Toyota Match
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Based on your {personaData.title} profile, we've found the ideal Toyota that matches your needs and preferences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Perfect match showcase */}
          <motion.div 
            className="lg:col-span-3 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className={cn(
              "overflow-hidden border-2 h-full",
              personaData ? `border-${personaData.colorScheme.primary}/20` : "border-toyota-red/20"
            )}>
              <div className="relative h-64 sm:h-72 md:h-80">
                <img 
                  src={perfectMatch.image} 
                  alt={perfectMatch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none px-3 py-1">
                    Perfect Match
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    "border-none px-3 py-1",
                    perfectMatch.category === "Hybrid" ? "bg-green-600" :
                    perfectMatch.category === "Electric" ? "bg-blue-600" :
                    perfectMatch.category === "GR Performance" ? "bg-red-600" :
                    "bg-toyota-red"
                  )}>
                    {perfectMatch.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{perfectMatch.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  From AED {perfectMatch.price.toLocaleString()}
                </p>
                
                <div className="space-y-4 mb-6">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">{reason.icon}</div>
                      <p>{reason.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {perfectMatch.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="bg-white dark:bg-gray-800">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    asChild
                    className="flex-1"
                    style={{
                      backgroundColor: personaData.colorScheme.primary,
                    }}
                  >
                    <Link to={`/vehicle/${vehicleSlug}`}>
                      See Details
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                    className="flex-1"
                    style={{
                      borderColor: personaData.colorScheme.primary,
                      color: personaData.colorScheme.primary
                    }}
                  >
                    <Link to={`/test-drive?model=${encodeURIComponent(perfectMatch.name)}`}>
                      Test Drive
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Other recommendations */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold" style={{ color: personaData.colorScheme.secondary }}>
                Other Recommendations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You might also be interested in:
              </p>
            </div>
            
            <div className="space-y-4 flex-1">
              {recommendations.map((vehicle, index) => {
                const slug = vehicle.id || vehicle.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <motion.div 
                    key={vehicle.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <Link to={`/vehicle/${slug}`} className="flex h-full">
                        <div className="w-1/3 sm:w-2/5">
                          <img 
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4 w-2/3 sm:w-3/5">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm sm:text-base">{vehicle.name}</h4>
                            <Badge className="text-xs" variant="outline">{vehicle.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">AED {vehicle.price.toLocaleString()}</p>
                          <div className="mt-2 hidden sm:block">
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {vehicle.features.slice(0, 2).join(" • ")}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-auto flex items-center text-sm" style={{ color: personaData.colorScheme.primary }}>
                            <span>View details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost"
                className="text-sm group"
                style={{ color: personaData.colorScheme.primary }}
              >
                <span>View all recommendations</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRecommendations;
