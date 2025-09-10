import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Modal state types
interface ModalState {
  activeModal: string | null;
  modalStack: string[];
  priority: Record<string, number>;
}

type ModalAction = 
  | { type: 'OPEN_MODAL'; id: string; priority?: number }
  | { type: 'CLOSE_MODAL'; id: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'CLOSE_TOP' };

// Modal priorities (higher = more important)
export const MODAL_PRIORITIES = {
  error: 100,
  confirmation: 90,
  booking: 80,
  finance: 70,
  carBuilder: 60,
  offers: 50,
  info: 40,
  gallery: 30
} as const;

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'OPEN_MODAL': {
      const priority = action.priority ?? MODAL_PRIORITIES.info;
      const newStack = [...state.modalStack.filter(id => id !== action.id), action.id];
      
      // Sort by priority to determine active modal
      const sortedStack = newStack.sort((a, b) => 
        (state.priority[b] ?? 0) - (state.priority[a] ?? 0)
      );
      
      return {
        ...state,
        activeModal: sortedStack[0] || null,
        modalStack: newStack,
        priority: { ...state.priority, [action.id]: priority }
      };
    }
    
    case 'CLOSE_MODAL': {
      const newStack = state.modalStack.filter(id => id !== action.id);
      const { [action.id]: _, ...newPriority } = state.priority;
      
      const sortedStack = newStack.sort((a, b) => 
        (newPriority[b] ?? 0) - (newPriority[a] ?? 0)
      );
      
      return {
        ...state,
        activeModal: sortedStack[0] || null,
        modalStack: newStack,
        priority: newPriority
      };
    }
    
    case 'CLOSE_ALL':
      return {
        activeModal: null,
        modalStack: [],
        priority: {}
      };
    
    case 'CLOSE_TOP': {
      if (state.modalStack.length === 0) return state;
      
      const topModal = state.activeModal;
      if (!topModal) return state;
      
      const newStack = state.modalStack.filter(id => id !== topModal);
      const { [topModal]: _, ...newPriority } = state.priority;
      
      const sortedStack = newStack.sort((a, b) => 
        (newPriority[b] ?? 0) - (newPriority[a] ?? 0)
      );
      
      return {
        ...state,
        activeModal: sortedStack[0] || null,
        modalStack: newStack,
        priority: newPriority
      };
    }
    
    default:
      return state;
  }
};

const initialState: ModalState = {
  activeModal: null,
  modalStack: [],
  priority: {}
};

// Context
interface ModalContextType {
  state: ModalState;
  openModal: (id: string, priority?: number) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  closeTopModal: () => void;
  isModalActive: (id: string) => boolean;
  isAnyModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

// Provider
export const OptimizedModalProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const openModal = useCallback((id: string, priority?: number) => {
    dispatch({ type: 'OPEN_MODAL', id, priority });
  }, []);

  const closeModal = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_MODAL', id });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL' });
  }, []);

  const closeTopModal = useCallback(() => {
    dispatch({ type: 'CLOSE_TOP' });
  }, []);

  const isModalActive = useCallback((id: string) => {
    return state.activeModal === id;
  }, [state.activeModal]);

  const isAnyModalOpen = state.modalStack.length > 0;

  const contextValue: ModalContextType = {
    state,
    openModal,
    closeModal,
    closeAllModals,
    closeTopModal,
    isModalActive,
    isAnyModalOpen
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook
export const useOptimizedModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useOptimizedModal must be used within OptimizedModalProvider');
  }
  return context;
};

// Keyboard handler for modal stack
export const useModalKeyboardHandler = () => {
  const { closeTopModal, isAnyModalOpen } = useOptimizedModal();

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAnyModalOpen) {
        e.preventDefault();
        closeTopModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeTopModal, isAnyModalOpen]);
};