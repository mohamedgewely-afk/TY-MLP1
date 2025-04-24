
// Add `mpg` and `horsepower` to specifications
export interface VehicleModel {
  id?: string;
  name: string;
  category: string;
  image: string;
  heroImage?: string;
  price: number;
  features: string[];
  configureUrl?: string;
  galleryImages?: string[];
  isNew?: boolean;
  isHybrid?: boolean;
  specifications?: {
    engine?: string;
    transmission?: string;
    drivetrain?: string;
    mpg?: string;
    horsepower?: string;
    [key: string]: any;
  };
  tagline?: string;
}
