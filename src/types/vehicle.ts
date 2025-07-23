
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
  id?: string;
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
  // Vehicle details page specific properties
  year?: number;
  gallery?: string[];
  lifestyleGallery?: string[];
  reviews?: Array<{
    author: string;
    content: string;
    rating: number;
  }>;
  ownerTestimonials?: Array<{
    owner: string;
    comment: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  relatedVehicles?: VehicleModel[];
  preOwnedSimilar?: VehicleModel[];
  // Pre-owned properties
  mileage?: string;
  location?: string;
  certification?: string;
  rating?: number;
  originalPrice?: number;
  warranty?: string;
  owners?: number;
  condition?: string;
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
