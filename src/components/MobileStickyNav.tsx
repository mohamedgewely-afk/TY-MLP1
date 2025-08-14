
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  SlidersHorizontal,
  Heart,
  Car,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Eye,
  Layers,
  Flame,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { VehicleModel } from "@/types/vehicle";

interface MobileStickyNavProps {
  activeItem?: string;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
  onQuickView?: () => void;
  onCompare?: () => void;
  compareCount?: number;
  onFavorite?: () => void;
  favoriteCount?: number;
  showTestDriveButton?: boolean;
  showEnquireButton?: boolean;
  onTestDrive?: () => void;
  onEnquire?: () => void;
  className?: string;
}

interface VehicleModelData {
  name: string;
  image: string;
  category: string;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem,
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
  onQuickView = () => {},
  onCompare = () => {},
  compareCount = 0,
  onFavorite = () => {},
  favoriteCount = 0,
  showTestDriveButton = false,
  showEnquireButton = false,
  onTestDrive,
  onEnquire,
  className = "",
}) => {
  const [showNewCars, setShowNewCars] = useState(false);
  const [showUsedCars, setShowUsedCars] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleNewCars = () => setShowNewCars(!showNewCars);
  const toggleUsedCars = () => setShowUsedCars(!showUsedCars);
  const toggleFilters = () => setShowFilters(!showFilters);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  };

  const handleSortOrderClick = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const vehicleModels: VehicleModelData[] = [
    {
      name: "Camry",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/7ad6ef76-e142-4094-b47d-965dcd346141/items/c39a5591-c85a-413a-b9e5-f980f1f24d4d/renditions/d5414b58-6e06-451d-9309-3233fe8a7002?binary=true",
      category: "Sedan"
    },
    {
      name: "Corolla",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/6668562b-e7cf-4230-9deb-900d5e8e2e53/items/f48d6e38-6f33-40c3-8e91-4bdf59fb3e60/renditions/505ee681-e3d2-41f3-95a5-c7b856a50048?binary=true",
      category: "Sedan"
    },
    {
      name: "RAV4",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/a5bffab2-6c0d-4698-bfe7-b4ab7114ec03/items/a8dbfe08-2cd5-4952-acf7-8dae2e49666d/renditions/bd938484-6fd4-4dc0-b0c9-8523c356964e?binary=true",
      category: "SUV"
    },
    {
      name: "Highlander",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/367b679d-7e64-4a14-bda0-a0ce1e8d1ce2/items/cfda750d-3631-4ad0-9489-25af5af99ec5/renditions/31f4c813-0a0e-4eaa-b1c2-151268277b59?binary=true",
      category: "SUV"
    },
    {
      name: "Prius",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/187049c6-862a-49e6-a109-e2340652f3cd/items/a6d44ead-2ed7-4760-b9a5-c74462c8b13e/renditions/0871895b-d3bf-42e2-a91c-9e696b410e8d?binary=true&mformat=true",
      category: "Hybrid"
    },
    {
      name: "Land Cruiser",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/155ca245-b83a-4c78-beb3-c294b97544a3/items/abdc9c2f-4fbc-4d9d-92c2-4eac0d713d96/renditions/9aacd1cf-1c24-4e3a-9874-db036dde2fdc?binary=true",
      category: "SUV"
    },
    {
      name: "GR Supra",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/b3eac42b-e400-4e0d-ab76-6c8a2df8f465/items/53649561-b41b-457a-8d6b-5a1d779f4cd6/renditions/2c3c9289-09f7-420e-8587-3e6ae42a5567?binary=true",
      category: "GR Performance"
    },
    {
      name: "Hiace",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/30fe3af9-5e61-403a-a2ed-eb0e9f0b3ca0/items/354a55f3-7aa4-43f6-a98f-9265a1ea8257/renditions/6c61ac4b-7466-4e58-962d-bbfeff425cff?binary=true",
      category: "Commercial"
    },
    {
      name: "Coaster",
      image: "https://aepprddxamb01.corp.al-futtaim.com/dx/api/dam/v1/collections/62cfa484-93ad-4230-821a-8096c177027e/items/4568b91a-823f-42d7-9f16-eac193cce140/renditions/ca79f885-d1af-4cfc-aed4-9763209ffec3?binary=true",
      category: "Commercial"
    }
  ];

  const categories = [...new Set(vehicleModels.map(vehicle => vehicle.category))];

  const filterModels = (models: VehicleModelData[]) => {
    let filtered = models;
    if (selectedCategory) {
      filtered = filtered.filter(vehicle => vehicle.category === selectedCategory);
    }

    // Sort the filtered models alphabetically based on the 'name' property
    filtered.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === 'asc' ? 1 : -1;
      }

      // names must be equal
      return 0;
    });
    return filtered;
  };

  const renderVehicleCard = (vehicle: VehicleModelData) => (
    <Card key={vehicle.name} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="font-semibold">{vehicle.name}</h3>
          <p className="text-sm">{vehicle.category}</p>
        </div>
      </div>
    </Card>
  );

  const renderNewCarsContent = () => (
    <AnimatePresence>
      {showNewCars && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="py-4">
            {/* Category Filter */}
            <div className="flex overflow-x-auto space-x-2 mb-3 px-2">
              <Button
                variant="outline"
                size="sm"
                className={`flex-shrink-0 rounded-full ${selectedCategory === null ? 'bg-primary text-primary-foreground' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => handleCategoryClick(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Order Button */}
            <div className="px-2 mb-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full rounded-full"
                onClick={handleSortOrderClick}
              >
                Sort by Name: {sortOrder === 'asc' ? 'A - Z' : 'Z - A'}
                {sortOrder === 'asc' ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-2 gap-4 px-2">
              {filterModels(vehicleModels).map(vehicle => renderVehicleCard(vehicle))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t z-50 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2">
          <Button onClick={toggleNewCars} variant="ghost" className="justify-start rounded-full">
            <Car className="mr-2 h-5 w-5" />
            New Cars
            <ChevronDown className="ml-auto h-5 w-5" />
          </Button>
          <Button onClick={toggleUsedCars} variant="ghost" className="justify-start rounded-full">
            <Flame className="mr-2 h-5 w-5" />
            Used Cars
            <ChevronDown className="ml-auto h-5 w-5" />
          </Button>
          <Button onClick={onQuickView} variant="ghost" className="rounded-full">
            <Eye className="h-5 w-5" />
            Quick View
          </Button>
          <Button onClick={onCompare} variant="ghost" className="relative rounded-full">
            <Layers className="h-5 w-5" />
            Compare
            {compareCount > 0 && (
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-0">
                {compareCount}
              </div>
            )}
          </Button>
          <Button onClick={onFavorite} variant="ghost" className="relative rounded-full">
            <Heart className="h-5 w-5" />
            Favorites
            {favoriteCount > 0 && (  
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-0">
                {favoriteCount}
              </div>
            )}
          </Button>
        </div>

        {/* New Cars Content */}
        {renderNewCarsContent()}

        {/* Used Cars Content (Placeholder) */}
        <AnimatePresence>
          {showUsedCars && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 text-center">
                <p className="text-gray-500">Used Cars content coming soon!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Buttons (Test Drive, Enquire) */}
        {(showTestDriveButton || showEnquireButton) && (
          <div className="flex justify-around p-2 border-t">
            {showTestDriveButton && (
              <Button onClick={onTestDrive || onBookTestDrive} variant="secondary" className="rounded-full">
                Book Test Drive
              </Button>
            )}
            {showEnquireButton && (
              <Button onClick={onEnquire} variant="secondary" className="rounded-full">
                Enquire Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileStickyNav;
