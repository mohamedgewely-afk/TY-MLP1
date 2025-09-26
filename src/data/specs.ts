export interface SpecRow {
  key: string;
  label: string;
  values: Record<string, string | number | boolean | null>;
  category: string;
  highlight?: boolean;
}

export const specs: SpecRow[] = [
  // Engine & Performance
  {
    key: 'engine',
    label: 'Engine Type',
    values: {
      'gx': '3.5L V6 Twin-Turbo',
      'gxr': '3.5L V6 Twin-Turbo',
      'vxr': '3.5L V6 Twin-Turbo',
      'gr-sport': '3.5L V6 Twin-Turbo'
    },
    category: 'performance',
    highlight: true
  },
  {
    key: 'power',
    label: 'Max Power',
    values: {
      'gx': '409 HP',
      'gxr': '409 HP',
      'vxr': '409 HP',
      'gr-sport': '409 HP'
    },
    category: 'performance',
    highlight: true
  },
  {
    key: 'torque',
    label: 'Max Torque',
    values: {
      'gx': '650 Nm',
      'gxr': '650 Nm',
      'vxr': '650 Nm',
      'gr-sport': '650 Nm'
    },
    category: 'performance',
    highlight: true
  },
  {
    key: 'transmission',
    label: 'Transmission',
    values: {
      'gx': '10-Speed Automatic',
      'gxr': '10-Speed Automatic',
      'vxr': '10-Speed Automatic',
      'gr-sport': '10-Speed Automatic'
    },
    category: 'performance'
  },
  {
    key: 'acceleration',
    label: '0-100 km/h',
    values: {
      'gx': '6.7 seconds',
      'gxr': '6.7 seconds',
      'vxr': '6.7 seconds',
      'gr-sport': '6.7 seconds'
    },
    category: 'performance',
    highlight: true
  },
  {
    key: 'fuel-economy',
    label: 'Fuel Economy',
    values: {
      'gx': '10.0L/100km',
      'gxr': '10.0L/100km',
      'vxr': '10.0L/100km',
      'gr-sport': '10.5L/100km'
    },
    category: 'efficiency',
    highlight: true
  },
  
  // Dimensions
  {
    key: 'length',
    label: 'Length',
    values: {
      'gx': '4950mm',
      'gxr': '4950mm',
      'vxr': '4950mm',
      'gr-sport': '4950mm'
    },
    category: 'dimensions'
  },
  {
    key: 'width',
    label: 'Width',
    values: {
      'gx': '1980mm',
      'gxr': '1980mm',
      'vxr': '1980mm',
      'gr-sport': '1980mm'
    },
    category: 'dimensions'
  },
  {
    key: 'height',
    label: 'Height',
    values: {
      'gx': '1925mm',
      'gxr': '1925mm',
      'vxr': '1925mm',
      'gr-sport': '1925mm'
    },
    category: 'dimensions'
  },
  {
    key: 'ground-clearance',
    label: 'Ground Clearance',
    values: {
      'gx': '230mm',
      'gxr': '230mm',
      'vxr': '230mm',
      'gr-sport': '220mm'
    },
    category: 'dimensions',
    highlight: true
  },
  
  // Features
  {
    key: 'seating',
    label: 'Seating Capacity',
    values: {
      'gx': '8 seats',
      'gxr': '8 seats',
      'vxr': '7 seats',
      'gr-sport': '7 seats'
    },
    category: 'comfort'
  },
  {
    key: 'leather',
    label: 'Leather Interior',
    values: {
      'gx': false,
      'gxr': true,
      'vxr': true,
      'gr-sport': true
    },
    category: 'comfort'
  },
  {
    key: 'sunroof',
    label: 'Sunroof',
    values: {
      'gx': false,
      'gxr': true,
      'vxr': true,
      'gr-sport': true
    },
    category: 'comfort'
  },
  {
    key: 'audio',
    label: 'Audio System',
    values: {
      'gx': '6 Speakers',
      'gxr': '14 Speakers',
      'vxr': 'JBL Premium',
      'gr-sport': 'JBL Premium'
    },
    category: 'technology'
  },
  
  // Safety
  {
    key: 'airbags',
    label: 'Airbags',
    values: {
      'gx': '10 airbags',
      'gxr': '10 airbags',
      'vxr': '10 airbags',
      'gr-sport': '10 airbags'
    },
    category: 'safety'
  },
  {
    key: 'safety-rating',
    label: 'Safety Rating',
    values: {
      'gx': '5 Stars',
      'gxr': '5 Stars',
      'vxr': '5 Stars',
      'gr-sport': '5 Stars'
    },
    category: 'safety',
    highlight: true
  },
  
  // Technology
  {
    key: 'display',
    label: 'Display Size',
    values: {
      'gx': '8 inches',
      'gxr': '12.3 inches',
      'vxr': '12.3 inches',
      'gr-sport': '12.3 inches'
    },
    category: 'technology'
  },
  {
    key: 'wireless-charging',
    label: 'Wireless Charging',
    values: {
      'gx': false,
      'gxr': true,
      'vxr': true,
      'gr-sport': true
    },
    category: 'technology'
  },
  
  // Capability
  {
    key: 'approach-angle',
    label: 'Approach Angle',
    values: {
      'gx': '32°',
      'gxr': '32°',
      'vxr': '32°',
      'gr-sport': '30°'
    },
    category: 'capability'
  },
  {
    key: 'departure-angle',
    label: 'Departure Angle',
    values: {
      'gx': '24°',
      'gxr': '24°',
      'vxr': '24°',
      'gr-sport': '22°'
    },
    category: 'capability'
  },
  {
    key: 'wading-depth',
    label: 'Wading Depth',
    values: {
      'gx': '700mm',
      'gxr': '700mm',
      'vxr': '700mm',
      'gr-sport': '700mm'
    },
    category: 'capability'
  }
];