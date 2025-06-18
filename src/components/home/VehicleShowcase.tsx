
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

const PersonaCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}> = ({ title, icon, selected, onClick }) => (
  <div
    className={`
      flex flex-col items-center justify-center p-4 rounded-xl shadow-md
      ${selected 
        ? "bg-toyota-red/10 border-toyota-red border-2" 
        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}
      hover:shadow-lg transition-all duration-300 cursor-pointer
    `}
    onClick={onClick}
  >
    <div className={`
      p-3 rounded-full mb-2
      ${selected 
        ? "bg-toyota-red text-white" 
        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}
    `}>
      {icon}
    </div>
    <span className="text-sm font-medium">{title}</span>
  </div>
);

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
      className="py-12 bg-white dark:bg-gray-900 relative overflow-hidden"
      style={{ backgroundColor: styles.backgroundColor }}
    >
      {/* Enhanced decorative background elements based on persona */}
      {personaData && personaData.id === "tech-enthusiast" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-10 h-full">
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
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

      <div className="toyota-container">
        {/* Animated heading with persona-specific styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3 inline-block"
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

        {/* Category pills */}
        {categories.length > 1 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categories.map((category) => (
              <motion.div
                key={category}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer flex items-center ${
                  personaData ? `border border-${personaData.colorScheme.primary}/20 text-${personaData.colorScheme.primary}` : 
                  "border border-toyota-red/20 text-toyota-red"
                }`}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                {category}
                <span className="ml-1.5 opacity-60 text-xs">{vehicles.filter(v => v.category === category).length}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={title} // Forces re-render on title change (e.g., when persona changes)
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
              <CarouselContent className="-ml-4">
                {vehicles.map((vehicle, index) => (
                  <CarouselItem key={vehicle.id || vehicle.name} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full"
                          >
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
                          </motion.div>
                        </div>
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </Carousel>
          </motion.div>
        </AnimatePresence>

        {/* View all vehicles CTA */}
        {vehicles.length > 4 && (
          <motion.div 
            className="mt-8 text-center"
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
                className="group"
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
