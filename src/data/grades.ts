export interface GradeSpec {
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
  highlights: string[];
}

export const gradeSpecs: GradeSpec[] = [
  {
    id: 'base',
    name: 'Base',
    price: 119900,
    monthlyFrom: 845,
    badge: 'Essential',
    badgeColor: 'bg-gray-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true',
    features: [
      'Toyota Safety Sense 2.0',
      '17" Alloy Wheels',
      '8" Touchscreen Display',
      'Apple CarPlay/Android Auto',
      'Adaptive Cruise Control'
    ],
    specs: {
      engine: '2.5L Dynamic Force 4-Cylinder',
      power: '203 HP',
      torque: '184 lb-ft',
      transmission: '8-Speed Automatic',
      acceleration: '8.2 seconds',
      fuelEconomy: '7.2L/100km'
    },
    highlights: ['Essential features', 'Great value', 'Reliable performance']
  },
  {
    id: 'sport',
    name: 'Sport',
    price: 139900,
    monthlyFrom: 945,
    badge: 'Performance',
    badgeColor: 'bg-red-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true',
    features: [
      'Sport-Tuned Suspension',
      '19" Sport Alloy Wheels',
      'Leather-Appointed Seats',
      'Heated Front Seats',
      'Premium Audio System',
      'LED Headlights'
    ],
    specs: {
      engine: '3.5L V6 Dynamic Force',
      power: '268 HP',
      torque: '248 lb-ft',
      transmission: '8-Speed Sport Automatic',
      acceleration: '6.8 seconds',
      fuelEconomy: '8.5L/100km'
    },
    highlights: ['Enhanced performance', 'Sport styling', 'Premium features']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    price: 159900,
    monthlyFrom: 1089,
    badge: 'Premium',
    badgeColor: 'bg-purple-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true',
    features: [
      'Premium Leather Interior',
      'Panoramic Moonroof',
      'Heated & Ventilated Seats',
      'Premium JBL Audio',
      '12.3" Digital Display',
      'Wireless Charging',
      'Power Tailgate'
    ],
    specs: {
      engine: '3.5L V6 Dynamic Force',
      power: '268 HP',
      torque: '248 lb-ft',
      transmission: '8-Speed Automatic',
      acceleration: '7.1 seconds',
      fuelEconomy: '8.8L/100km'
    },
    highlights: ['Ultimate luxury', 'Premium materials', 'Advanced technology']
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    price: 149900,
    monthlyFrom: 1045,
    badge: 'Eco Choice',
    badgeColor: 'bg-green-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true',
    features: [
      'Hybrid Synergy Drive',
      'EV Mode Capability',
      'Regenerative Braking',
      'Eco Dashboard',
      'Hybrid Battery Warranty',
      'Predictive Efficiency'
    ],
    specs: {
      engine: '2.5L Hybrid Dynamic Force',
      power: '243 HP Combined',
      torque: '221 Nm',
      transmission: 'ECVT',
      acceleration: '7.8 seconds',
      fuelEconomy: '4.5L/100km'
    },
    highlights: ['Maximum efficiency', 'Environmental friendly', 'Advanced hybrid tech']
  }
];