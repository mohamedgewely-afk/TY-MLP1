export interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

export interface Highlight {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

export interface CarouselItem {
  id: string;
  title: string;
  ctaLabel?: string;
  media: Media;
  bullets?: string[];
}

export interface TechFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  highlights: string[];
  specs?: Array<{ label: string; value: string }>;
}

export interface VehicleData {
  hero: Media;
  highlights: Highlight[];
  carousel: CarouselItem[];
  techFeatures?: TechFeature[];
}

export const vehicleData: VehicleData = {
  hero: {
    imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
    videoUrl: '',
    poster: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
    caption: 'The Future of Automotive Excellence'
  },
  highlights: [
    {
      id: 'performance',
      title: 'Unmatched Performance',
      description: 'Experience the perfect balance of power and efficiency with our advanced hybrid technology.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
        caption: 'Power meets efficiency'
      },
      stats: [
        { label: 'Power', value: '409 HP' },
        { label: '0-100 km/h', value: '6.7 sec' },
        { label: 'Top Speed', value: '210 km/h' }
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
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true',
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
    },
    {
      id: 'efficiency',
      title: 'Eco Innovation',
      description: 'Leading the way in sustainable mobility with cutting-edge hybrid and electric technology.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true',
        caption: 'Sustainable by design'
      },
      stats: [
        { label: 'Efficiency', value: '10.0L/100km' },
        { label: 'Emissions', value: 'Low CO₂' },
        { label: 'Range', value: '850 km' }
      ],
      badge: 'Eco'
    },
    {
      id: 'capability',
      title: 'Off-Road Mastery',
      description: 'Unmatched capability and reliability for those who demand the very best in off-road excellence.',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true',
        caption: 'Built for any terrain'
      },
      stats: [
        { label: 'Ground Clearance', value: '230mm' },
        { label: 'Approach Angle', value: '32°' },
        { label: 'Departure Angle', value: '24°' }
      ],
      badge: 'Capability'
    }
  ],
  carousel: [
    {
      id: 'exterior',
      title: 'Bold Exterior Design',
      ctaLabel: 'Explore Design',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
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
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true',
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
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true',
        caption: 'Innovation at your fingertips'
      },
      bullets: [
        '12.3" digital display',
        'Wireless connectivity',
        'Premium audio system',
        'Advanced driver assistance'
      ]
    },
    {
      id: 'capability',
      title: 'Off-Road Excellence',
      ctaLabel: 'Test Capability',
      media: {
        imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true',
        caption: 'Built for adventure'
      },
      bullets: [
        'Multi-terrain select',
        'Crawl control',
        'Hill descent control',
        'Locking differentials'
      ]
    }
  ],
  techFeatures: [
    {
      id: 'safety-suite',
      title: 'Toyota Safety Sense 3.0',
      subtitle: 'Advanced Driver Assistance',
      description: 'Our most comprehensive safety suite uses advanced cameras, radar, and lidar to help prevent accidents before they happen.',
      mediaType: 'image',
      mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true',
      highlights: ['Pre-Collision System', 'Lane Departure Alert', 'Dynamic Radar Cruise Control', 'Road Sign Assist'],
      specs: [
        { label: 'Detection Range', value: '120m' },
        { label: 'Response Time', value: '0.2s' },
        { label: 'Accuracy', value: '99.7%' }
      ]
    },
    {
      id: 'infotainment',
      title: 'Next-Gen Multimedia',
      subtitle: 'Connected Intelligence',
      description: 'The 14-inch HD touchscreen puts everything at your fingertips.',
      mediaType: 'image',
      mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true',
      highlights: ['14" HD Touchscreen', 'Wireless Apple CarPlay', 'Cloud Navigation', 'OTA Updates'],
      specs: [
        { label: 'Screen Size', value: '14 inches' },
        { label: 'Resolution', value: '1920x1080' },
        { label: 'Response Time', value: '<50ms' }
      ]
    }
  ]
};