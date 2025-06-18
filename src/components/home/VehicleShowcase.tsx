
import React, { useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import VehicleCard from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { TestTube, Mail, Phone, ChevronRight, Filter } from "lucide-react";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
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

  // Filtered categories
  const categories = [...new Set(vehicles.map(v => v.category))];

  return (
    <section 
      ref={ref}
      className="py-8 md:py-12 lg:py-16 bg-white dark:bg-gray-900 relative overflow-hidden"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      {/* Enhanced decorative background elements based on persona */}
      {personaData && personaData.id === "tech-enthusiast" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 md:grid-cols-10 h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div 
                key={i}
                className="border-r border-purple-500/30 h-full"
                initial={{ height: 0 }}
                animate={isInView ? { height: "100%" } : { height: 0 }}
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
          animate={isInView ? { opacity: 0.1 } : { opacity: 0 }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-green-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
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

      <div className="toyota-container">
        {/* Responsive heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-8 md:mb-12 text-center"
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 inline-block"
            style={{ color: styles.headingColor }}
            animate={personaData?.id === "tech-enthusiast" ? { 
              textShadow: ["0 0 0px rgba(107,56,251,0)", "0 0 10px rgba(107,56,251,0.3)", "0 0 0px rgba(107,56,251,0)"]
            } : {}}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {title}
          </motion.h2>
          
          {personaData && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
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

        {/* Responsive category pills */}
        {categories.length > 1 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium cursor-pointer flex items-center ${
                  personaData ? `border border-${personaData.colorScheme.primary}/20 text-${personaData.colorScheme.primary}` : 
                  "border border-toyota-red/20 text-toyota-red"
                }`}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5 opacity-70" />
                {category}
                <span className="ml-1 md:ml-1.5 opacity-60 text-xs">{vehicles.filter(v => v.category === category).length}</span>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {vehicles.map((vehicle, index) => (
                  <CarouselItem key={vehicle.id || vehicle.name} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <VehicleCard
                      vehicle={vehicle}
                      isCompared={compareList.includes(vehicle.name)}
                      onCompare={() => onCompare(vehicle)}
                      onQuickView={() => onQuickView(vehicle)}
                      delay={index}
                      actionButtons={
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full"
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs md:text-sm" 
                              asChild
                              style={personaData ? {
                                borderColor: `${personaData.colorScheme.primary}40`,
                                color: personaData.colorScheme.primary,
                              } : {}}
                            >
                              <a href={`/test-drive?model=${encodeURIComponent(vehicle.name)}`}>
                                <TestTube className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Test Drive
                              </a>
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full"
                          >
                            <Button 
                              size="sm" 
                              className="w-full text-xs md:text-sm" 
                              asChild
                              style={personaData ? {
                                backgroundColor: personaData.colorScheme.accent,
                                boxShadow: `0 4px 12px -2px ${personaData.colorScheme.accent}40`,
                              } : {}}
                            >
                              <a href={`/enquire?model=${encodeURIComponent(vehicle.name)}`}>
                                <Mail className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Enquire
                              </a>
                            </Button>
                          </motion.div>
                        </div>
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 hidden sm:flex" />
              <CarouselNext className="right-1 hidden sm:flex" />
            </Carousel>
          </motion.div>
        </AnimatePresence>

        {/* Responsive View all CTA */}
        {vehicles.length > 4 && (
          <motion.div 
            className="mt-6 md:mt-8 text-center px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="ghost" 
                size="lg"
                className="group text-sm md:text-base"
                style={personaData ? {
                  color: personaData.colorScheme.primary,
                } : {}}
              >
                <span>View all {vehicles.length} vehicles</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VehicleShowcase;
