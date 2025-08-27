
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { 
  Calendar, Gauge, Fuel, MapPin, ArrowRight, Award,
  CheckCircle, Shield, ChevronLeft, ChevronRight, ShoppingCart
} from "lucide-react";

interface PreOwnedSimilarProps {
  currentVehicle: VehicleModel;
}

const PreOwnedSimilar: React.FC<PreOwnedSimilarProps> = ({ currentVehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isMobile = useIsMobile();

  // Extended mock pre-owned similar vehicles data (8 total)
  const preOwnedVehicles = [
    {
      id: 1,
      name: `${currentVehicle.name.split(' ')[1]} 2022`,
      year: 2022,
      mileage: "45,000 km",
      price: Math.round(currentVehicle.price * 0.7),
      originalPrice: Math.round(currentVehicle.price * 0.85),
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
      location: "Ajman, UAE",
      certification: "Toyota Certified",
      warranty: "6 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      features: ["Budget Friendly", "Recently Serviced", "Clean History"],
      condition: "Good",
      owners: 1
    },
    {
      id: 5,
      name: `${currentVehicle.name.split(' ')[1]} 2023`,
      year: 2023,
      mileage: "28,000 km",
      price: Math.round(currentVehicle.price * 0.85),
      originalPrice: Math.round(currentVehicle.price * 0.95),
      location: "Dubai, UAE",
      certification: "Toyota Certified",
      warranty: "18 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
      features: ["Nearly New", "Full Warranty", "Latest Features"],
      condition: "Excellent",
      owners: 1
    },
    {
      id: 6,
      name: `${currentVehicle.name.split(' ')[1]} 2018`,
      year: 2018,
      mileage: "112,000 km",
      price: Math.round(currentVehicle.price * 0.35),
      originalPrice: Math.round(currentVehicle.price * 0.45),
      location: "Ras Al Khaimah, UAE",
      certification: "Toyota Certified",
      warranty: "3 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
      features: ["Affordable", "Good Condition", "Reliable Transport"],
      condition: "Good",
      owners: 2
    },
    {
      id: 7,
      name: `${currentVehicle.name.split(' ')[1]} 2021 Sport`,
      year: 2021,
      mileage: "58,000 km",
      price: Math.round(currentVehicle.price * 0.65),
      originalPrice: Math.round(currentVehicle.price * 0.78),
      location: "Fujairah, UAE",
      certification: "Toyota Certified",
      warranty: "9 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      features: ["Sport Package", "Performance Tuned", "Premium Audio"],
      condition: "Very Good",
      owners: 1
    },
    {
      id: 8,
      name: `${currentVehicle.name.split(' ')[1]} 2020 Limited`,
      year: 2020,
      mileage: "82,000 km",
      price: Math.round(currentVehicle.price * 0.55),
      originalPrice: Math.round(currentVehicle.price * 0.68),
      location: "Abu Dhabi, UAE",
      certification: "Toyota Certified",
      warranty: "8 months",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      features: ["Limited Edition", "Luxury Package", "Heated Seats"],
      condition: "Very Good",
      owners: 1
    }
  ];

  // Calculate proper bounds for mobile vs desktop
  const totalCards = preOwnedVehicles.length; // 8 cards
  const cardsPerView = isMobile ? 1 : 3;
  const maxIndex = isMobile ? totalCards - 1 : totalCards - cardsPerView; // Mobile: 0-7, Desktop: 0-5
  const totalDots = isMobile ? totalCards : maxIndex + 1; // Mobile: 8 dots, Desktop: 6 dots

  // Navigation functions with proper bounds
  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(Math.min(Math.max(index, 0), maxIndex));
  };

  // Swipe handlers
  const swipeableRef = useSwipeable({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    threshold: 50,
    debug: false
  });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Calculate transform based on mobile vs desktop
  const getTransformValue = () => {
    if (isMobile) {
      return `translateX(-${currentIndex * 100}%)`;
    } else {
      return `translateX(-${currentIndex * 33.333333}%)`;
    }
  };

  const VehicleCard = ({ vehicle, index }: { vehicle: any; index: number }) => (
    <div
      key={vehicle.id}
      className={`flex-shrink-0 ${isMobile ? 'w-full px-4' : 'w-1/3 px-2'}`}
    >
      <Card 
        className="overflow-hidden border-0 shadow-xl transition-all duration-300 group h-full hover:shadow-2xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative">
          <img 
            src={vehicle.image} 
            alt={vehicle.name}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isMobile ? 'h-64 lg:h-80' : 'h-48'
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Overlays */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-600 text-white text-sm">
              <CheckCircle className="h-3 w-3 mr-1" />
              {vehicle.certification}
            </Badge>
          </div>
        </div>

        <CardContent className={`space-y-4 ${isMobile ? 'p-6' : 'p-4'}`}>
          <div>
            <h3 className={`font-bold text-foreground mb-2 ${isMobile ? 'text-2xl' : 'text-xl'}`}>
              {vehicle.name}
            </h3>
            <div className={`flex items-center space-x-4 text-muted-foreground ${
              isMobile ? 'text-sm' : 'text-xs'
            }`}>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {vehicle.year}
              </div>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-1" />
                {vehicle.mileage}
              </div>
              {isMobile && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vehicle.location}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-foreground ${isMobile ? 'text-3xl' : 'text-2xl'}`}>
                AED {vehicle.price.toLocaleString()}
              </span>
              {vehicle.originalPrice > vehicle.price && (
                <span className={`text-muted-foreground line-through ${
                  isMobile ? 'text-lg' : 'text-sm'
                }`}>
                  AED {vehicle.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className={`flex items-center justify-between ${isMobile ? 'text-sm' : 'text-xs'}`}>
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-1" />
                {vehicle.warranty} warranty
              </div>
              <div className="text-muted-foreground">
                {vehicle.owners} previous owner{vehicle.owners > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className={`font-medium mb-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>Key Features</div>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.slice(0, isMobile ? 3 : 2).map((feature: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className={isMobile ? 'text-xs' : 'text-[10px]'}>
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className={`flex items-center justify-between ${isMobile ? 'text-sm' : 'text-xs'}`}>
              <div>
                <span className="text-muted-foreground">Condition: </span>
                <span className="font-medium">{vehicle.condition}</span>
              </div>
            </div>
          </div>

          <div className={`flex space-x-3 pt-4 ${isMobile ? '' : 'flex-col space-x-0 space-y-2'}`}>
            <Button className={`${isMobile ? 'flex-1' : 'w-full text-xs py-2'}`}>
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            {isMobile && (
              <Button variant="outline" size="default">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
        <div className={`relative ${isMobile ? 'max-w-2xl mx-auto' : 'max-w-7xl mx-auto'}`}>
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? '-translate-x-4' : '-translate-x-6'
            }`}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg border transition-all hover:bg-white hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? 'translate-x-4' : 'translate-x-6'
            }`}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Cards Display - Render ALL 8 cards */}
          <div 
            ref={swipeableRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: getTransformValue()
              }}
            >
              {preOwnedVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-6">
            {Array.from({ length: totalDots }).map((_, index) => (
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

          {/* Auto-play Status */}
          {isAutoPlaying && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 text-muted-foreground text-xs">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
                Auto-playing
              </div>
            </div>
          )}
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
