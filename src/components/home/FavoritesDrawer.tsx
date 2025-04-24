
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { VehicleModel } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleModel[];
}

const FavoritesDrawer = ({ isOpen, onClose, vehicles }: FavoritesDrawerProps) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteVehicles, setFavoriteVehicles] = useState<VehicleModel[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavoriteIds(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error('Error parsing favorites:', err);
        setFavoriteIds([]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (vehicles && favoriteIds.length) {
      const favs = vehicles.filter(v => favoriteIds.includes(v.id || v.name));
      setFavoriteVehicles(favs);
    } else {
      setFavoriteVehicles([]);
    }
  }, [favoriteIds, vehicles]);

  const removeFavorite = (vehicleId: string) => {
    const updated = favoriteIds.filter(id => id !== vehicleId);
    setFavoriteIds(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
    localStorage.removeItem('favorites');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-toyota-red" />
            Your Favorites
          </SheetTitle>
        </SheetHeader>
        
        {favoriteVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <Heart className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No favorites yet</h3>
            <p className="text-gray-500 mt-2 max-w-xs">
              Add vehicles to your favorites to save them for later.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFavorites}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear All
              </Button>
            </div>
            
            <div className="space-y-4">
              {favoriteVehicles.map(vehicle => (
                <div 
                  key={vehicle.id || vehicle.name} 
                  className="flex items-center gap-4 border rounded-lg p-3 hover:bg-gray-50"
                >
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{vehicle.name}</h4>
                    <p className="text-sm text-gray-500">{vehicle.category}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFavorite(vehicle.id || vehicle.name)}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      asChild
                      className="h-7 w-7"
                    >
                      <Link to={`/vehicle/${vehicle.name.toLowerCase()}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesDrawer;
