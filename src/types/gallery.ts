export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  tags?: string[];
  scene?: string;
  category?: string;
}

export interface GallerySection {
  id: string;
  title: string;
  description?: string;
  items: GalleryItem[];
}

export interface EnhancedSceneData {
  id: string;
  title: string;
  scene?: string;
  tags?: string[];
  description?: string;
  category?: string;
  media: {
    gallery: GalleryItem[];
    hero?: string;
    video?: string;
  };
}

export interface GalleryFilterOptions {
  category?: string;
  tags?: string[];
  type?: 'all' | 'image' | 'video';
}

export interface GalleryViewMode {
  type: 'grid' | 'carousel' | 'masonry';
  columns?: number;
}