
import React, { useState, useEffect } from "react";
import { X, Heart, Trash2, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface FavoritesDrawerProps {
  triggerButton?: React.ReactNode;
}

const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({ triggerButton }) => {
  const [favoriteVehicles, setFavoriteVehicles] = useState<VehicleModel[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const favVehicles = vehicles.filter(vehicle => 
        favorites.includes(vehicle.name)
      );
      setFavoriteVehicles(favVehicles);
    };
    
    loadFavorites();
    
    // Add event listener to update favorites if changed in another component
    window.addEventListener('favorites-updated', loadFavorites);
    
    return () => {
      window.removeEventListener('favorites-updated', loadFavorites);
    };
  }, [open]);
  
  const removeFromFavorites = (vehicle: VehicleModel) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = favorites.filter((name: string) => name !== vehicle.name);
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavoriteVehicles(favoriteVehicles.filter(v => v.name !== vehicle.name));
    
    toast({
      title: "Removed from favorites",
      description: `${vehicle.name} has been removed from your favorites.`,
    });
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('favorites-updated'));
  };
  
  const clearAllFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify([]));
    setFavoriteVehicles([]);
    
    toast({
      title: "Favorites cleared",
      description: "All vehicles have been removed from your favorites.",
    });
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('favorites-updated'));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="relative">
            <Heart className="h-4 w-4 mr-2" />
            <span>Favorites</span>
            {favoriteVehicles.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-toyota-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoriteVehicles.length}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>Your Favorites</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="py-4">
          {favoriteVehicles.length > 0 ? (
            <>
              <div className="space-y-4">
                {favoriteVehicles.map((vehicle) => (
                  <div 
                    key={vehicle.name}
                    className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1 p-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vehicle.category} - AED {vehicle.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 p-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromFavorites(vehicle)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link 
                        to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setOpen(false)}
                      >
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={clearAllFavorites}>
                  Clear All
                </Button>
                <Button className="bg-toyota-red hover:bg-toyota-darkred">
                  Compare All
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                No Favorites Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Save your favorite Toyota vehicles for easy comparison later.
              </p>
              <Button 
                onClick={() => setOpen(false)} 
                className="bg-toyota-red hover:bg-toyota-darkred"
              >
                Browse Vehicles
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesDrawer;
