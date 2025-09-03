import { EnhancedSceneData } from '@/types/gallery';

export const enhancedGalleryData: EnhancedSceneData[] = [
  {
    id: 'exterior-design',
    title: 'Exterior Design',
    scene: 'exterior',
    tags: ['design', 'exterior', 'styling'],
    description: 'Explore the bold and sophisticated exterior design',
    category: 'design',
    media: {
      gallery: [
        {
          id: 'ext-front',
          title: 'Front View',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_01_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_01_400x224.jpg',
          tags: ['front', 'grille', 'headlights'],
          scene: 'exterior'
        },
        {
          id: 'ext-side',
          title: 'Side Profile',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_02_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_02_400x224.jpg',
          tags: ['profile', 'wheels', 'silhouette'],
          scene: 'exterior'
        },
        {
          id: 'ext-rear',
          title: 'Rear View',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_03_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_03_400x224.jpg',
          tags: ['rear', 'taillights', 'spoiler'],
          scene: 'exterior'
        }
      ],
      hero: 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_01_800x447.jpg'
    }
  },
  {
    id: 'interior-comfort',
    title: 'Interior Comfort',
    scene: 'interior',
    tags: ['comfort', 'interior', 'luxury'],
    description: 'Experience premium comfort and craftsmanship',
    category: 'interior',
    media: {
      gallery: [
        {
          id: 'int-dashboard',
          title: 'Dashboard',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_400x224.jpg',
          tags: ['dashboard', 'display', 'controls'],
          scene: 'interior'
        },
        {
          id: 'int-seats',
          title: 'Premium Seating',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_02_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_02_400x224.jpg',
          tags: ['seats', 'leather', 'comfort'],
          scene: 'interior'
        }
      ],
      hero: 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg'
    }
  },
  {
    id: 'performance',
    title: 'Performance',
    scene: 'performance',
    tags: ['performance', 'power', 'efficiency'],
    description: 'Discover advanced performance capabilities',
    category: 'performance',
    media: {
      gallery: [
        {
          id: 'perf-engine',
          title: 'Engine Performance',
          type: 'image',
          url: 'https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg',
          thumbnail: 'https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_400x224.jpg',
          tags: ['engine', 'power', 'hybrid'],
          scene: 'performance'
        }
      ],
      hero: 'https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg'
    }
  }
];

export const getGalleryDataByCategory = (category: string) => {
  return enhancedGalleryData.filter(item => item.category === category);
};

export const getGalleryDataByTags = (tags: string[]) => {
  return enhancedGalleryData.filter(item => 
    item.tags?.some(tag => tags.includes(tag))
  );
};