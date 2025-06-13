
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Calculator, Car, Calendar, ArrowUp, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import CarBuilder from "@/components/vehicle-details/CarBuilder";
import BookTestDrive from "@/components/vehicle-details/BookTestDrive";
import FinanceCalculator from "@/components/vehicle-details/FinanceCalculator";
import VehicleReviews from "@/components/vehicle-details/VehicleReviews";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";

const VehicleDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCarBuilder, setShowCarBuilder] = useState(false);
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [showFinanceCalc, setShowFinanceCalc] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (slug) {
      // Fix slug matching - match against vehicle name converted to slug format
      const foundVehicle = vehicles.find(v => {
        const vehicleSlug = v.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
        return vehicleSlug === slug;
      });
      
      console.log('Looking for slug:', slug);
      console.log('Available vehicles slugs:', vehicles.map(v => v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')));
      console.log('Found vehicle:', foundVehicle);
      
      if (foundVehicle) {
        setVehicle(foundVehicle);
      }
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? 
        `${vehicle?.name} removed from your favorites` : 
        `${vehicle?.name} added to your favorites`,
    });
  };

  const handleShare = async () => {
    if (navigator.share && vehicle) {
      try {
        await navigator.share({
          title: vehicle.name,
          text: `Check out this ${vehicle.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Vehicle link copied to clipboard",
      });
    }
  };

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Vehicle not found</h2>
            <p className="text-muted-foreground">The vehicle you're looking for doesn't exist or has been moved.</p>
            <Button onClick={() => navigate('/')} className="bg-toyota-red hover:bg-toyota-darkred">
              Return Home
            </Button>
          </div>
        </div>
      </ToyotaLayout>
    );
  }

  // Handle cases where originalPrice might not exist
  const originalPrice = vehicle.originalPrice || vehicle.price + (vehicle.price * 0.1);
  const discountPercentage = Math.round(((originalPrice - vehicle.price) / originalPrice) * 100);
  const hasDiscount = vehicle.originalPrice && vehicle.originalPrice > vehicle.price;

  return (
    <ToyotaLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="relative">
          {/* Header with Back Button */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                className={`bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 shadow-lg ${
                  isFavorite ? 'text-red-500 border-red-200' : ''
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 shadow-lg"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Save Banner */}
          {hasDiscount && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-20 left-4 right-4 z-10"
            >
              <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-500 rounded-2xl p-4 shadow-xl border border-emerald-400/30">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Badge className="bg-transparent text-white border-white/30 font-bold">
                        {discountPercentage}% OFF
                      </Badge>
                    </div>
                    <div>
                      <div className="text-lg font-bold">Limited Time Savings</div>
                      <div className="text-sm opacity-90">Special offer ends soon</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">AED {(originalPrice - vehicle.price).toLocaleString()}</div>
                    <div className="text-xs opacity-75">total savings</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vehicle Title & Price */}
          <div className="absolute bottom-6 left-4 right-4 z-10">
            <div className="bg-background/95 backdrop-blur-md rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{vehicle.name}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-3xl font-bold text-toyota-red">
                      AED {vehicle.price.toLocaleString()}
                    </div>
                    {hasDiscount && (
                      <div className="text-lg text-muted-foreground line-through">
                        AED {originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {vehicle.description && (
                    <p className="text-muted-foreground">{vehicle.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Showcase */}
        <VehicleMediaShowcase vehicle={vehicle} />

        {/* Main Content */}
        <div className="container mx-auto px-4 space-y-8 pb-32">
          {/* Features Section */}
          <VehicleFeatures vehicle={vehicle} />

          {/* Specifications */}
          <VehicleSpecs vehicle={vehicle} />

          {/* Reviews */}
          <VehicleReviews vehicle={vehicle} />

          {/* Related Vehicles */}
          <RelatedVehicles currentVehicle={vehicle} />
        </div>

        {/* Smart Bottom Action Bar - Better UX */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between space-x-3">
              {/* Price Info */}
              <div className="flex-1">
                <div className="text-lg font-bold text-toyota-red">
                  AED {vehicle.price.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Starting price</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Finance Calculator */}
                <Dialog open={showFinanceCalc} onOpenChange={setShowFinanceCalc}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Calculator className="h-4 w-4" />
                      <span className="hidden sm:inline">Finance</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Finance Calculator</DialogTitle>
                    </DialogHeader>
                    <FinanceCalculator 
                      vehicle={vehicle} 
                      isOpen={showFinanceCalc} 
                      onClose={() => setShowFinanceCalc(false)} 
                    />
                  </DialogContent>
                </Dialog>

                {/* Build Your Car */}
                <Button
                  onClick={() => setShowCarBuilder(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Build</span>
                </Button>

                {/* Test Drive - Primary CTA */}
                <Button
                  onClick={() => setShowTestDrive(true)}
                  className="bg-toyota-red hover:bg-toyota-darkred text-white px-6"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Test Drive
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 right-4 z-30"
            >
              <Button
                onClick={scrollToTop}
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full bg-background/90 backdrop-blur-md border-border/50 hover:bg-background shadow-lg"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogs */}
        <CarBuilder
          vehicle={vehicle}
          isOpen={showCarBuilder}
          onClose={() => setShowCarBuilder(false)}
        />

        <BookTestDrive
          vehicle={vehicle}
          isOpen={showTestDrive}
          onClose={() => setShowTestDrive(false)}
        />
      </div>
    </ToyotaLayout>
  );
};

export default VehicleDetails;
