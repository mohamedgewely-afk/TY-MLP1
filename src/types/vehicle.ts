
export interface VehicleModel {
  name: string;
  image: string;
  mmeUrl: string;
  configureUrl: string;
  price: number;
  category: string;
  features: string[];
  specifications?: {
    engine?: string;
    transmission?: string;
    fuelEconomy?: string;
    safetyRating?: string;
    warranty?: string;
  };
}

export interface PreOwnedVehicle {
  id: string;
  model: string;
  image: string;
  description: string;
  year: number;
  price: number;
  mileage: number;
  certified: boolean;
  specifications?: {
    engine?: string;
    transmission?: string;
    previousOwners?: number;
    condition?: string;
    warranty?: string;
  };
}
