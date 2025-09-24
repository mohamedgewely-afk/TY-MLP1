export interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

export interface VehicleData {
  hero: Media;
  highlights: Array<{
    id: string;
    title: string;
    description?: string;
    media: Media;
    stats?: Array<{ label: string; value: string }>;
  }>;
  carousel: Array<{
    id: string;
    title: string;
    ctaLabel?: string;
    media: Media;
    bullets?: string[];
  }>;
  grades: any[];
  specs: any[];
}

export const demoVehicleData: VehicleData = {
  hero: {
    imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    videoUrl: '',
    poster: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
    caption: 'The Future of Automotive Excellence'
  },
  highlights: [
    {
      id: 'performance',
      title: 'Unmatched Performance',
      description: 'Experience the perfect balance of power and efficiency with our advanced hybrid technology.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
        caption: 'Power meets efficiency'
      },
      stats: [
        { label: 'Power', value: '268 HP' },
        { label: '0-100 km/h', value: '6.8 sec' },
        { label: 'Top Speed', value: '235 km/h' }
      ]
    },
    {
      id: 'technology',
      title: 'Advanced Technology',
      description: 'State-of-the-art connectivity and intelligent safety systems for the modern driver.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
        caption: 'Technology that adapts to you'
      },
      stats: [
        { label: 'Display', value: '12.3"' },
        { label: 'Connectivity', value: '5G Ready' },
        { label: 'AI Features', value: '25+' }
      ]
    },
    {
      id: 'luxury',
      title: 'Premium Comfort',
      description: 'Meticulously crafted interior with attention to every detail for the ultimate driving experience.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
        caption: 'Crafted for excellence'
      },
      stats: [
        { label: 'Materials', value: 'Premium' },
        { label: 'Climate Zones', value: '4' },
        { label: 'Massage Points', value: '10' }
      ]
    },
    {
      id: 'efficiency',
      title: 'Eco Innovation',
      description: 'Leading the way in sustainable mobility with cutting-edge hybrid and electric technology.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
        caption: 'Sustainable by design'
      },
      stats: [
        { label: 'Efficiency', value: '4.5L/100km' },
        { label: 'Emissions', value: 'Low CO₂' },
        { label: 'Range', value: '850 km' }
      ]
    }
  ],
  carousel: [
    {
      id: 'exterior',
      title: 'Bold Exterior Design',
      ctaLabel: 'Explore Design',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
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
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
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
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/dc9b6eaa-cc71-4e6b-b9a8-2ede7939749f/items/19d9b6ba-2cee-4d91-b3b3-621f72452918/renditions/9c9119d9-d77c-4c13-a2aa-b0f9e55219cb?binary=true&mformat=true',
        caption: 'Innovation at your fingertips'
      },
      bullets: [
        '12.3" digital display',
        'Wireless connectivity',
        'Premium audio system',
        'Advanced driver assistance'
      ]
    }
  ],
  grades: [],
  specs: []
};

// Analytics events
export const analyticsEvents = {
  viewItem: (itemId: string, itemName: string, category: string) => ({
    event: 'view_item',
    parameters: {
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      timestamp: Date.now()
    }
  }),
  addToCompare: (itemId: string, itemName: string) => ({
    event: 'add_to_compare',
    parameters: {
      item_id: itemId,
      item_name: itemName,
      timestamp: Date.now()
    }
  }),
  startBuild: (vehicleId: string, vehicleName: string) => ({
    event: 'start_build',
    parameters: {
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      timestamp: Date.now()
    }
  }),
  bookTestDrive: (vehicleId: string, dealerLocation?: string) => ({
    event: 'book_test_drive',
    parameters: {
      vehicle_id: vehicleId,
      dealer_location: dealerLocation,
      timestamp: Date.now()
    }
  })
};