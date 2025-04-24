
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryFilter from "@/components/home/CategoryFilter";
import VehicleShowcase from "@/components/home/VehicleShowcase";
import ComparisonSection from "@/components/home/ComparisonSection";
import FavoritesDrawer from "@/components/home/FavoritesDrawer";
import QuickViewModal from "@/components/home/QuickViewModal";
import CompareFloatingBox from "@/components/home/CompareFloatingBox";
import PreOwnedSection from "@/components/home/PreOwnedSection";
import PerformanceSection from "@/components/home/PerformanceSection";
import LifestyleSection from "@/components/home/LifestyleSection";
import OffersSection from "@/components/home/OffersSection";
import ToyotaLayout from "@/components/ToyotaLayout";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import HomeTechnologySection from "@/components/home/HomeTechnologySection";
import HomeGalleryShowcase from "@/components/home/HomeGalleryShowcase";
import FeaturedModelSection from "@/components/home/FeaturedModelSection";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleModel[]>(vehicles);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [quickViewVehicle, setQuickViewVehicle] = useState<VehicleModel | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites && JSON.parse(storedFavorites).length > 0) {
      toast({
        title: "Your favorites are saved",
        description: "You can view your favorites at any time.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(
        vehicles.filter((vehicle) => vehicle.category === activeCategory)
      );
    }
  }, [activeCategory]);

  const handleCompare = (vehicle: VehicleModel) => {
    if (compareList.includes(vehicle.name)) {
      setCompareList(compareList.filter((name) => name !== vehicle.name));
      toast({
        title: "Removed from comparison",
        description: `${vehicle.name} has been removed from comparison.`,
      });
    } else {
      if (compareList.length >= 3) {
        toast({
          title: "Maximum comparison limit reached",
          description: "You can compare up to 3 vehicles at once.",
          variant: "destructive",
        });
        return;
      }
      setCompareList([...compareList, vehicle.name]);
      toast({
        title: "Added to comparison",
        description: `${vehicle.name} has been added to comparison.`,
      });
    }
  };

  const handleQuickView = (vehicle: VehicleModel) => {
    setQuickViewVehicle(vehicle);
  };

  const handleCloseQuickView = () => {
    setQuickViewVehicle(null);
  };

  const heroSlides = [
    {
      id: "hero-1",
      title: "The All-New 2025 Toyota Camry",
      subtitle: "Bold look. Bold performance. Designed for those who refuse to blend in.",
      image: "https://global.toyota/pages/news/images/2023/11/28/2000/20231128_01_01_s.jpg",
      ctaText: "Explore Camry",
      ctaLink: "/vehicle/camry",
      isHybrid: true,
    },
    {
      id: "hero-2",
      title: "Toyota Land Cruiser",
      subtitle: "The legend returns. Engineered for adventure, built to last.",
      image: "https://global.toyota/pages/news/images/2023/08/02/2000/landcruiser250_20230802_01_24_s.jpg",
      ctaText: "Discover Land Cruiser",
      ctaLink: "/vehicle/land-cruiser",
    },
    {
      id: "hero-3",
      title: "Discover Toyota Hybrid",
      subtitle: "Experience the perfect balance of power and efficiency.",
      image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_08_s.jpg",
      ctaText: "Explore Hybrids",
      ctaLink: "/hybrids",
      isHybrid: true,
    },
  ];

  const categories = [
    {
      id: "all",
      name: "All",
      image: "https://images.pexels.com/photos/175709/pexels-photo-175709.jpeg",
    },
    {
      id: "sedans", 
      name: "Sedans",
      image: "https://global.toyota/pages/news/images/2023/11/28/2000/20231128_01_03_s.jpg",
    },
    {
      id: "suv", 
      name: "SUVs",
      image: "https://global.toyota/pages/news/images/2023/08/02/2000/landcruiser250_20230802_01_01_s.jpg",
    },
    {
      id: "hybrids", 
      name: "Hybrids",
      image: "https://global.toyota/pages/news/images/2023/04/25/001/20230425_01_kv_full_w1920.jpg",
    },
    {
      id: "pickup", 
      name: "Pickups",
      image: "https://global.toyota/pages/news/images/2021/06/10/1330/20210610_01_03_s.jpg",
    },
    {
      id: "eco", 
      name: "Eco-Friendly",
      image: "https://global.toyota/pages/news/images/2022/12/19/001/20221219_01_kv_full.jpg",
    },
  ];

  return (
    <ToyotaLayout showFavoritesButton onFavoritesClick={() => setIsFavoritesOpen(true)}>
      <HeroCarousel slides={heroSlides} />
      
      <FeaturedModelSection />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-12 bg-gray-50 dark:bg-gray-800"
      >
        <div className="toyota-container">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Find Your Perfect Toyota
          </h2>
          
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          <VehicleShowcase
            title="Explore Our Vehicles"
            vehicles={filteredVehicles}
            compareList={compareList}
            onCompare={handleCompare}
            onQuickView={handleQuickView}
          />
        </div>
      </motion.div>

      <HomeGalleryShowcase />
      
      <HomeTechnologySection />
      
      <ComparisonSection
        compareList={compareList}
        vehicles={vehicles}
        onRemove={(name) => setCompareList(compareList.filter((n) => n !== name))}
      />
      
      <OffersSection />
      
      <PerformanceSection />
      
      <LifestyleSection />
      
      <PreOwnedSection />

      {/* Compare floating box */}
      {compareList.length > 0 && (
        <CompareFloatingBox 
          count={compareList.length} 
          onClick={() => document.getElementById("comparison-section")?.scrollIntoView({ behavior: "smooth" })}
        />
      )}

      {/* Modals and drawers */}
      <QuickViewModal 
        vehicle={quickViewVehicle} 
        isOpen={quickViewVehicle !== null}
        onClose={handleCloseQuickView}
        onCompare={handleCompare}
        isCompared={quickViewVehicle ? compareList.includes(quickViewVehicle.name) : false}
      />

      <FavoritesDrawer 
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        vehicles={vehicles}
      />
    </ToyotaLayout>
  );
};

export default Index;
