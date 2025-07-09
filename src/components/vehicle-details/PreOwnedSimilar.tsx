
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Calendar, Gauge, Fuel, MapPin, Star, ArrowRight, Award,
  Clock, CheckCircle, Shield, ChevronLeft, ChevronRight
} from "lucide-react";

interface PreOwnedSimilarProps {
  currentVehicle: VehicleModel;
}

const PreOwnedSimilar: React.FC<PreOwnedSimilarProps> = ({ currentVehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Mock pre-owned similar vehicles data
  const preOwnedVehicles = [
    {
      id: 1,
      name: `${currentVehicle.name.split(' ')[1]} 2022`,
      year: 2022,
      mileage: "45,000 km",
      price: Math.round(currentVehicle.price * 0.7),
      originalPrice: Math.round(currentVehicle.price * 0.85),
      rating: 4.8,
      location: "Dubai, UAE",
      certification: "Toyota Certified",
      warranty: "12 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      features: ["Hybrid Engine", "Premium Interior", "Safety Sense 2.0"],
      condition: "Excellent",
      owners: 1
    },
    {
      id: 2,
      name: `${currentVehicle.name.split(' ')[1]} 2021`,
      year: 2021,
      mileage: "62,000 km",
      price: Math.round(currentVehicle.price * 0.6),
      originalPrice: Math.round(currentVehicle.price * 0.75),
      rating: 4.6,
      location: "Abu Dhabi, UAE",
      certification: "Toyota Certified",
      warranty: "12 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      features: ["Excellent Condition", "Full Service History", "Single Owner"],
      condition: "Very Good",
      owners: 1
    },
    {
      id: 3,
      name: `${currentVehicle.name.split(' ')[1]} 2020`,
      year: 2020,
      mileage: "78,000 km",
      price: Math.round(currentVehicle.price * 0.5),
      originalPrice: Math.round(currentVehicle.price * 0.65),
      rating: 4.5,
      location: "Sharjah, UAE",
      certification: "Toyota Certified",
      warranty: "6 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      features: ["Great Value", "Well Maintained", "All Records Available"],
      condition: "Good",
      owners: 2
    },
    {
      id: 4,
      name: `${currentVehicle.name.split(' ')[1]} 2019`,
      year: 2019,
      mileage: "95,000 km",
      price: Math.round(currentVehicle.price * 0.4),
      originalPrice: Math.round(currentVehicle.price * 0.55),
      rating: 4.3,
      location: "Ajman, UAE",
      certification: "Toyota Certified",
      warranty: "6 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      features: ["Budget Friendly", "Recently Serviced", "Clean History"],
      condition: "Good",
      owners: 1
    }
  ];

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % preOwnedVehicles.length);
    }, 4000); // Auto-swipe every 4 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, preOwnedVehicles.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false); // Stop auto-play when user interacts
    setCurrentIndex((prev) => (prev + 1) % preOwnedVehicles.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false); // Stop auto-play when user interacts
    setCurrentIndex((prev) => (prev - 1 + preOwnedVehicles.length) % preOwnedVehicles.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false); // Stop auto-play when user interacts
    setCurrentIndex(index);
  };

  const selectedVehicle = preOwnedVehicles[currentIndex];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="h-4 w-4 mr-2" />
            Toyota Certified Pre-Owned
          </Badge>
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-4 leading-tight">
            Similar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Pre-Owned Models
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover certified pre-owned {currentVehicle.name.split(' ')[1]} models with Toyota's quality assurance.
          </p>
        </motion.div>

        {/* Single Card Carousel */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Card Display */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={selectedVehicle.image} 
                      alt={selectedVehicle.name}
                      className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Overlays */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {selectedVehicle.certification}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-semibold">{selectedVehicle.rating}</span>
                      </div>
                    </div>
                    
                    {/* Auto-play indicator */}
                    {isAutoPlaying && !isPaused && (
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                          Auto-playing
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{selectedVehicle.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {selectedVehicle.year}
                        </div>
                        <div className="flex items-center">
                          <Gauge className="h-4 w-4 mr-1" />
                          {selectedVehicle.mileage}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedVehicle.location}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-foreground">
                          AED {selectedVehicle.price.toLocaleString()}
                        </span>
                        {selectedVehicle.originalPrice > selectedVehicle.price && (
                          <span className="text-lg text-muted-foreground line-through">
                            AED {selectedVehicle.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-green-600">
                          <Shield className="h-4 w-4 mr-1" />
                          {selectedVehicle.warranty} warranty
                        </div>
                        <div className="text-muted-foreground">
                          {selectedVehicle.owners} previous owner{selectedVehicle.owners > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-2">Key Features</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedVehicle.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Condition: </span>
                          <span className="font-medium">{selectedVehicle.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button className="flex-1">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button variant="outline" size="default">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-6">
            {preOwnedVehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-3 bg-primary rounded-full' 
                    : 'w-3 h-3 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="max-w-xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Looking for More Options?</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Browse our complete collection of certified pre-owned vehicles.
              </p>
              <Button className="w-full md:w-auto">
                View All Pre-Owned Vehicles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PreOwnedSimilar;
