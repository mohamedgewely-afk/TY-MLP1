
import React from "react";
import { motion } from "framer-motion";
import VehicleCard from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { TestTube, Mail, Phone, ChevronRight } from "lucide-react";
import { Persona } from "@/types/persona";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VehicleShowcaseProps {
  title: string;
  vehicles: VehicleModel[];
  compareList: string[];
  onCompare: (vehicle: VehicleModel) => void;
  onQuickView: (vehicle: VehicleModel) => void;
  personaData?: Persona | null;
}

const VehicleShowcase: React.FC<VehicleShowcaseProps> = ({
  title,
  vehicles,
  compareList,
  onCompare,
  onQuickView,
  personaData,
}) => {
  // Animation variants for cards
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  // Get persona-specific styles
  const getPersonaStyles = () => {
    if (!personaData) return {};
    
    return {
      backgroundColor: personaData.id === "eco-warrior" 
        ? "rgba(46, 125, 50, 0.03)" 
        : personaData.id === "tech-enthusiast" 
          ? "rgba(107, 56, 251, 0.03)"
          : "transparent",
      headingColor: personaData.colorScheme.primary,
      buttonStyle: personaData.id === "tech-enthusiast" 
        ? "rounded-md border border-white/20 backdrop-blur-sm" 
        : personaData.id === "eco-warrior"
          ? "rounded-full" 
          : personaData.id === "family-first" 
            ? "rounded-xl"
            : "rounded-lg",
    };
  };

  const styles = getPersonaStyles();

  return (
    <section 
      className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      {/* Decorative background elements based on persona */}
      {personaData && personaData.id === "tech-enthusiast" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-10 h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div 
                key={i}
                className="border-r border-purple-500/30 h-full"
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: i * 0.05, duration: 1 }}
              />
            ))}
          </div>
        </div>
      )}

      {personaData && personaData.id === "eco-warrior" && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>
      )}

      {personaData && personaData.id === "weekend-adventurer" && (
        <div className="absolute inset-0 bg-[url('/textures/terrain-pattern.png')] opacity-5 pointer-events-none" />
      )}

      <div className="toyota-container">
        {/* Animated heading with persona-specific styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 inline-block"
            style={{ color: styles.headingColor }}
            animate={{ 
              textShadow: personaData?.id === "tech-enthusiast" ? 
                ["0 0 0px rgba(107,56,251,0)", "0 0 10px rgba(107,56,251,0.3)", "0 0 0px rgba(107,56,251,0)"] : 
                undefined 
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {title}
          </motion.h2>
          
          {personaData && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              {personaData.id === "family-first" 
                ? "Safety and comfort for the whole family" 
                : personaData.id === "tech-enthusiast" 
                  ? "Advanced technology for modern driving"
                  : personaData.id === "eco-warrior"
                    ? "Sustainable options for eco-conscious drivers"
                    : personaData.id === "urban-explorer"
                      ? "Smart solutions for city driving"
                      : personaData.id === "business-commuter"
                        ? "Professional elegance for discerning drivers"
                        : "Vehicles built for your weekend adventures"}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {vehicles.map((vehicle, index) => (
                <CarouselItem key={vehicle.name} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
                    variants={cardVariants}
                    className="h-full"
                    whileHover={{ 
                      y: -5, 
                      transition: { duration: 0.2 } 
                    }}
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      isCompared={compareList.includes(vehicle.name)}
                      onCompare={() => onCompare(vehicle)}
                      onQuickView={() => onQuickView(vehicle)}
                      actionButtons={
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full" 
                            asChild
                            style={personaData ? {
                              borderColor: `${personaData.colorScheme.primary}40`,
                              color: personaData.colorScheme.primary,
                            } : {}}
                          >
                            <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                              <TestTube className="mr-1 h-4 w-4" /> Test Drive
                            </a>
                          </Button>
                          <Button 
                            size="sm" 
                            className="w-full" 
                            asChild
                            style={personaData ? {
                              backgroundColor: personaData.colorScheme.accent,
                              boxShadow: `0 4px 12px -2px ${personaData.colorScheme.accent}40`,
                            } : {}}
                          >
                            <a href={`/enquire?model=${encodeURIComponent(vehicle.name)}`}>
                              <Mail className="mr-1 h-4 w-4" /> Enquire
                            </a>
                          </Button>
                        </div>
                      }
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </motion.div>

        {/* View all vehicles CTA */}
        {vehicles.length > 4 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="ghost" 
              size="lg"
              className="group"
              style={personaData ? {
                color: personaData.colorScheme.primary,
              } : {}}
            >
              <span>View all {vehicles.length} vehicles</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VehicleShowcase;
