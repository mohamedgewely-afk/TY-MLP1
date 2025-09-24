export type Media = {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
  alt?: string;
};

export type Grade = {
  id: string;
  name: string;
  price?: number;
  power?: string;
  range?: string;
  features?: string[];
  thumbnail?: string;
};

export type SpecRow = {
  key: string;
  label: string;
  values: Record<string, string | number | boolean | null>;
};

export interface VehicleData {
  hero: Media;
  highlights: Array<{ id: string; title: string; description?: string; media: Media }>;
  carousel: Array<{ id: string; title: string; ctaLabel?: string; media: Media; bullets?: string[] }>;  
  grades: Grade[];
  specs: SpecRow[];
}