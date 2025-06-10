
import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="toyota-container py-12">
        <div className="text-center space-y-6">
          {/* Toyota Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <svg 
                  width="60" 
                  height="60" 
                  viewBox="0 0 100 100" 
                  className="text-toyota-red"
                  fill="currentColor"
                >
                  <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="currentColor" strokeWidth="8"/>
                  <ellipse cx="50" cy="35" rx="20" ry="15" fill="none" stroke="currentColor" strokeWidth="6"/>
                  <ellipse cx="35" cy="50" rx="15" ry="20" fill="none" stroke="currentColor" strokeWidth="6"/>
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold">TOYOTA</h2>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <p className="text-xl font-medium text-gray-300">
              Let's Go Places
            </p>
            <p className="text-lg text-toyota-red font-semibold">
              Experience the Future of Hybrid Technology
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-gray-400 leading-relaxed">
              Discover Toyota's innovative hybrid vehicles designed for a sustainable future. 
              With cutting-edge technology, exceptional fuel efficiency, and uncompromising safety, 
              we're leading the way towards cleaner, smarter mobility.
            </p>
          </motion.div>

          {/* Hybrid Technology Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 rounded-full">
              <span className="text-white font-semibold flex items-center">
                <span className="h-2 w-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Hybrid Technology Leader
              </span>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-gray-800"
          >
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Toyota Motor Corporation. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Built with sustainability in mind. Powered by innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
