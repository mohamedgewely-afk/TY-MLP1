
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { SceneData, SceneCategory } from '@/components/vehicle-details/VehicleGallery';

interface GalleryState {
  scenes: SceneData[];
  activeIndex: number;
  selectedScene: SceneData | null;
  filter: SceneCategory | 'All';
  ambientEnabled: boolean;
  narrationEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  userPreferences: {
    autoplayNarration: boolean;
    ambientVolume: number;
    narrationVolume: number;
    reducedMotion: boolean;
  };
}

type GalleryAction =
  | { type: 'SET_SCENES'; payload: SceneData[] }
  | { type: 'SET_ACTIVE_INDEX'; payload: number }
  | { type: 'SET_SELECTED_SCENE'; payload: SceneData | null }
  | { type: 'SET_FILTER'; payload: SceneCategory | 'All' }
  | { type: 'TOGGLE_AMBIENT' }
  | { type: 'TOGGLE_NARRATION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<GalleryState['userPreferences']> };

const initialState: GalleryState = {
  scenes: [],
  activeIndex: 0,
  selectedScene: null,
  filter: 'All',
  ambientEnabled: false,
  narrationEnabled: false,
  isLoading: false,
  error: null,
  userPreferences: {
    autoplayNarration: false,
    ambientVolume: 0.35,
    narrationVolume: 0.8,
    reducedMotion: false
  }
};

const galleryReducer = (state: GalleryState, action: GalleryAction): GalleryState => {
  switch (action.type) {
    case 'SET_SCENES':
      return { ...state, scenes: action.payload };
    case 'SET_ACTIVE_INDEX':
      return { ...state, activeIndex: action.payload };
    case 'SET_SELECTED_SCENE':
      return { ...state, selectedScene: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload, activeIndex: 0 };
    case 'TOGGLE_AMBIENT':
      return { ...state, ambientEnabled: !state.ambientEnabled };
    case 'TOGGLE_NARRATION':
      return { ...state, narrationEnabled: !state.narrationEnabled };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
    default:
      return state;
  }
};

interface GalleryContextValue {
  state: GalleryState;
  dispatch: React.Dispatch<GalleryAction>;
  actions: {
    setScenes: (scenes: SceneData[]) => void;
    setActiveIndex: (index: number) => void;
    selectScene: (scene: SceneData | null) => void;
    setFilter: (filter: SceneCategory | 'All') => void;
    toggleAmbient: () => void;
    toggleNarration: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updatePreferences: (preferences: Partial<GalleryState['userPreferences']>) => void;
  };
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  const actions = {
    setScenes: useCallback((scenes: SceneData[]) => {
      dispatch({ type: 'SET_SCENES', payload: scenes });
    }, []),
    
    setActiveIndex: useCallback((index: number) => {
      dispatch({ type: 'SET_ACTIVE_INDEX', payload: index });
    }, []),
    
    selectScene: useCallback((scene: SceneData | null) => {
      dispatch({ type: 'SET_SELECTED_SCENE', payload: scene });
    }, []),
    
    setFilter: useCallback((filter: SceneCategory | 'All') => {
      dispatch({ type: 'SET_FILTER', payload: filter });
    }, []),
    
    toggleAmbient: useCallback(() => {
      dispatch({ type: 'TOGGLE_AMBIENT' });
    }, []),
    
    toggleNarration: useCallback(() => {
      dispatch({ type: 'TOGGLE_NARRATION' });
    }, []),
    
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),
    
    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),
    
    updatePreferences: useCallback((preferences: Partial<GalleryState['userPreferences']>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    }, [])
  };

  const value: GalleryContextValue = {
    state,
    dispatch,
    actions
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
