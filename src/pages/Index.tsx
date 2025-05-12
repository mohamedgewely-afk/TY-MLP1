
import React, { useState, useEffect } from "react";
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
import { vehicles, preOwnedVehicles, heroSlides } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { usePersona } from "@/contexts/PersonaContext";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Available categories for filtering
const categories = ["All", "Hybrid", "Sedan", "SUV", "GR Performance", "Commercial"];

const Index = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { toast } = useToast();
  const { personaData, selectedPersona: activePersona } = usePersona();

  // Custom section visibility states based on persona
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    showcase: true,
    performance: true,
    offers: true,
    lifestyle: true,
    preOwned: true
  });
  
  // Update section visibility based on selected persona
  useEffect(() => {
    if (personaData) {
      const newVisibility: Record<string, boolean> = {
        showcase: true,
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
      }
    } else {
      // Reset to all sections visible
      setVisibleSections({
        showcase: true,
        performance: true,
        offers: true,
        lifestyle: true,
        preOwned: true
      });
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

  // Filter vehicles based on category and price
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (selectedCategory === "All" || vehicle.category === selectedCategory) &&
      vehicle.price >= priceRange[0] &&
      vehicle.price <= priceRange[1]
  );

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

      {/* Top Actions Bar */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="toyota-container py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredVehicles.length} vehicles
          </div>
          
          <div className="flex items-center space-x-4">
            <FavoritesDrawer 
              triggerButton={
                <Button variant="outline" size="sm" className="relative">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Favorites</span>
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-toyota-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        categories={categories}
      />

      {/* Vehicle Showcase */}
      {visibleSections.showcase && (
        <section id="vehicle-showcase">
          <VehicleShowcase
            title={personaData ? 
              `${personaData.title} Recommended Models` : 
              "Explore Our Vehicles"}
            vehicles={filteredVehicles}
            compareList={compareList}
            onCompare={handleCompareToggle}
            onQuickView={setSelectedVehicle}
          />
        </section>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <QuickViewModal
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
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
        />
      )}

      {/* Performance Section - Show based on persona */}
      {visibleSections.performance && <PerformanceSection />}

      {/* Special Offers Section */}
      {visibleSections.offers && <OffersSection />}

      {/* Lifestyle Section */}
      {visibleSections.lifestyle && <LifestyleSection />}

      {/* Pre-Owned Section */}
      {visibleSections.preOwned && <PreOwnedSection vehicles={preOwnedVehicles} />}

      {/* Comparison Table - Show as overlay when at least 2 vehicles are selected */}
      {compareList.length >= 2 && (
        <ComparisonTable
          vehicles={comparedVehicles}
          onRemove={handleRemoveFromCompare}
          onClearAll={handleClearCompare}
        />
      )}

      {/* Persona Badge - Show when a persona is selected */}
      {activePersona && <PersonaBadge />}
    </ToyotaLayout>
  );
};

export default Index;
