
import { create } from 'zustand'
import { EnhancedSceneData, FilterOptions, ViewPreferences } from '@/types/gallery'

interface GalleryStore {
  // View state
  selectedExperience: EnhancedSceneData | null
  isExpanded: boolean
  
  // Filter state
  filters: FilterOptions
  viewPrefs: ViewPreferences
  
  // Actions
  setSelectedExperience: (experience: EnhancedSceneData | null) => void
  setIsExpanded: (expanded: boolean) => void
  setFilters: (filters: FilterOptions) => void
  setViewPrefs: (viewPrefs: ViewPreferences) => void
  clearFilters: () => void
}

const defaultFilters: FilterOptions = {
  categories: [],
  experienceTypes: [],
  searchTerm: '',
  sortBy: 'featured'
}

const defaultViewPrefs: ViewPreferences = {
  layout: 'grid',
  cardSize: 'medium',
  showPreviews: true
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  selectedExperience: null,
  isExpanded: false,
  filters: defaultFilters,
  viewPrefs: defaultViewPrefs,
  
  setSelectedExperience: (experience) => set({ selectedExperience: experience }),
  setIsExpanded: (expanded) => set({ isExpanded: expanded }),
  setFilters: (filters) => set({ filters }),
  setViewPrefs: (viewPrefs) => set({ viewPrefs }),
  clearFilters: () => set({ filters: defaultFilters })
}))
