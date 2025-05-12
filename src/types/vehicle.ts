
export interface Vehicle {
  id: string;
  model: string;
  image: string;
  description: string;
  price: number;
  engine: string;
  power: string;
  acceleration: string;
  topSpeed: string;
  fuelConsumption: string;
}

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
  make: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  image: string;
  certified: boolean;
  bodyType: string;
  color: string;
  transmission?: string;
  features?: string[];
}
