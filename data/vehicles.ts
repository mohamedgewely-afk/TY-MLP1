import type { VehicleData } from "../types.d.ts";
import { placeholderImage } from "../utils/dam";

export const SAMPLE_VEHICLE: VehicleData = {
  hero: {
    imageUrl: placeholderImage(1600, 900, "Land Cruiser Hero"),
    poster: placeholderImage(1200, 675, "Land Cruiser Poster"),
    videoUrl: undefined,
    caption: "The new Land Cruiser — refined for the modern road.",
    alt: "Toyota Land Cruiser front three-quarter view",
  },
  highlights: [
    { id: "h1", title: "Tough. Refined.", description: "Carbon matte finishes with minimalist luxury.", media: { imageUrl: placeholderImage(800, 600, "Highlight 1") } },
    { id: "h2", title: "Advanced Safety", description: "Toyota Safety Sense upgraded.", media: { imageUrl: placeholderImage(800, 600, "Highlight 2") } },
    { id: "h3", title: "Premium Cabin", description: "Spacious cabin with luxury materials.", media: { imageUrl: placeholderImage(800, 600, "Highlight 3") } },
    { id: "h4", title: "Off-road Prowess", description: "GR tuned suspension for confidence.", media: { imageUrl: placeholderImage(800, 600, "Highlight 4") } },
  ],
  carousel: [
    { id: "c1", title: "Exterior", ctaLabel: "Explore Exterior", bullets: ["Carbon-Matte Hood", "Byd Accents"], media: { imageUrl: placeholderImage(1200, 800, "Carousel 1") } },
    { id: "c2", title: "Interior", ctaLabel: "Explore Interior", bullets: ["Bespoke Seats", "Ambient Lighting"], media: { imageUrl: placeholderImage(1200, 800, "Carousel 2") } },
    { id: "c3", title: "Performance", ctaLabel: "Explore Performance", bullets: ["GR Sport Tuned"], media: { imageUrl: placeholderImage(1200, 800, "Carousel 3") } },
  ],
  grades: [],
  specs: [],
};