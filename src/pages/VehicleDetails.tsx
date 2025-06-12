
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, Calculator, Car, Calendar, ArrowUp } from "lucide-react";
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
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (slug) {
      const foundVehicle = vehicles.find(v => 
        v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === slug
      );
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Vehicle not found</h2>
            <Button onClick={() => navigate('/')} className="bg-toyota-red hover:bg-toyota-darkred">
              Return Home
            </Button>
          </div>
        </div>
      </ToyotaLayout>
    );
  }

  const discountPercentage = Math.round(((vehicle.originalPrice - vehicle.price) / vehicle.originalPrice) * 100);

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
              className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                className={`bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 ${
                  isFavorite ? 'text-red-500' : ''
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Save Banner */}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-20 left-4 right-4 z-10"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="text-2xl font-bold">Save {discountPercentage}%</div>
                    <div className="text-sm opacity-90">Limited Time Offer</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">AED {(vehicle.originalPrice - vehicle.price).toLocaleString()}</div>
                    <div className="text-xs opacity-75">off MSRP</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vehicle Title & Price */}
          <div className="absolute bottom-6 left-4 right-4 z-10">
            <div className="bg-background/90 backdrop-blur-md rounded-2xl p-6 border border-border/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{vehicle.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-toyota-red">
                      AED {vehicle.price.toLocaleString()}
                    </div>
                    {vehicle.originalPrice > vehicle.price && (
                      <div className="text-lg text-muted-foreground line-through">
                        AED {vehicle.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{vehicle.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Showcase */}
        <VehicleMediaShowcase vehicle={vehicle} />

        {/* Main Content */}
        <div className="container mx-auto px-4 space-y-8">
          {/* Features Section - Swipeable */}
          <VehicleFeatures vehicle={vehicle} />

          {/* Specifications */}
          <VehicleSpecs vehicle={vehicle} />

          {/* Reviews */}
          <VehicleReviews vehicle={vehicle} />

          {/* Related Vehicles */}
          <RelatedVehicles currentVehicle={vehicle} />
        </div>

        {/* Smart Floating Action Buttons */}
        <AnimatePresence>
          {!showCarBuilder && !showTestDrive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-20 right-4 z-30 flex flex-col space-y-3"
            >
              {/* Finance Calculator */}
              <Dialog open={showFinanceCalc} onOpenChange={setShowFinanceCalc}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl border-4 border-background"
                    >
                      <Calculator className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Finance Calculator</DialogTitle>
                  </DialogHeader>
                  <FinanceCalculator vehicle={vehicle} />
                </DialogContent>
              </Dialog>

              {/* Build Your Car */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => setShowCarBuilder(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full bg-toyota-red hover:bg-toyota-darkred text-white shadow-xl border-4 border-background"
                >
                  <Car className="h-6 w-6" />
                </Button>
              </motion.div>

              {/* Test Drive */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => setShowTestDrive(true)}
                  size="icon"
                  className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl border-4 border-background"
                >
                  <Calendar className="h-6 w-6" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-20 left-4 z-30"
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
