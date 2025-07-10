
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, ShoppingBag, ChevronLeft, ChevronRight, Battery, Truck, Settings, Star, Phone, X, Share2, MapPin, Tag, Calculator, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import PreOwnedCarousel from "./mobile-nav/PreOwnedCarousel";

interface MobileStickyNavProps {
  activeItem?: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ activeItem = "home" }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPreOwned, setShowPreOwned] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "vehicle", icon: Car, label: "Vehicles", path: "/vehicles" },
    { id: "preowned", icon: TrendingUp, label: "Pre-Owned", action: () => setShowPreOwned(true) },
    { id: "menu", icon: Menu, label: "Menu", action: () => setShowMenu(true) }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 px-2 py-2"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <motion.div key={item.id} className="flex-1">
                {item.path ? (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all",
                      isActive 
                        ? "text-toyota-red bg-red-50" 
                        : "text-gray-600 hover:text-toyota-red hover:bg-red-50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-toyota-red")} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className={cn(
                      "flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all w-full",
                      isActive 
                        ? "text-toyota-red bg-red-50" 
                        : "text-gray-600 hover:text-toyota-red hover:bg-red-50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-toyota-red")} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* Pre-Owned Carousel Modal */}
      <AnimatePresence>
        {showPreOwned && (
          <PreOwnedCarousel onClose={() => setShowPreOwned(false)} />
        )}
      </AnimatePresence>

      {/* Menu Modal */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Car, label: "Test Drive", path: "/test-drive" },
                  { icon: Calculator, label: "Finance", path: "/finance" },
                  { icon: Phone, label: "Contact", path: "/contact" },
                  { icon: MapPin, label: "Dealers", path: "/dealers" },
                  { icon: Settings, label: "Service", path: "/service" },
                  { icon: Star, label: "Reviews", path: "/reviews" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="flex flex-col items-center space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Icon className="h-6 w-6 text-toyota-red" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileStickyNav;
