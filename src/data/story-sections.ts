

import { VehicleModel } from "@/types/vehicle";

export interface StorySectionStat {
  label: string;
  value: number | string;
  unit: string;
}

export interface StorySection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: StorySectionStat[];
  cta: {
    label: string;
    action: () => void;
  };
  layout: 'text-left' | 'text-right';
}

export const createStorySections = (
  galleryImages: string[],
  monthlyEMI: number,
  setIsBookingOpen: (open: boolean) => void,
  navigate: (path: string) => void,
  setIsFinanceOpen: (open: boolean) => void,
  modalHandlers?: {
    onSafetyExplore?: () => void;
    onConnectivityExplore?: () => void;
    onHybridTechExplore?: () => void;
    onInteriorExplore?: () => void;
  }
): StorySection[] => [
  {
    id: 'performance',
    title: 'Immediate response with confident control.',
    subtitle: 'Performance',
    description: 'Smooth acceleration, balanced handling, and a whisper-quiet cabin make every drive a pleasure.',
    image: galleryImages[2],
    stats: [
      { label: 'Acceleration', value: '0-100', unit: 'km/h in 8.9s' },
      { label: 'Power Output', value: 196, unit: 'HP' },
      { label: 'Top Speed', value: 180, unit: 'km/h' }
    ],
    cta: { label: 'Feel it – Test Drive', action: () => setIsBookingOpen(true) },
    layout: 'text-left'
  },
  {
    id: 'safety',
    title: 'Proactive protection, 360° awareness.',
    subtitle: 'Safety Sense',
    description: 'Adaptive cruise, collision assist, and intelligent lane guidance keep you safe.',
    image: galleryImages[1],
    stats: [
      { label: 'Safety Rating', value: 5, unit: 'Stars' },
      { label: 'Safety Features', value: 10, unit: 'Advanced Systems' },
      { label: 'Response Time', value: 0.5, unit: 'Seconds' }
    ],
    cta: { 
      label: 'See Safety Suite', 
      action: modalHandlers?.onSafetyExplore || (() => navigate('/safety'))
    },
    layout: 'text-right'
  },
  {
    id: 'connected',
    title: 'Wireless Apple CarPlay & Android Auto.',
    subtitle: 'Connected Life',
    description: 'Stay connected with voice control, OTA updates, and smart integration.',
    image: galleryImages[0],
    stats: [
      { label: 'Screen Size', value: 9, unit: 'Inches' },
      { label: 'Wireless Charging', value: 15, unit: 'W Fast Charge' },
      { label: 'Apps', value: 100, unit: 'Compatible' }
    ],
    cta: { 
      label: 'Explore Connectivity', 
      action: modalHandlers?.onConnectivityExplore || (() => navigate('/connect'))
    },
    layout: 'text-left'
  },
  {
    id: 'sustainable',
    title: 'Hybrid efficiency meets real-world performance.',
    subtitle: 'Sustainable Innovation',
    description: 'Advanced hybrid technology that reduces emissions while delivering exceptional performance.',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/a1495897-db6d-401b-b04b-32aea391261c/renditions/c8b3de7a-40a2-4450-84ba-e06e45af51f1?binary=true',
    stats: [
      { label: 'Fuel Economy', value: 4.5, unit: 'L/100km' },
      { label: 'CO₂ Reduction', value: 40, unit: '% Less Emissions' },
      { label: 'Electric Range', value: 65, unit: 'km EV Mode' }
    ],
    cta: { 
      label: 'Explore Hybrid Tech', 
      action: modalHandlers?.onHybridTechExplore || (() => navigate('/hybrid'))
    },
    layout: 'text-right'
  },
  {
    id: 'comfort',
    title: 'Crafted for comfort, designed for life.',
    subtitle: 'Premium Comfort & Design',
    description: 'Luxurious materials, ergonomic design, and spacious interior create your personal sanctuary.',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/42f030ab-e6fa-444c-8233-aad8aa428a71/items/14a16f35-b752-4b2e-b91a-42d981935cea/renditions/30455a3f-116c-4371-a1db-ddb7a42a2e16?binary=true',
    stats: [
      { label: 'Premium Materials', value: 12, unit: 'Soft-Touch Surfaces' },
      { label: 'Seating Space', value: 95, unit: 'cm Legroom' },
      { label: 'Climate Zones', value: 2, unit: 'Independent Control' }
    ],
    cta: { 
      label: 'Experience Interior', 
      action: modalHandlers?.onInteriorExplore || (() => navigate('/interior'))
    },
    layout: 'text-left'
  },
  {
    id: 'ownership',
    title: 'Clear pricing, finance made simple.',
    subtitle: 'Ownership',
    description: `Get estimated EMI of ${monthlyEMI.toLocaleString()} AED/mo or build your deal online.`,
    image: galleryImages[1],
    stats: [
      { label: 'Monthly EMI', value: monthlyEMI, unit: 'AED/mo' },
      { label: 'Warranty', value: 5, unit: 'Years Coverage' },
      { label: 'Service Network', value: 50, unit: 'Centers in UAE' }
    ],
    cta: { label: 'Calculate EMI', action: () => setIsFinanceOpen(true) },
    layout: 'text-right'
  }
];
