
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";

export const useVehicleData = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Optimized gallery images with proper loading
  const galleryImages = useMemo(() => [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
  ], []);

  const calculateEMI = useCallback((price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  }, []);

  const monthlyEMI = useMemo(() => vehicle ? calculateEMI(vehicle.price) : 0, [vehicle, calculateEMI]);

  const toggleFavorite = useCallback(() => {
    if (!vehicle) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== vehicle.name);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({ title: "Removed from favorites", description: `${vehicle.name} has been removed from your favorites.` });
    } else {
      favorites.push(vehicle.name);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast({ title: "Added to favorites", description: `${vehicle.name} has been added to your favorites.` });
    }
    window.dispatchEvent(new Event("favorites-updated"));
  }, [vehicle, isFavorite, toast]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay to prevent flash
    const timer = setTimeout(() => {
      try {
        const foundVehicle = vehicles.find((v) => {
          if (v.id === vehicleName) return true;
          const slug = v.name.toLowerCase().replace(/^toyota\s+/, "").replace(/\s+/g, "-");
          return slug === vehicleName;
        });

        if (foundVehicle) {
          setVehicle(foundVehicle);
          document.title = `${foundVehicle.name} | Toyota UAE`;
          
          const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
          setIsFavorite(favorites.some((fav: string) => fav === foundVehicle.name));
        } else {
          setError(`Vehicle "${vehicleName}" not found`);
        }
      } catch (err) {
        setError("Failed to load vehicle data");
        console.error("Vehicle loading error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 100);

    window.scrollTo(0, 0);
    
    return () => clearTimeout(timer);
  }, [vehicleName]);

  return {
    vehicle,
    isFavorite,
    galleryImages,
    monthlyEMI,
    toggleFavorite,
    navigate,
    isLoading,
    error
  };
};
