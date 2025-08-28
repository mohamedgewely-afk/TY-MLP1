
export type ExperienceType = 'gallery' | 'video' | '360tour' | 'comparison' | 'interactive' | 'feature-focus';

export type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night" | "Performance" | "Safety" | "Technology";

export interface MediaData {
  primaryImage: string;
  videoUrl?: string;
  gallery?: string[];
  tour360Url?: string;
  thumbnail?: string;
}

export interface InteractionData {
  hotspots?: Array<{
    x: number;
    y: number;
    title: string;
    description: string;
    icon?: string;
  }>;
  comparison?: {
    beforeImage: string;
    afterImage: string;
    beforeLabel: string;
    afterLabel: string;
  };
}

export interface CTAButton {
  label: string;
  action: string;
  primary?: boolean;
  icon?: string;
}

export interface EnhancedSceneData {
  id: string;
  title: string;
  subtitle?: string;
  scene: SceneCategory;
  experienceType: ExperienceType;
  description: string;
  media: MediaData;
  specs?: Record<string, string>;
  interactionData?: InteractionData;
  ctaButtons?: CTAButton[];
  featured?: boolean;
  duration?: string; // For video content
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // For interactive content
  tags?: string[];
}

export interface FilterOptions {
  categories: SceneCategory[];
  experienceTypes: ExperienceType[];
  searchTerm: string;
  sortBy: 'featured' | 'newest' | 'popular' | 'alphabetical';
}

export interface ViewPreferences {
  layout: 'grid' | 'carousel';
  cardSize: 'small' | 'medium' | 'large';
  showPreviews: boolean;
}
