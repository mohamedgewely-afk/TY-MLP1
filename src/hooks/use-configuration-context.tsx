
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConfigurationOption {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

interface ConfigurationState {
  selectedOptions: ConfigurationOption[];
  addOption: (option: ConfigurationOption) => void;
  removeOption: (optionId: string) => void;
  clearAll: () => void;
  getOptionsByCategory: (category: string) => ConfigurationOption[];
}

const ConfigurationContext = createContext<ConfigurationState | undefined>(undefined);

export const useConfigurationContext = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfigurationContext must be used within ConfigurationProvider');
  }
  return context;
};

interface ConfigurationProviderProps {
  children: ReactNode;
}

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = ({ children }) => {
  const [selectedOptions, setSelectedOptions] = useState<ConfigurationOption[]>([]);

  const addOption = useCallback((option: ConfigurationOption) => {
    setSelectedOptions(prev => {
      // Remove existing option in same category, then add new one
      const filtered = prev.filter(opt => opt.category !== option.category || opt.id !== option.id);
      return [...filtered, option];
    });
  }, []);

  const removeOption = useCallback((optionId: string) => {
    setSelectedOptions(prev => prev.filter(opt => opt.id !== optionId));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedOptions([]);
  }, []);

  const getOptionsByCategory = useCallback((category: string) => {
    return selectedOptions.filter(opt => opt.category === category);
  }, [selectedOptions]);

  const value = {
    selectedOptions,
    addOption,
    removeOption,
    clearAll,
    getOptionsByCategory,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};
