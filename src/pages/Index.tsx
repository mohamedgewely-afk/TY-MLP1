
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToyotaLayout from "@/components/ToyotaLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import PersonaSelector from "@/components/home/PersonaSelector";
import PersonalizedHero from "@/components/home/PersonalizedHero";
import QuickLinks from "@/components/home/QuickLinks";
import PersonaBadge from "@/components/home/PersonaBadge";
import CategoryFilter from "@/components/home/CategoryFilter";
import VehicleShowcase from "@/components/home/VehicleShowcase";
import ComparisonTable from "@/components/home/ComparisonTable";
import QuickViewModal from "@/components/home/QuickViewModal";
import CompareFloatingBox from "@/components/home/CompareFloatingBox";
import LifestyleSection from "@/components/home/LifestyleSection";
import PerformanceSection from "@/components/home/PerformanceSection";
import PreOwnedSection from "@/components/home/PreOwnedSection";
import OffersSection from "@/components/home/OffersSection";
import FavoritesDrawer from "@/components/home/FavoritesDrawer";
import VehicleRecommendations from "@/components/home/VehicleRecommendations";
import { vehicles, preOwnedVehicles, heroSlides } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { usePersona } from "@/contexts/PersonaContext";
import { useToast } from "@/hooks/use-toast";
import { Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Available categories for filtering
const categories = ["All", "Hybrid", "Electric", "Hydrogen", "Sedan", "SUV", "GR Performance", "Commercial"];

const Index = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 300000]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { toast } = useToast();
  const { personaData, selectedPersona: activePersona } = usePersona();
  const [personaFilteredVehicles, setPersonaFilteredVehicles] = useState<VehicleModel[] | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const initialLoadRef = useRef(false);
  const [animateVehicles, setAnimateVehicles] = useState(false);

  // Custom section visibility states based on persona
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    showcase: true,
    recommendations: false,
    performance: true,
    offers: true,
    lifestyle: true,
    preOwned: true
  });
  
  // Listen for persona vehicle filtering events
  useEffect(() => {
    const handleFilteredVehicles = (event: any) => {
      if (event.detail && event.detail.vehicles) {
        setPersonaFilteredVehicles(event.detail.vehicles);
      } else {
        setPersonaFilteredVehicles(null);
      }
    };
    
    window.addEventListener('persona-vehicles-filtered', handleFilteredVehicles);
    return () => window.removeEventListener('persona-vehicles-filtered', handleFilteredVehicles);
  }, []);
  
  // Update section visibility based on selected persona
  useEffect(() => {
    if (personaData) {
      // If we've just selected a persona, scroll to top to see full personalization
      if (!initialLoadRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        initialLoadRef.current = true;
      }
      
      const newVisibility: Record<string, boolean> = {
        showcase: true,
        recommendations: true, // Show recommendations when a persona is selected
        performance: personaData.highlightedSections.includes("performance"),
        offers: true,
        lifestyle: personaData.highlightedSections.includes("lifestyle") || 
                  personaData.id === "family-first" || 
                  personaData.id === "weekend-adventurer",
        preOwned: personaData.id !== "tech-enthusiast" // Hide pre-owned for tech enthusiasts who prefer new models
      };
      
      setVisibleSections(newVisibility);
      
      // Set appropriate category based on persona
      if (personaData.id === "eco-warrior") {
        setSelectedCategory("Hybrid");
      } else if (personaData.id === "family-first") {
        setSelectedCategory("SUV");
      } else if (personaData.id === "tech-enthusiast") {
        setSelectedCategory("GR Performance");
      } else if (personaData.id === "urban-explorer" || personaData.id === "business-commuter") {
        setSelectedCategory("Sedan");
      } else if (personaData.id === "weekend-adventurer") {
        setSelectedCategory("SUV");
      }

      // Start vehicle animation sequence after persona selection
      setTimeout(() => {
        setAnimateVehicles(true);
      }, 500);
      
    } else {
      // Reset to all sections visible
      setVisibleSections({
        showcase: true,
        recommendations: false,
        performance: true,
        offers: true,
        lifestyle: true,
        preOwned: true
      });
      setSelectedCategory("All");
      setAnimateVehicles(false);
    }
  }, [personaData]);

  // Load favorite count from localStorage
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    };
    
    handleFavoritesUpdated();
    window.addEventListener('favorites-updated', handleFavoritesUpdated);
    
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated);
    };
  }, []);

  // Filter vehicles based on category, price, and persona recommendations
  const filteredVehicles = React.useMemo(() => {
    // If we have persona-filtered vehicles, use those as the base
    const baseVehicles = personaFilteredVehicles || vehicles;
    
    // Then apply additional user filters
    return baseVehicles.filter(
      (vehicle) =>
        (selectedCategory === "All" || vehicle.category === selectedCategory) &&
        vehicle.price >= priceRange[0] &&
        vehicle.price <= priceRange[1]
    );
  }, [personaFilteredVehicles, selectedCategory, priceRange]);

  // Handler for compare toggle
  const handleCompareToggle = (vehicle: VehicleModel) => {
    if (compareList.includes(vehicle.name)) {
      // Remove from compare list
      setCompareList(compareList.filter((name) => name !== vehicle.name));
      toast({
        title: "Removed from comparison",
        description: `${vehicle.name} has been removed from your comparison list.`,
        variant: "default",
      });
    } else {
      // Add to compare list (max 3)
      if (compareList.length >= 3) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 3 vehicles at a time. Please remove a vehicle first.",
          variant: "destructive",
        });
        return;
      }
      
      setCompareList([...compareList, vehicle.name]);
      toast({
        title: "Added to comparison",
        description: `${vehicle.name} has been added to your comparison list.`,
        variant: "default",
      });
    }
  };

  // Handler for removing vehicle from compare list
  const handleRemoveFromCompare = (name: string) => {
    setCompareList(compareList.filter((item) => item !== name));
  };

  // Handler for clearing all vehicles from compare list
  const handleClearCompare = () => {
    setCompareList([]);
  };

  // Handle persona selection completion
  const handlePersonaSelection = () => {
    // Scroll to vehicle showcase after persona selection
    setTimeout(() => {
      document.getElementById('vehicle-showcase')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // Vehicle comparison data
  const comparedVehicles = vehicles.filter((vehicle) =>
    compareList.includes(vehicle.name)
  );

  return (
    <ToyotaLayout>
      {/* Show either default hero or personalized hero based on persona selection */}
      {!activePersona ? (
        <>
          <HeroCarousel slides={heroSlides} />
          <PersonaSelector onSelect={handlePersonaSelection} />
        </>
      ) : (
        <>
          <PersonalizedHero />
          <QuickLinks />
        </>
      )}

      {/* Top Actions Bar with Persona-specific styling */}
      <motion.div 
        className={cn(
          "shadow-sm z-20 sticky top-0",
          personaData ? "bg-opacity-95 backdrop-blur-sm" : "",
        )}
        style={personaData ? { 
          backgroundColor: `${personaData.colorScheme.primary}10`,
          borderBottom: `1px solid ${personaData.colorScheme.primary}20`
        } : {}}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="toyota-container py-4 flex justify-between items-center">
          <div className="text-sm flex items-center">
            <span 
              className={cn(
                "font-medium",
                personaData && "text-opacity-90"
              )}
              style={personaData ? { color: personaData.colorScheme.primary } : {}}
            >
              Showing {filteredVehicles.length} vehicles
            </span>
            
            {personaData && (
              <motion.span 
                className="ml-2 text-xs bg-opacity-20 px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: personaData.colorScheme.primary,
                  color: personaData.colorScheme.primary 
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Personalized for you
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={showFilterPanel ? "default" : "outline"} 
              size="sm" 
              className={cn(
                "relative",
                personaData && "border-opacity-50"
              )}
              style={personaData && showFilterPanel ? {
                backgroundColor: personaData.colorScheme.primary,
                color: "#FFF"
              } : personaData ? {
                borderColor: personaData.colorScheme.primary  
              } : {}}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
            
            <FavoritesDrawer 
              triggerButton={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative"
                  style={personaData ? {
                    borderColor: personaData.colorScheme.primary  
                  } : {}}
                >
                  <Heart className="h-4 w-4 mr-2" style={personaData ? {
                    color: personaData.colorScheme.primary
                  } : {}} />
                  <span>Favorites</span>
                  {favoriteCount > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      style={{ backgroundColor: personaData ? personaData.colorScheme.accent : 'var(--toyota-red)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {favoriteCount}
                    </motion.span>
                  )}
                </Button>
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPersona={selectedPersona}
              setSelectedPersona={setSelectedPersona}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalized Recommendations */}
      {visibleSections.recommendations && personaData && (
        <VehicleRecommendations 
          personaData={personaData} 
          vehicles={vehicles} 
        />
      )}

      {/* Vehicle Showcase with Persona-specific styling */}
      {visibleSections.showcase && (
        <section 
          id="vehicle-showcase" 
          className="py-10 md:py-16"
          style={personaData ? {
            backgroundColor: `${personaData.colorScheme.background}`,
            backgroundImage: personaData.backgroundPattern || "",
          } : {}}
        >
          <VehicleShowcase
            title={personaData ? 
              `${personaData.title} Recommended Models` : 
              "Explore Our Vehicles"}
            vehicles={filteredVehicles}
            compareList={compareList}
            onCompare={handleCompareToggle}
            onQuickView={setSelectedVehicle}
            personaData={personaData}
          />
        </section>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <QuickViewModal
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
            personaData={personaData}
          />
        )}
      </AnimatePresence>

      {/* Compare Floating Box - Only show if comparing 1 vehicle */}
      {compareList.length === 1 && (
        <CompareFloatingBox
          compareList={compareList}
          vehicles={vehicles}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          personaData={personaData}
        />
      )}

      {/* Performance Section - Show based on persona */}
      {visibleSections.performance && (
        <PerformanceSection />
      )}

      {/* Special Offers Section */}
      {visibleSections.offers && (
        <OffersSection onOfferClick={() => {}} />
      )}

      {/* Lifestyle Section */}
      {visibleSections.lifestyle && (
        <LifestyleSection />
      )}

      {/* Pre-Owned Section */}
      {visibleSections.preOwned && (
        <PreOwnedSection vehicles={preOwnedVehicles} />
      )}

      {/* Comparison Table - Show as overlay when at least 2 vehicles are selected */}
      {compareList.length >= 2 && (
        <ComparisonTable
          vehicles={comparedVehicles}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
          personaData={personaData}
        />
      )}

      {/* Persona Badge - Show when a persona is selected */}
      {activePersona && <PersonaBadge />}
    </ToyotaLayout>
  );
};

export default Index;
