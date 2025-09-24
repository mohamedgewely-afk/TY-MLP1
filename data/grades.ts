import type { Grade } from "../types.d.ts";

export const SAMPLE_GRADES: Grade[] = [
  {
    id: "base",
    name: "Base",
    price: 45000,
    power: "285 hp",
    range: "N/A",
    features: ["LED Headlights", "Cloth Seats"],
    thumbnail: "https://via.placeholder.com/400x250.png?text=Base",
  },
  {
    id: "premium",
    name: "Premium",
    price: 56000,
    power: "305 hp",
    range: "N/A",
    features: ["Leather", "Panoramic Roof"],
    thumbnail: "https://via.placeholder.com/400x250.png?text=Premium",
  },
  {
    id: "sport",
    name: "GR Sport",
    price: 69000,
    power: "325 hp",
    range: "N/A",
    features: ["Sport Tuned", "Carbon Trim"],
    thumbnail: "https://via.placeholder.com/400x250.png?text=GR+Sport",
  },
  {
    id: "limited",
    name: "Limited",
    price: 82000,
    power: "340 hp",
    range: "N/A",
    features: ["Advanced Safety", "Bespoke Interior"],
    thumbnail: "https://via.placeholder.com/400x250.png?text=Limited",
  },
];