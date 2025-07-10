
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Sliders } from "lucide-react";
import { vehicles } from "@/data/vehicles";

interface PreOwnedCarouselProps {
  onClose: () => void;
}

const PreOwnedCarousel: React.FC<PreOwnedCarouselProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([30000, 200000]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ["All", "Sedan", "SUV", "Hybrid", "Luxury"];
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const categoryMatch = selectedCategory === "All" || 
      vehicle.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Hybrid" && vehicle.name.includes("Hybrid")) ||
      (selectedCategory === "Luxury" && (vehicle.name.includes("Land Cruiser") || vehicle.name.includes("Lexus")));
    
    const priceMatch = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredVehicles.length / 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(filteredVehicles.length / 2)) % Math.ceil(filteredVehicles.length / 2));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h2 className="text-xl font-bold">Pre-Owned Vehicles</h2>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
          ×
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-4 bg-muted/20">
        {/* Category Filter */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-toyota-red text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Price Range
            </span>
            <span className="text-sm font-bold text-toyota-red">
              AED {priceRange[0].toLocaleString()} - AED {priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Sliders className="h-5 w-5 text-toyota-red" />
            <input
              type="range"
              min="30000"
              max="200000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Carousel */}
      <div className="flex-1 relative overflow-hidden">
        <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10">
          <button
            onClick={prevSlide}
            className="p-2 bg-white/90 rounded-full shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-white/90 rounded-full shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div 
          className="flex transition-transform duration-300 h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(filteredVehicles.length / 2) }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 p-4 grid grid-cols-1 gap-4">
              {filteredVehicles.slice(slideIndex * 2, slideIndex * 2 + 2).map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Pre-Owned
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{vehicle.name}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">4.5 (28 reviews)</span>
                    </div>
                    <div className="text-toyota-red font-bold text-xl mb-2">
                      AED {(vehicle.price * 0.7).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      2022 • 25,000 km • Excellent condition
                    </div>
                    <button className="w-full bg-toyota-red text-white py-2 rounded-lg font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="p-4 bg-card border-t text-center">
        <span className="text-sm text-muted-foreground">
          Showing {filteredVehicles.length} vehicles
        </span>
      </div>
    </motion.div>
  );
};

export default PreOwnedCarousel;
