
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, MapPin, Phone, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: <Instagram className="h-6 w-6" />, href: "https://instagram.com/toyotauae", label: "Instagram" },
    { icon: <Facebook className="h-6 w-6" />, href: "https://facebook.com/toyotauae", label: "Facebook" },
    { icon: <Twitter className="h-6 w-6" />, href: "https://twitter.com/toyotauae", label: "Twitter" },
    { icon: <Youtube className="h-6 w-6" />, href: "https://youtube.com/toyotauae", label: "YouTube" },
    { icon: <Linkedin className="h-6 w-6" />, href: "https://linkedin.com/company/toyota-uae", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 border border-primary/30 rotate-45 animate-spin" 
               style={{ animationDuration: '20s' }} />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-blue-500/20 rotate-12 animate-spin"
               style={{ animationDuration: '25s' }} />
        </div>
      </div>

      <div className="toyota-container py-16 relative z-10">
        <div className="flex flex-col items-center space-y-12">
          {/* Toyota Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <img
                src="https://dam.alfuttaim.com/wps/wcm/connect/a4d697d5-b0c5-4f79-a410-8266625f6b1f/brand-toyota-toyota-mark-black.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-a4d697d5-b0c5-4f79-a410-8266625f6b1f-p5aTs4r&mformat=true"
                alt="Toyota Logo"
                className="h-16 w-auto relative z-10 filter invert"
              />
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mt-4">
              TOYOTA
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">
              Let's Go Places
            </p>
            <p className="text-gray-400 text-lg max-w-2xl">
              Driving innovation into the future of mobility
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-red-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                  
                  {/* Icon container */}
                  <div className="relative w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 group-hover:border-primary/50 transition-all duration-300">
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            viewport={{ once: true }}
          />

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-2"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Toyota Motor Corporation. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Engineered for Tomorrow • Built for Today
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
    </footer>
  );
};

export default Footer;
