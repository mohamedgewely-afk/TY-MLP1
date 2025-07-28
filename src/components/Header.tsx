
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { label: "New Cars", href: "/new-cars" },
    { label: "Hybrid", href: "/hybrid" },
    { label: "Pre-Owned", href: "/pre-owned" },
    { label: "Offers", href: "/offers" },
    { label: "Service", href: "/service" },
    { label: "Configure", href: "/configure" },
  ];

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        // Scrolling down and past 100px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header 
      className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40"
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="toyota-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://dam.alfuttaim.com/wps/wcm/connect/a4d697d5-b0c5-4f79-a410-8266625f6b1f/brand-toyota-toyota-mark-black.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-a4d697d5-b0c5-4f79-a410-8266625f6b1f-p5aTs4r&mformat=true"
                  alt="Toyota Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TOYOTA</h1>
                <p className="text-xs text-toyota-red font-medium">Hybrid Experience</p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={`text-sm font-medium transition-colors hover:text-toyota-red ${
                    location.pathname === item.href 
                      ? "text-toyota-red" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => navigate("/test-drive")}
              className="hidden sm:inline-flex bg-toyota-red text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Test Drive
            </motion.button>
            <motion.button
              onClick={() => navigate("/enquire")}
              className="border border-toyota-red text-toyota-red px-3 py-2 rounded-lg hover:bg-toyota-red hover:text-white transition-colors text-xs font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enquire
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
