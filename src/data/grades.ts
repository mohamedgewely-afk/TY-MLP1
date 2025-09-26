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

export const grades: Grade[] = [
  {
    id: 'gx',
    name: 'GX',
    price: 289900,
    monthlyFrom: 2899,
    badge: 'Essential',
    badgeColor: 'bg-blue-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
    features: [
      'Toyota Safety Sense 3.0',
      'LED Headlights',
      'Apple CarPlay',
      '18" Alloy Wheels',
      'Dual-Zone Climate Control'
    ],
    specs: {
      engine: '3.5L V6 Twin-Turbo',
      power: '409 HP',
      torque: '650 Nm',
      transmission: '10-Speed Automatic',
      acceleration: '6.7 seconds',
      fuelEconomy: '10.0L/100km'
    }
  },
  {
    id: 'gxr',
    name: 'GXR',
    price: 329900,
    monthlyFrom: 3299,
    badge: 'Popular',
    badgeColor: 'bg-green-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true',
    features: [
      'Leather Interior',
      'Sunroof',
      'Wireless Charging',
      '20" Alloy Wheels',
      'Premium Audio System'
    ],
    specs: {
      engine: '3.5L V6 Twin-Turbo',
      power: '409 HP',
      torque: '650 Nm',
      transmission: '10-Speed Automatic',
      acceleration: '6.7 seconds',
      fuelEconomy: '10.0L/100km'
    }
  },
  {
    id: 'vxr',
    name: 'VXR',
    price: 369900,
    monthlyFrom: 3699,
    badge: 'Premium',
    badgeColor: 'bg-purple-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true',
    features: [
      'Premium Leather Interior',
      'JBL Premium Audio',
      'Advanced Climate Control',
      '20" Premium Wheels',
      'Head-Up Display'
    ],
    specs: {
      engine: '3.5L V6 Twin-Turbo',
      power: '409 HP',
      torque: '650 Nm',
      transmission: '10-Speed Automatic',
      acceleration: '6.7 seconds',
      fuelEconomy: '10.0L/100km'
    }
  },
  {
    id: 'gr-sport',
    name: 'GR Sport',
    price: 419900,
    monthlyFrom: 4199,
    badge: 'Performance',
    badgeColor: 'bg-red-600',
    image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true',
    features: [
      'GR-Tuned Suspension',
      'Sport Exhaust System',
      'Carbon Fiber Accents',
      '22" GR Wheels',
      'Performance Brakes'
    ],
    specs: {
      engine: '3.5L V6 Twin-Turbo',
      power: '409 HP',
      torque: '650 Nm',
      transmission: '10-Speed Automatic',
      acceleration: '6.7 seconds',
      fuelEconomy: '10.0L/100km'
    }
  }
];