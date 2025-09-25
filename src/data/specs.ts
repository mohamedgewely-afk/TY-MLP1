export interface SpecRow {
  key: string;
  label: string;
  category: 'performance' | 'efficiency' | 'technology' | 'comfort' | 'safety';
  values: Record<string, string | number>;
  unit?: string;
  highlight?: boolean;
}

export const specificationData: SpecRow[] = [
  {
    key: 'engine',
    label: 'Engine Type',
    category: 'performance',
    values: {
      base: '2.5L 4-Cylinder',
      sport: '3.5L V6',
      luxury: '3.5L V6',
      hybrid: '2.5L Hybrid'
    },
    highlight: true
  },
  {
    key: 'power',
    label: 'Power Output',
    category: 'performance',
    values: {
      base: 203,
      sport: 268,
      luxury: 268,
      hybrid: 243
    },
    unit: 'HP',
    highlight: true
  },
  {
    key: 'torque',
    label: 'Torque',
    category: 'performance',
    values: {
      base: 184,
      sport: 248,
      luxury: 248,
      hybrid: 221
    },
    unit: 'lb-ft',
    highlight: true
  },
  {
    key: 'acceleration',
    label: '0-100 km/h',
    category: 'performance',
    values: {
      base: 8.2,
      sport: 6.8,
      luxury: 7.1,
      hybrid: 7.8
    },
    unit: 'seconds',
    highlight: true
  },
  {
    key: 'fuelEconomy',
    label: 'Fuel Economy',
    category: 'efficiency',
    values: {
      base: 7.2,
      sport: 8.5,
      luxury: 8.8,
      hybrid: 4.5
    },
    unit: 'L/100km',
    highlight: true
  },
  {
    key: 'transmission',
    label: 'Transmission',
    category: 'performance',
    values: {
      base: '8-Speed Automatic',
      sport: '8-Speed Sport Auto',
      luxury: '8-Speed Automatic',
      hybrid: 'ECVT'
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
    key: 'infotainment',
    label: 'Display Size',
    category: 'technology',
    values: {
      base: 8,
      sport: 10.5,
      luxury: 12.3,
      hybrid: 10.5
    },
    unit: 'inches'
  },
  {
    key: 'safety',
    label: 'Safety Rating',
    category: 'safety',
    values: {
      base: '5-Star',
      sport: '5-Star',
      luxury: '5-Star',
      hybrid: '5-Star'
    },
    highlight: true
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
  },
  {
    key: 'seating',
    label: 'Seating Capacity',
    category: 'comfort',
    values: {
      base: 5,
      sport: 5,
      luxury: 5,
      hybrid: 5
    },
    unit: 'passengers'
  }
];

export const getSpecsByCategory = (category: SpecRow['category']) => {
  return specificationData.filter(spec => spec.category === category);
};

export const getHighlightedSpecs = () => {
  return specificationData.filter(spec => spec.highlight);
};

export const getSpecValue = (specKey: string, gradeId: string) => {
  const spec = specificationData.find(s => s.key === specKey);
  if (!spec) return null;
  
  const value = spec.values[gradeId];
  return spec.unit ? `${value} ${spec.unit}` : value;
};