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
  const preOwnedVehicles = [/* ... same vehicles data as before ... */];

  // Calculate proper bounds for mobile vs desktop
  const totalCards = preOwnedVehicles.length;
  const cardsPerView = isMobile ? 1 : 3;
  const maxIndex = isMobile ? totalCards - 1 : totalCards - cardsPerView;
  const totalDots = isMobile ? totalCards : maxIndex + 1;

  // Navigation functions
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

          {/* ✅ Buttons updated to black */}
          <div className={`flex space-x-3 pt-4 ${isMobile ? '' : 'flex-col space-x-0 space-y-2'}`}>
            <Button className={`bg-black text-white hover:bg-black/90 ${isMobile ? 'flex-1' : 'w-full text-xs py-2'}`}>
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            {isMobile && (
              <Button className="bg-black text-white hover:bg-black/90">
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
          {/* ✅ Navigation Buttons black */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black text-white hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? '-translate-x-4' : '-translate-x-6'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black text-white hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isMobile ? 'translate-x-4' : 'translate-x-6'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Cards */}
          <div ref={swipeableRef} className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: getTransformValue() }}
            >
              {preOwnedVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </div>

          {/* Dots */}
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

          {/* Auto-play status */}
          {isAutoPlaying && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 text-muted-foreground text-xs">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
                Auto-playing
              </div>
            </div>
          )}
        </div>

        {/* ✅ CTA Section black */}
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
              <Button className="w-full md:w-auto bg-black text-white hover:bg-black/90">
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
