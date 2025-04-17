
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToyotaLayout from "@/components/ToyotaLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryFilter from "@/components/home/CategoryFilter";
import VehicleShowcase from "@/components/home/VehicleShowcase";
import ComparisonTable from "@/components/home/ComparisonTable";
import QuickViewModal from "@/components/home/QuickViewModal";
import CompareFloatingBox from "@/components/home/CompareFloatingBox";
import LifestyleSection from "@/components/home/LifestyleSection";
import PerformanceSection from "@/components/home/PerformanceSection";
import PreOwnedSection from "@/components/home/PreOwnedSection";
import { vehicles, preOwnedVehicles, heroSlides } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";

// Available categories for filtering
const categories = ["All", "Hybrid", "Sedan", "SUV", "GR Performance", "Commercial"];

const Index = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
  const { toast } = useToast();

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

  // Vehicle comparison data
  const comparedVehicles = vehicles.filter((vehicle) =>
    compareList.includes(vehicle.name)
  );

  return (
    <ToyotaLayout>
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

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
      <VehicleShowcase
        title="Explore Our Vehicles"
        vehicles={filteredVehicles}
        compareList={compareList}
        onCompare={handleCompareToggle}
        onQuickView={setSelectedVehicle}
      />

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <QuickViewModal
            vehicle={selectedVehicle}
            onClose={() => setSelectedVehicle(null)}
          />
        )}
      </AnimatePresence>

      {/* Compare Floating Box */}
      <CompareFloatingBox
        compareList={compareList}
        vehicles={vehicles}
        onRemove={handleRemoveFromCompare}
        onClearAll={handleClearCompare}
      />

      {/* Performance Section */}
      <PerformanceSection />

      {/* Lifestyle Section */}
      <LifestyleSection />

      {/* Pre-Owned Section */}
      <PreOwnedSection vehicles={preOwnedVehicles} />

      {/* Comparison Table */}
      {compareList.length >= 2 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900" id="compare-section">
          <div className="toyota-container">
            <ComparisonTable
              vehicles={comparedVehicles}
              onRemove={handleRemoveFromCompare}
            />
          </div>
        </section>
      )}
    </ToyotaLayout>
  );
};

export default Index;
