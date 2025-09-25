export interface Grade {
  id: string;
  name: string;
  price?: number;
  power?: string;
  range?: string;
  features?: string[];
  thumbnail?: string;
  description?: string;
  specifications?: {
    engine?: string;
    transmission?: string;
    acceleration?: string;
    topSpeed?: string;
    fuelEconomy?: string;
    drivetrain?: string;
    wheels?: string[];
    colors?: { name: string; code: string; image?: string }[];
  };
}

export interface SpecRow {
  key: string;
  label: string;
  values: Record<string, string | number | boolean | null>;
  category?: 'performance' | 'efficiency' | 'technology' | 'comfort' | 'safety';
}

export const defaultGrades: Grade[] = [
  {
    id: 'base',
    name: 'Base',
    price: 119900,
    power: '203 HP',
    range: '550 km',
    description: 'The perfect starting point with all essential features',
    thumbnail: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    features: [
      'Toyota Safety Sense 2.5+',
      '17" Alloy Wheels',
      '8" Touchscreen Display',
      'Apple CarPlay/Android Auto',
      'Adaptive Cruise Control'
    ],
    specifications: {
      engine: '2.5L Dynamic Force 4-Cylinder',
      transmission: '8-Speed Automatic',
      acceleration: '8.2 seconds 0-100 km/h',
      topSpeed: '210 km/h',
      fuelEconomy: '7.2L/100km',
      drivetrain: 'Front-Wheel Drive',
      wheels: ['17" Silver Alloy', '18" Black Alloy'],
      colors: [
        { name: 'Pearl White', code: '#FFFFFF' },
        { name: 'Midnight Black', code: '#000000' },
        { name: 'Silver Metallic', code: '#C0C0C0' }
      ]
    }
  },
  {
    id: 'sport',
    name: 'Sport',
    price: 139900,
    power: '268 HP',
    range: '520 km',
    description: 'Enhanced performance with sport-tuned suspension',
    thumbnail: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    features: [
      'Sport-Tuned Suspension',
      '19" Sport Alloy Wheels',
      'Leather-Appointed Seats',
      'Heated Front Seats',
      'Premium Audio System',
      'LED Headlights'
    ],
    specifications: {
      engine: '3.5L V6 Dynamic Force',
      transmission: '8-Speed Sport Automatic',
      acceleration: '6.8 seconds 0-100 km/h',
      topSpeed: '235 km/h',
      fuelEconomy: '8.5L/100km',
      drivetrain: 'All-Wheel Drive',
      wheels: ['19" Sport Black', '20" Performance'],
      colors: [
        { name: 'Racing Red', code: '#EB0A1E' },
        { name: 'Carbon Black', code: '#1C1C1C' },
        { name: 'Storm Silver', code: '#8C8C8C' },
        { name: 'Pearl White', code: '#FFFFFF' }
      ]
    }
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 159900,
    power: '268 HP',
    range: '500 km',
    description: 'Premium comfort with advanced technology features',
    thumbnail: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    features: [
      'Premium Leather Interior',
      'Panoramic Moonroof',
      'Heated & Ventilated Seats',
      'Premium JBL Audio',
      '12.3" Digital Display',
      'Wireless Charging',
      'Power Tailgate'
    ],
    specifications: {
      engine: '3.5L V6 Dynamic Force',
      transmission: '8-Speed Automatic',
      acceleration: '7.1 seconds 0-100 km/h',
      topSpeed: '220 km/h',
      fuelEconomy: '8.8L/100km',
      drivetrain: 'All-Wheel Drive',
      wheels: ['18" Luxury Chrome', '19" Premium'],
      colors: [
        { name: 'Platinum Pearl', code: '#E8E8E8' },
        { name: 'Midnight Black', code: '#000000' },
        { name: 'Champagne Gold', code: '#D4AF37' },
        { name: 'Deep Blue', code: '#003366' }
      ]
    }
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    price: 149900,
    power: '243 HP Combined',
    range: '850 km',
    description: 'Ultimate efficiency with hybrid technology',
    thumbnail: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    features: [
      'Hybrid Synergy Drive',
      'EV Mode Capability',
      'Regenerative Braking',
      'Eco Dashboard',
      'Hybrid Battery Warranty',
      'Predictive Efficiency'
    ],
    specifications: {
      engine: '2.5L Hybrid Dynamic Force',
      transmission: 'ECVT',
      acceleration: '7.8 seconds 0-100 km/h',
      topSpeed: '200 km/h',
      fuelEconomy: '4.5L/100km',
      drivetrain: 'Front-Wheel Drive',
      wheels: ['17" Eco Alloy', '18" Aero Design'],
      colors: [
        { name: 'Eco Blue', code: '#0066CC' },
        { name: 'Pearl White', code: '#FFFFFF' },
        { name: 'Silver Metallic', code: '#C0C0C0' },
        { name: 'Graphite Grey', code: '#666666' }
      ]
    }
  }
];

export const defaultSpecs: SpecRow[] = [
  {
    key: 'engine',
    label: 'Engine',
    category: 'performance',
    values: {
      base: '2.5L 4-Cylinder',
      sport: '3.5L V6',
      luxury: '3.5L V6',
      hybrid: '2.5L Hybrid'
    }
  },
  {
    key: 'power',
    label: 'Power Output',
    category: 'performance',
    values: {
      base: '203 HP',
      sport: '268 HP',
      luxury: '268 HP',
      hybrid: '243 HP Combined'
    }
  },
  {
    key: 'acceleration',
    label: '0-100 km/h',
    category: 'performance',
    values: {
      base: '8.2 sec',
      sport: '6.8 sec',
      luxury: '7.1 sec',
      hybrid: '7.8 sec'
    }
  },
  {
    key: 'fuelEconomy',
    label: 'Fuel Economy',
    category: 'efficiency',
    values: {
      base: '7.2L/100km',
      sport: '8.5L/100km',
      luxury: '8.8L/100km',
      hybrid: '4.5L/100km'
    }
  },
  {
    key: 'drivetrain',
    label: 'Drivetrain',
    category: 'performance',
    values: {
      base: 'FWD',
      sport: 'AWD',
      luxury: 'AWD',
      hybrid: 'FWD'
    }
  },
  {
    key: 'infotainment',
    label: 'Display',
    category: 'technology',
    values: {
      base: '8" Touchscreen',
      sport: '10.5" Display',
      luxury: '12.3" Digital',
      hybrid: '10.5" Eco Display'
    }
  },
  {
    key: 'safety',
    label: 'Safety Features',
    category: 'safety',
    values: {
      base: 'TSS 2.5+',
      sport: 'TSS 2.5+ Sport',
      luxury: 'TSS 2.5+ Premium',
      hybrid: 'TSS 2.5+ Eco'
    }
  },
  {
    key: 'wheels',
    label: 'Wheels',
    category: 'comfort',
    values: {
      base: '17" Alloy',
      sport: '19" Sport',
      luxury: '18" Luxury',
      hybrid: '17" Eco'
    }
  },
  {
    key: 'warranty',
    label: 'Warranty',
    category: 'comfort',
    values: {
      base: '5 years',
      sport: '5 years',
      luxury: '5 years',
      hybrid: '8 years battery'
    }
  }
];