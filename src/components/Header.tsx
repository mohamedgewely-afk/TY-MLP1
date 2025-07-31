import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageCircle, Phone, Globe } from "lucide-react";

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

  if (isMobile) {
    return (
      <motion.header 
        className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          {/* Left - Toyota Logo */}
          <motion.div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              <img 
                src="https://dam.alfuttaim.com/wps/wcm/connect/a4d697d5-b0c5-4f79-a410-8266625f6b1f/brand-toyota-toyota-mark-black.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-a4d697d5-b0c5-4f79-a410-8266625f6b1f-p5aTs4r&mformat=true"
                alt="Toyota Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
          </motion.div>

          {/* Right - Action buttons with luxury glass morphism design */}
          <div className="flex items-center space-x-3">
            {/* WhatsApp Button */}
            <motion.button
              onClick={() => window.open('https://wa.me/971XXXXXXX', '_blank')}
              className="relative p-3 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/70 border border-green-200/30 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              <MessageCircle className="h-5 w-5 text-green-600 relative z-10" />
            </motion.button>

            {/* Phone Button */}
            <motion.button
              onClick={() => window.open('tel:+971XXXXXXX', '_self')}
              className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/30 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              <Phone className="h-5 w-5 text-blue-600 relative z-10" />
            </motion.button>

            {/* Language Switcher */}
            <motion.button
              className="relative p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/70 border border-gray-200/30 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
              <Globe className="h-5 w-5 text-gray-600 relative z-10" />
            </motion.button>

            {/* Enquire Button - Premium CTA */}
            <motion.button
              onClick={() => navigate("/enquire")}
              className="relative bg-gradient-to-r from-toyota-red to-red-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
              <span className="relative z-10">Enquire</span>
            </motion.button>
          </div>
        </div>
      </motion.header>
    );
  }

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
