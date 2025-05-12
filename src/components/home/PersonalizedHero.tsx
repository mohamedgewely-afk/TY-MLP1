
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/contexts/PersonaContext";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PersonalizedHero: React.FC = () => {
  const { personaData, isTransitioning } = usePersona();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  useEffect(() => {
    if (personaData) {
      // Preload the background image
      const img = new Image();
      img.src = personaData.backgroundImage;
      img.onload = () => setIsImageLoaded(true);
    }
  }, [personaData]);
  
  if (!personaData) return null;

  const getAnimation = (style: string) => {
    switch (style) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.8 }
        };
      case "slide":
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
          transition: { duration: 0.8 }
        };
      case "zoom":
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
          transition: { duration: 0.8 }
        };
      case "bounce":
        return {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 100, opacity: 0 },
          transition: { type: "spring", stiffness: 100, damping: 10 }
        };
      case "flip":
        return {
          initial: { rotateY: 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
          transition: { duration: 0.8 }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.8 }
        };
    }
  };

  const animationProps = getAnimation(personaData.animationStyle);

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={personaData.id}
        className="relative h-[80vh] md:h-[70vh] overflow-hidden"
        style={{ backgroundColor: personaData.colorScheme.primary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isImageLoaded ? 1 : 0,
            filter: "blur(0px)"
          }}
          transition={{ duration: 2 }}
          className="w-full h-full"
        >
          <img
            src={personaData.backgroundImage}
            alt={personaData.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
          />
        </motion.div>
        
        {/* Decorative elements based on persona */}
        <div className="absolute inset-0 z-[11] pointer-events-none">
          {personaData.id === "tech-enthusiast" && (
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-10 h-full">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="border-r border-white/30 h-full"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </div>
              <div className="grid grid-rows-10 w-full absolute top-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="border-b border-white/30 w-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {personaData.id === "eco-warrior" && (
            <div className="absolute inset-0 opacity-30">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "40%" }}
                transition={{ delay: 0.5, duration: 1.5 }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 rounded-full bg-white/30"
                    style={{
                      left: `${(i * 10) % 100}%`,
                      width: `${20 + Math.random() * 60}px`,
                      height: `${100 + Math.random() * 200}px`,
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ 
                      delay: 0.5 + i * 0.1, 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: Math.random() * 5
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}
          
          {personaData.id === "family-first" && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full border-[20px] border-dashed border-white/30" />
            </motion.div>
          )}
          
          {personaData.id === "weekend-adventurer" && (
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.path
                    key={i}
                    d={`M0,${50 + i * 5} Q${25 + i * 2},${40 + i * 3} ${50 + i},${60 - i * 2} T100,${45 + i * 2}`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.2, duration: 2 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}
        </div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              {...animationProps}
              className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg"
              style={{ 
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {personaData.headlineText}
            </motion.h1>
            
            <motion.p 
              {...animationProps}
              transition={{ ...animationProps.transition, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
            >
              {personaData.subheadlineText}
            </motion.p>
            
            <motion.div
              {...animationProps}
              transition={{ ...animationProps.transition, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: personaData.colorScheme.accent,
                  boxShadow: `0 10px 25px -5px ${personaData.colorScheme.accent}80` 
                }}
              >
                <Link to="/new-cars" className="flex items-center gap-2 px-8 py-6 text-lg">
                  {personaData.ctaText}
                  <ArrowRight className="h-5 w-5 ml-1 animate-pulse" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonalizedHero;
