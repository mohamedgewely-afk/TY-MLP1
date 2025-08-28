
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";

// Import the correct types from VehicleGallery
export type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night";

export interface SceneData {
  id: string;
  title: string;
  scene: SceneCategory;
  image: string;
  description: string;
  specs: Record<string, string>;
}

export const useVehicleData = (vehicleName?: string) => {
  const { vehicleName: paramVehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentVehicleName = vehicleName || paramVehicleName;

  // Camry Hybrid specific gallery scenes with proper DAM URLs
  const galleryScenes = useMemo((): SceneData[] => [
    {
      id: "camry-exterior-hero",
      title: "Camry Hybrid",
      scene: "Exterior",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
      description: "Bold exterior design meets hybrid efficiency. Sculpted lines and aerodynamic excellence.",
      specs: {
        horsepower: "208 hp combined",
        torque: "221 Nm",
        fuelEconomy: "4.1 L/100km",
        drivetrain: "Hybrid Synergy Drive"
      }
    },
    {
      id: "camry-interior",
      title: "Camry Hybrid",
      scene: "Interior",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      description: "Premium comfort meets advanced technology. Spacious cabin with intelligent design.",
      specs: {
        seats: "Premium leather seating",
        infotainment: "9'' Toyota Touch 2",
        safety: "Toyota Safety Sense 2.0",
        climate: "Dual-zone automatic A/C"
      }
    },
    {
      id: "camry-urban",
      title: "Camry Hybrid",
      scene: "Urban",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
      description: "City driving redefined. Silent EV mode for urban environments.",
      specs: {
        fuelEconomy: "4.1 L/100km city",
        evMode: "Up to 2 km EV range",
        transmission: "E-CVT Automatic",
        emissions: "94 g/km CO₂"
      }
    },
    {
      id: "camry-capability",
      title: "Camry Hybrid",
      scene: "Capability",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      description: "Hybrid Synergy Drive technology. Seamless power delivery and efficiency.",
      specs: {
        hybridSystem: "Hybrid Synergy Drive",
        battery: "Nickel-Metal Hydride",
        regeneration: "Regenerative braking",
        warranty: "8-year hybrid warranty"
      }
    },
    {
      id: "camry-night",
      title: "Camry Hybrid",
      scene: "Night",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
      description: "Sophisticated LED lighting signature. Premium presence after dark.",
      specs: {
        headlights: "LED with DRL",
        taillights: "LED signature design",
        ambient: "Interior ambient lighting",
        visibility: "Automatic high beam"
      }
    }
  ], []);

  // Legacy gallery images for compatibility
  const galleryImages = useMemo(() => galleryScenes.map(scene => scene.image), [galleryScenes]);

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
    setIsError(false);
    
    const foundVehicle = vehicles.find((v) => {
      if (v.id === currentVehicleName) return true;
      const slug = v.name.toLowerCase().replace(/^toyota\s+/, "").replace(/\s+/g, "-");
      return slug === currentVehicleName;
    });

    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
      setIsError(false);
    } else {
      setIsError(true);
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));

    setIsLoading(false);
    window.scrollTo(0, 0);
  }, [currentVehicleName]);

  return {
    data: vehicle,
    isLoading,
    isError,
    vehicle,
    isFavorite,
    galleryImages,
    galleryScenes,
    monthlyEMI,
    toggleFavorite,
    navigate
  };
};
