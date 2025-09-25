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

/**
 * demoVehicle, demoGrades and demoFeatures are intentionally small, well-formed
 * fixtures that other modules can safely import. All string literals are closed
 * and there are no placeholder fragments like "[...]" which can break parsers.
 */

export const demoVehicle: VehicleData = {
  hero: {
    imageUrl: 'https://dam.alfuttaim.com/example/hero-image.jpg?binary=true',
    videoUrl: '',
    poster: 'https://dam.alfuttaim.com/example/hero-poster.jpg?binary=true',
    caption: 'The Future of Automotive Excellence'
  },
  carousel: [
    {
      id: 'exterior',
      title: 'Bold Exterior Design',
      ctaLabel: 'Explore Design',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/example/exterior.jpg?binary=true',
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
        imageUrl: 'https://dam.alfuttaim.com/example/interior.jpg?binary=true',
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
        imageUrl: 'https://dam.alfuttaim.com/example/technology.jpg?binary=true',
        caption: 'Innovation at your fingertips'
      },
      bullets: [
        '12.3\" digital display',
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
    image: 'https://dam.alfuttaim.com/example/grade-le.jpg?binary=true',
    features: ['Toyota Safety Sense 2.0', 'LED Headlights', 'Apple CarPlay', '17\" Alloy Wheels'],
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
    image: 'https://dam.alfuttaim.com/example/grade-xle.jpg?binary=true',
    features: ['Moonroof', 'Heated Seats', 'Wireless Charging', '18\" Alloy Wheels'],
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
    image: 'https://dam.alfuttaim.com/example/grade-limited.jpg?binary=true',
    features: ['Leather Interior', 'JBL Audio', 'Advanced Climate', '19\" Alloy Wheels'],
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
    image: 'https://dam.alfuttaim.com/example/grade-hybrid.jpg?binary=true',
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
      imageUrl: 'https://dam.alfuttaim.com/example/feature-performance.jpg?binary=true',
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
      imageUrl: 'https://dam.alfuttaim.com/example/feature-safety.jpg?binary=true',
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
      imageUrl: 'https://dam.alfuttaim.com/example/feature-technology.jpg?binary=true',
      caption: 'Technology that adapts to you'
    },
    stats: [
      { label: 'Display', value: '12.3\"' },
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
      imageUrl: 'https://dam.alfuttaim.com/example/feature-luxury.jpg?binary=true',
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

/**
 * Backwards-compatible exports many parts of the codebase expect:
 * - vehicles: an array of VehicleModel-like objects
 * - preOwnedVehicles: subset of vehicles flagged as pre-owned
 * - heroSlides: array used by the homepage hero carousel
 *
 * Keep these small and safe to avoid parser/transformer errors.
 */
export const vehicles = [
  {
    id: 'demo-vehicle-1',
    name: 'Demo Vehicle',
    price: 149900,
    category: 'SUV',
    preOwned: false,
    image: demoVehicle.hero.imageUrl || '',
    features: demoFeatures.map((f) => f.title),
    specifications: {
      engine: demoGrades[0].specs.engine,
      power: demoGrades[0].specs.power,
      acceleration: demoGrades[0].specs.acceleration
    }
  }
];

export const preOwnedVehicles = vehicles.filter((v) => Boolean((v as any).preOwned));

export const heroSlides = demoVehicle.carousel;