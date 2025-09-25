
import React from "react";
import { Link } from "react-router-dom";
import { Car, Battery, Star, Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { vehicles } from "@/data/vehicles";

const categories = [
  { id: "sedan", name: "Sedan", icon: <Car className="h-5 w-5" /> },
  { id: "suv", name: "SUV", icon: <Truck className="h-5 w-5" /> },
  { id: "hybrid", name: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { id: "gr-performance", name: "GR Performance", icon: <Star className="h-5 w-5" /> },
];

// Group vehicles by category
const vehiclesByCategory = categories.reduce((acc, category) => {
  acc[category.id] = vehicles.filter(vehicle => 
    vehicle.category.toLowerCase() === category.id
  ).slice(0, 4); // Limit to 4 vehicles per category
  return acc;
}, {} as Record<string, typeof vehicles>);

interface DesktopCategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DesktopCategoryMenu: React.FC<DesktopCategoryMenuProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-xl z-40 overflow-hidden",
        !isOpen && "pointer-events-none"
      )}
    >
      <div className="toyota-container py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Categories Column */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Categories</h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/new-cars?category=${category.id}`}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={onClose}
                  >
                    <span className="text-toyota-red">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/new-cars"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-toyota-red font-medium"
                  onClick={onClose}
                >
                  <span>View All Models</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Vehicles by Category */}
          {categories.slice(0, 3).map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="text-toyota-red mr-2">{category.icon}</span>
                {category.name}
              </h3>
              <ul className="space-y-2">
                {vehiclesByCategory[category.id]?.map((vehicle) => (
                  <li key={vehicle.name}> {/* Use vehicle.name as the key instead of id */}
                    <Link
                      to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase())}`}
                      className="flex items-center space-x-3 group p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                        {vehicle.image && (
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium group-hover:text-toyota-red transition-colors">{vehicle.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          From AED {vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={`/new-cars?category=${category.id}`}
                    className="flex items-center text-sm text-toyota-red p-2 hover:underline"
                    onClick={onClose}
                  >
                    View all {category.name} models
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="toyota-container flex justify-between items-center">
          <div className="flex space-x-6">
            <Link 
              to="/hybrid" 
              className="text-sm hover:text-toyota-red"
              onClick={onClose}
            >
              All Hybrid Models
            </Link>
            <Link 
              to="/compare" 
              className="text-sm hover:text-toyota-red"
              onClick={onClose}
            >
              Compare Models
            </Link>
            <Link 
              to="/upcoming" 
              className="text-sm hover:text-toyota-red"
              onClick={onClose}
            >
              Upcoming Models
            </Link>
          </div>
          <Link
            to="/configure"
            className="text-sm font-medium bg-toyota-red text-white px-4 py-2 rounded hover:bg-toyota-darkred transition-colors"
            onClick={onClose}
          >
            Build & Price
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCategoryMenu;
