
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  isMenuOpen: boolean;
  activeSection: string | null;
  isActionsExpanded: boolean;
}

export const useNavigationState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [state, setState] = useState<NavigationState>({
    isMenuOpen: false,
    activeSection: null,
    isActionsExpanded: false
  });

  const resetNavigation = useCallback(() => {
    setState({
      isMenuOpen: false,
      activeSection: null,
      isActionsExpanded: false
    });
  }, []);

  const setMenuOpen = useCallback((open: boolean) => {
    setState(prev => ({
      ...prev,
      isMenuOpen: open,
      activeSection: open ? prev.activeSection : null
    }));
  }, []);

  const setActiveSection = useCallback((section: string | null) => {
    setState(prev => ({
      ...prev,
      activeSection: section,
      isMenuOpen: section !== null
    }));
  }, []);

  const setActionsExpanded = useCallback((expanded: boolean) => {
    setState(prev => ({
      ...prev,
      isActionsExpanded: expanded
    }));
  }, []);

  const navigateAndReset = useCallback((path: string) => {
    resetNavigation();
    navigate(path);
  }, [navigate, resetNavigation]);

  return {
    ...state,
    resetNavigation,
    setMenuOpen,
    setActiveSection,
    setActionsExpanded,
    navigateAndReset
  };
};
