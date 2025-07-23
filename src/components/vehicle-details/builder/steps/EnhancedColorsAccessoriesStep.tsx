
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { hapticFeedback } from "@/utils/haptic";

interface EnhancedColorsAccessoriesStepProps {
  config: { 
    exteriorColor: string;
    interiorColor: string;
    accessories: string[];
  };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { 
    name: "Pearl White", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", 
    price: 0,
    stock: 'available',
    eta: null,
    colorCode: '#F8F8FF'
  },
  { 
    name: "Midnight Black", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", 
    price: 500,
    stock: 'pipeline',
    eta: '2-3 weeks',
    colorCode: '#0F0F0F'
  },
  { 
    name: "Silver Metallic", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", 
    price: 300,
    stock: 'unavailable',
    eta: null,
    colorCode: '#C0C0C0'
  }
];

const interiorColors = [
  { name: "Black Leather", price: 0, stock: 'available', colorCode: '#1C1C1C' },
  { name: "Beige Leather", price: 800, stock: 'pipeline', eta: '1-2 weeks', colorCode: '#F5F5DC' },
  { name: "Gray Fabric", price: -500, stock: 'unavailable', colorCode: '#808080' }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, stock: 'available' },
  { name: "Sunroof", price: 800, stock: 'available' },
  { name: "Navigation System", price: 600, stock: 'pipeline', eta: '3-4 weeks' },
  { name: "Heated Seats", price: 400, stock: 'available' },
  { name: "Backup Camera", price: 300, stock: 'unavailable' },
  { name: "Alloy Wheels", price: 900, stock: 'available' }
];

const EnhancedColorsAccessoriesStep: React.FC<EnhancedColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'accessories'>('colors');
  const [selectedCombination, setSelectedCombination] = useState<{exterior: string, interior: string} | null>(null);
  const { t, isRTL } = useLanguage();

  // Initialize selected combination
  useEffect(() => {
    if (config.exteriorColor && config.interiorColor) {
      setSelectedCombination({
        exterior: config.exteriorColor,
        interior: config.interiorColor
      });
    }
  }, [config.exteriorColor, config.interiorColor]);

  const getStockIcon = (stock: string) => {
    switch (stock) {
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pipeline':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStockBadge = (stock: string, eta?: string) => {
    switch (stock) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200">{t('builder.inStock')}</Badge>;
      case 'pipeline':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{t('builder.pipeline')} {eta && `- ${eta}`}</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800 border-red-200">{t('builder.noStock')}</Badge>;
      default:
        return null;
    }
  };

  const getCombinedStock = (exteriorStock: string, interiorStock: string) => {
    if (exteriorStock === 'unavailable' || interiorStock === 'unavailable') return 'unavailable';
    if (exteriorStock === 'pipeline' || interiorStock === 'pipeline') return 'pipeline';
    return 'available';
  };

  const handleColorCombinationSelect = (exteriorColor: string, interiorColor: string) => {
    hapticFeedback.selection();
    setSelectedCombination({ exterior: exteriorColor, interior: interiorColor });
    setConfig((prev: any) => ({
      ...prev,
      exteriorColor,
      interiorColor
    }));
  };

  const handleAccessoryToggle = (accessoryName: string) => {
    hapticFeedback.light();
    setConfig((prev: any) => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter((a: string) => a !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  const resetSelections = () => {
    hapticFeedback.medium();
    setConfig((prev: any) => ({
      ...prev,
      exteriorColor: "Pearl White",
      interiorColor: "Black Leather",
      accessories: []
    }));
    setSelectedCombination({ exterior: "Pearl White", interior: "Black Leather" });
  };

  return (
    <div className="p-4 pb-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-2">
          {t('builder.exteriorColor')} & {t('builder.interiorColor')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={resetSelections}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </motion.div>
      
      {/* Enhanced Tabs with Gradient */}
      <div className="flex space-x-1 mb-6 bg-gradient-to-r from-muted/50 to-muted/80 backdrop-blur-sm rounded-lg p-1 shadow-inner">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
            activeTab === 'colors'
              ? 'bg-gradient-to-r from-background via-background/95 to-background text-foreground shadow-lg scale-105'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <motion.span
            animate={{ scale: activeTab === 'colors' ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Color Combinations
          </motion.span>
        </button>
        <button
          onClick={() => setActiveTab('accessories')}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
            activeTab === 'accessories'
              ? 'bg-gradient-to-r from-background via-background/95 to-background text-foreground shadow-lg scale-105'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <motion.span
            animate={{ scale: activeTab === 'accessories' ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t('builder.accessories')}
          </motion.span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Combined Color Selection */}
        {activeTab === 'colors' && (
          <motion.div
            key="colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="space-y-4"
          >
            {exteriorColors.map((exteriorColor, extIndex) => (
              <motion.div
                key={exteriorColor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: extIndex * 0.1, duration: 0.5 }}
                className="bg-gradient-to-r from-card via-card/95 to-card/90 rounded-xl p-4 shadow-lg border border-border/50 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative">
                    <img 
                      src={exteriorColor.image} 
                      alt={exteriorColor.name} 
                      className="w-16 h-10 object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg opacity-20 mix-blend-multiply"
                      style={{ backgroundColor: exteriorColor.colorCode }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{exteriorColor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStockIcon(exteriorColor.stock)}
                      {getStockBadge(exteriorColor.stock, exteriorColor.eta)}
                    </div>
                  </div>
                  {exteriorColor.price > 0 && (
                    <span className="text-primary font-medium">+AED {exteriorColor.price}</span>
                  )}
                </div>

                {/* Interior Color Options for this Exterior */}
                <div className="grid grid-cols-1 gap-2 ml-4">
                  {interiorColors.map((interiorColor, intIndex) => {
                    const isSelected = selectedCombination?.exterior === exteriorColor.name && selectedCombination?.interior === interiorColor.name;
                    const combinedStock = getCombinedStock(exteriorColor.stock, interiorColor.stock);
                    const isUnavailable = combinedStock === 'unavailable';
                    
                    return (
                      <motion.button
                        key={`${exteriorColor.name}-${interiorColor.name}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (extIndex * 0.1) + (intIndex * 0.05), duration: 0.3 }}
                        onClick={() => !isUnavailable && handleColorCombinationSelect(exteriorColor.name, interiorColor.name)}
                        disabled={isUnavailable}
                        className={`p-3 rounded-lg transition-all duration-300 border-2 text-left relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-primary shadow-lg transform scale-105' 
                            : isUnavailable
                              ? 'bg-muted/50 border-muted-foreground/20 opacity-60 cursor-not-allowed'
                              : 'bg-gradient-to-r from-background via-background/95 to-background/90 border-border hover:border-primary/50 hover:shadow-md hover:scale-102'
                        }`}
                        whileHover={!isUnavailable ? { 
                          y: -2,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        } : {}}
                        whileTap={!isUnavailable ? { scale: 0.98 } : {}}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: interiorColor.colorCode }}
                              />
                              <span className="font-medium text-foreground">{interiorColor.name}</span>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <Check className="h-4 w-4 text-primary" />
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStockIcon(interiorColor.stock)}
                            {interiorColor.price !== 0 && (
                              <span className={`text-sm font-medium ${interiorColor.price > 0 ? 'text-primary' : 'text-green-600'}`}>
                                {interiorColor.price > 0 ? '+' : ''}AED {interiorColor.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Accessories */}
        {activeTab === 'accessories' && (
          <motion.div
            key="accessories"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="space-y-3"
          >
            {accessories.map((accessory, index) => (
              <motion.div
                key={accessory.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden group ${
                  config.accessories.includes(accessory.name)
                    ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-primary shadow-lg transform scale-105' 
                    : 'bg-gradient-to-r from-card via-card/95 to-card/90 border-border hover:border-primary/50 hover:shadow-md'
                } ${accessory.stock === 'unavailable' ? 'opacity-60' : ''}`}
                onClick={() => accessory.stock !== 'unavailable' && handleAccessoryToggle(accessory.name)}
                whileHover={accessory.stock !== 'unavailable' ? { 
                  y: -4,
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
                } : {}}
                whileTap={accessory.stock !== 'unavailable' ? { scale: 0.98 } : {}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config.accessories.includes(accessory.name) ? 'opacity-100' : ''}`} />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{accessory.name}</h3>
                      {getStockIcon(accessory.stock)}
                      {config.accessories.includes(accessory.name) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStockBadge(accessory.stock, accessory.eta)}
                    <span className="text-primary font-medium">+AED {accessory.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedColorsAccessoriesStep;
