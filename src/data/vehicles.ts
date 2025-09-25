export interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

export interface VehicleData {
  hero: Media;
  carousel: Array<{
    id: string;
    title: string;
    ctaLabel?: string;
    media: Media;
    bullets?: string[];
  }>;
}

export interface Grade {
  id: string;
  name: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

export interface Feature {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

export const demoVehicle: VehicleData = {
  hero: {
    imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true',
    videoUrl: '',
    poster: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true',
    caption: 'The Future of Automotive Excellence'
  },
  carousel: [
    {
      id: 'exterior',
      title: 'Bold Exterior Design',
      ctaLabel: 'Explore Design',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true',
        caption: 'Sculpted for performance'
      },
      bullets: [
        'Aerodynamic body design',
        'LED signature lighting',
        'Premium paint finishes',
        'Sporty wheel options'
      ]
    },
    {
      id: 'interior',
      title: 'Luxurious Interior',
      ctaLabel: 'Experience Comfort',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true',
        caption: 'Comfort redefined'
      },
      bullets: [
        'Premium leather appointments',
        'Heated and ventilated seats',
        'Panoramic moonroof',
        'Ambient lighting'
      ]
    },
    {
      id: 'technology',
      title: 'Smart Technology',
      ctaLabel: 'Discover Features',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true',
        caption: 'Innovation at your fingertips'
      },
      bullets: [
        '12.3" digital display',
        'Wireless connectivity',
        'Premium audio system',
        'Advanced driver assistance'
      ]
    }
  ]
};

export const demoGrades: Grade[] = [
  {
    id: 'le',
    name: 'LE',
    price: 129900,
    monthlyFrom: 945,
    badge: 'Popular Choice',
    badgeColor: 'bg-blue-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true',
    features: ['Toyota Safety Sense 2.0', 'LED Headlights', 'Apple CarPlay', '17" Alloy Wheels'],
    specs: {
      engine: '2.5L 4-Cylinder',
      power: '203 HP',
      torque: '184 lb-ft',
      transmission: '8-Speed Automatic',
      acceleration: '8.2 seconds',
      fuelEconomy: '7.2L/100km'
    }
  },
  {
    id: 'xle',
    name: 'XLE',
    price: 139900,
    monthlyFrom: 1059,
    badge: 'Best Value',
    badgeColor: 'bg-green-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true',
    features: ['Moonroof', 'Heated Seats', 'Wireless Charging', '18" Alloy Wheels'],
    specs: {
      engine: '2.5L 4-Cylinder',
      power: '203 HP',
      torque: '184 lb-ft',
      transmission: '8-Speed Automatic',
      acceleration: '8.2 seconds',
      fuelEconomy: '7.2L/100km'
    }
  },
  {
    id: 'limited',
    name: 'Limited',
    price: 149900,
    monthlyFrom: 1189,
    badge: 'Premium',
    badgeColor: 'bg-purple-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true',
    features: ['Leather Interior', 'JBL Audio', 'Advanced Climate', '19" Alloy Wheels'],
    specs: {
      engine: '2.5L 4-Cylinder',
      power: '203 HP',
      torque: '184 lb-ft',
      transmission: '8-Speed Automatic',
      acceleration: '8.2 seconds',
      fuelEconomy: '7.2L/100km'
    }
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    price: 159900,
    monthlyFrom: 1289,
    badge: 'Eco Choice',
    badgeColor: 'bg-emerald-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true',
    features: ['Hybrid Synergy Drive', 'EV Mode', 'Regenerative Braking', 'Eco Dashboard'],
    specs: {
      engine: '2.5L Hybrid',
      power: '243 HP Combined',
      torque: '221 Nm',
      transmission: 'ECVT',
      acceleration: '7.8 seconds',
      fuelEconomy: '4.5L/100km'
    }
  }
];

export const demoFeatures: Feature[] = [
  {
    id: 'performance',
    title: 'Unmatched Performance',
    description: 'Experience the perfect balance of power and efficiency with our advanced hybrid technology.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true',
      caption: 'Power meets efficiency'
    },
    stats: [
      { label: 'Power', value: '268 HP' },
      { label: '0-100 km/h', value: '6.8 sec' },
      { label: 'Top Speed', value: '235 km/h' }
    ],
    badge: 'Performance'
  },
  {
    id: 'safety',
    title: 'Advanced Safety',
    description: 'State-of-the-art safety systems that protect you and your passengers.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true',
      caption: 'Safety first'
    },
    stats: [
      { label: 'Safety Rating', value: '5 Stars' },
      { label: 'Airbags', value: '10' },
      { label: 'Safety Features', value: '25+' }
    ],
    badge: 'Safety'
  },
  {
    id: 'technology',
    title: 'Smart Technology',
    description: 'Cutting-edge connectivity and intelligent systems for the modern driver.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true',
      caption: 'Technology that adapts to you'
    },
    stats: [
      { label: 'Display', value: '12.3"' },
      { label: 'Connectivity', value: '5G Ready' },
      { label: 'AI Features', value: '25+' }
    ],
    badge: 'Technology'
  },
  {
    id: 'luxury',
    title: 'Premium Comfort',
    description: 'Meticulously crafted interior with attention to every detail.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true',
      caption: 'Crafted for excellence'
    },
    stats: [
      { label: 'Materials', value: 'Premium' },
      { label: 'Climate Zones', value: '4' },
      { label: 'Massage Points', value: '10' }
    ],
    badge: 'Luxury'
  }
];