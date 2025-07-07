
import React, { useState } from "react";
import { motion } from "framer-motion";
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
      features: ["Hybrid Engine", "Premium Interior", "Safety Sense 2.0"]
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
      features: ["Excellent Condition", "Full Service History", "Single Owner"]
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
      features: ["Great Value", "Well Maintained", "All Records Available"]
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
      features: ["Budget Friendly", "Recently Serviced", "Clean History"]
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(preOwnedVehicles.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(preOwnedVehicles.length / 3)) % Math.ceil(preOwnedVehicles.length / 3));
  };

  const getVisibleVehicles = () => {
    const vehiclesPerSlide = 3;
    const startIndex = currentIndex * vehiclesPerSlide;
    return preOwnedVehicles.slice(startIndex, startIndex + vehiclesPerSlide);
  };

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

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Carousel Content */}
          <div className="overflow-hidden px-12">
            <motion.div 
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ x: `-${currentIndex * 100}%` }}
            >
              {Array.from({ length: Math.ceil(preOwnedVehicles.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {preOwnedVehicles
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((vehicle, index) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                          <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="relative">
                              <img 
                                src={vehicle.image} 
                                alt={vehicle.name}
                                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-green-600 text-white text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {vehicle.certification}
                                </Badge>
                              </div>
                              <div className="absolute top-3 right-3">
                                <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                                  <span className="text-xs font-semibold">{vehicle.rating}</span>
                                </div>
                              </div>
                            </div>

                            <CardContent className="p-4 space-y-3">
                              <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{vehicle.name}</h3>
                                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {vehicle.year}
                                  </div>
                                  <div className="flex items-center">
                                    <Gauge className="h-3 w-3 mr-1" />
                                    {vehicle.mileage}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{vehicle.location}</span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-bold text-foreground">
                                    AED {vehicle.price.toLocaleString()}
                                  </span>
                                  {vehicle.originalPrice > vehicle.price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      AED {vehicle.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-green-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {vehicle.warranty} warranty included
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  {vehicle.features.slice(0, 2).map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0.5">
                                      {feature}
                                    </Badge>
                                  ))}
                                  {vehicle.features.length > 2 && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                      +{vehicle.features.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2 pt-2">
                                <Button size="sm" className="flex-1 text-xs">
                                  View Details
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                                <Button variant="outline" size="sm" className="px-2">
                                  <Clock className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: Math.ceil(preOwnedVehicles.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
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
          className="text-center mt-8 lg:mt-12"
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
