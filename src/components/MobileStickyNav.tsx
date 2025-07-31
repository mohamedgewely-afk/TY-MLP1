
import React from "react";
import { Home, Search, Plus, User, Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const MobileStickyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Compare", icon: Car, path: "/compare" },
    { name: "Add", icon: Plus, path: "/add" },
    { name: "Account", icon: User, path: "/account" },
  ];

  const handleNavigation = (item: { name: string; path: string }) => {
    navigate(item.path);
  };

  const isActive = (item: { name: string; path: string }) => {
    return item.path === location.pathname;
  };
  
  const { scrollDirection, scrollY } = useScrollDirection(10);
  
  // Determine if nav should be compact based on scroll direction and position
  const shouldShrink = scrollDirection === 'down' && scrollY > 100;

  return (
    <div className="md:hidden">
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50"
        animate={{
          height: shouldShrink ? "60px" : "80px",
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // Cinematic easing curve
        }}
      >
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center min-w-[44px] h-full px-2 transition-all duration-300 ${
                isActive(item) ? "text-toyota-red" : "text-gray-600"
              }`}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: shouldShrink ? 0.9 : 1,
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index * 0.02, // Staggered animation
              }}
            >
              <motion.div
                className="mb-1"
                animate={{
                  scale: shouldShrink ? 0.85 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <item.icon 
                  className={`${shouldShrink ? "h-4 w-4" : "h-5 w-5"} transition-all duration-300`} 
                />
              </motion.div>
              <motion.span
                className="text-xs font-medium"
                animate={{
                  opacity: shouldShrink ? 0 : 1,
                  scale: shouldShrink ? 0.8 : 1,
                  y: shouldShrink ? 8 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: shouldShrink ? 0 : 0.1,
                }}
              >
                {item.name}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileStickyNav;
