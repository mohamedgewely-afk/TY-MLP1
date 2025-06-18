
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/toyotauae", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/toyotauae", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/toyotauae", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/toyotauae", label: "YouTube" },
    { icon: Linkedin, href: "https://linkedin.com/company/toyota-uae", label: "LinkedIn" },
  ];

  return (
    <motion.footer 
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(235, 10, 30, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(235, 10, 30, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }}
        />
        
        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-transparent blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="toyota-container relative z-10 py-16 lg:py-20">
        <div className="text-center space-y-12">
          {/* Toyota Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-2xl opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative bg-white rounded-full p-8 lg:p-10 shadow-2xl">
                <img 
                  src="https://dam.alfuttaim.com/wps/wcm/connect/a4d697d5-b0c5-4f79-a410-8266625f6b1f/brand-toyota-toyota-mark-black.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-a4d697d5-b0c5-4f79-a410-8266625f6b1f-p5aTs4r&mformat=true"
                  alt="Toyota Logo"
                  className="w-16 h-16 lg:w-20 lg:h-20"
                />
              </div>
            </div>
          </motion.div>

          {/* Brand Text */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
              TOYOTA
            </h2>
            <p className="text-xl lg:text-2xl font-medium text-gray-300">
              Let's Go Places
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400 font-semibold mb-4">
              Experience the Future of Hybrid Technology
            </p>
            <p className="text-gray-400 leading-relaxed">
              Pioneering sustainable mobility with cutting-edge innovation, 
              exceptional performance, and uncompromising safety for generations to come.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center space-x-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                  <social.icon className="h-6 w-6 text-white group-hover:text-primary transition-colors duration-300" />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Toyota Motor Corporation. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Powered by Innovation • Built for Tomorrow
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
