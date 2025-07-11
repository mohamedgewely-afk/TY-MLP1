
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ColorsAccessoriesStepProps {
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
    eta: null
  },
  { 
    name: "Midnight Black", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", 
    price: 500,
    stock: 'pipeline',
    eta: '2-3 weeks'
  },
  { 
    name: "Silver Metallic", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", 
    price: 300,
    stock: 'unavailable',
    eta: null
  }
];

const interiorColors = [
  { name: "Black Leather", price: 0, stock: 'available' },
  { name: "Beige Leather", price: 800, stock: 'pipeline', eta: '1-2 weeks' },
  { name: "Gray Fabric", price: -500, stock: 'unavailable' }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, stock: 'available' },
  { name: "Sunroof", price: 800, stock: 'available' },
  { name: "Navigation System", price: 600, stock: 'pipeline', eta: '3-4 weeks' },
  { name: "Heated Seats", price: 400, stock: 'available' },
  { name: "Backup Camera", price: 300, stock: 'unavailable' },
  { name: "Alloy Wheels", price: 900, stock: 'available' }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior' | 'accessories'>('exterior');
  const { t, isRTL } = useLanguage();

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

  const handleAccessoryToggle = (accessoryName: string) => {
    setConfig((prev: any) => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter((a: string) => a !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  // Auto-switch to interior after exterior selection
  const handleExteriorSelection = (colorName: string) => {
    setConfig((prev: any) => ({ ...prev, exteriorColor: colorName }));
    // Auto-switch to interior tab after exterior selection
    setTimeout(() => {
      setActiveTab('interior');
    }, 300);
  };

  return (
    <div className="p-4 pb-8">
      <motion.h2 
        className="text-xl font-bold text-center mb-6 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t('builder.exteriorColor')} & {t('builder.interiorColor')}
      </motion.h2>
      
      {/* Progress Indicators */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <div className={`flex items-center space-x-2 ${config.exteriorColor ? 'text-green-600' : 'text-muted-foreground'}`}>
          {config.exteriorColor ? <Check className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
          <span className="text-sm font-medium">Exterior</span>
        </div>
        <div className="h-px w-8 bg-muted-foreground/30" />
        <div className={`flex items-center space-x-2 ${config.interiorColor ? 'text-green-600' : 'text-muted-foreground'}`}>
          {config.interiorColor ? <Check className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
          <span className="text-sm font-medium">Interior</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('exterior')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'exterior'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('builder.exteriorColor')}
          {config.exteriorColor && <Check className="h-3 w-3 ml-1 text-green-500" />}
        </button>
        <button
          onClick={() => setActiveTab('interior')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'interior'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('builder.interiorColor')}
          {config.interiorColor && <Check className="h-3 w-3 ml-1 text-green-500" />}
        </button>
        <button
          onClick={() => setActiveTab('accessories')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'accessories'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('builder.accessories')}
        </button>
      </div>

      {/* Exterior Colors */}
      {activeTab === 'exterior' && (
        <div className="space-y-3">
          {!config.exteriorColor && (
            <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <p className="text-sm text-orange-800 font-medium">Please select an exterior color to continue</p>
            </div>
          )}
          {exteriorColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                config.exteriorColor === color.name 
                  ? 'bg-primary/10 border-primary shadow-md' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => handleExteriorSelection(color.name)}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={color.image} 
                  alt={color.name} 
                  className="w-16 h-10 object-cover rounded-md"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{color.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getStockIcon(color.stock)}
                      {config.exteriorColor === color.name && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {getStockBadge(color.stock, color.eta)}
                    {color.price > 0 && (
                      <span className="text-primary font-medium text-sm">+AED {color.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interior Colors */}
      {activeTab === 'interior' && (
        <div className="space-y-3">
          {!config.interiorColor && (
            <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <p className="text-sm text-orange-800 font-medium">Please select an interior color to continue</p>
            </div>
          )}
          {interiorColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                config.interiorColor === color.name 
                  ? 'bg-primary/10 border-primary shadow-md' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig((prev: any) => ({ ...prev, interiorColor: color.name }))}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{color.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getStockIcon(color.stock)}
                      {config.interiorColor === color.name && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  {getStockBadge(color.stock, color.eta)}
                </div>
                {color.price !== 0 && (
                  <span className={`font-medium text-sm ${color.price > 0 ? 'text-primary' : 'text-green-600'}`}>
                    {color.price > 0 ? '+' : ''}AED {color.price}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Accessories */}
      {activeTab === 'accessories' && (
        <div className="space-y-3">
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-medium">Accessories are optional - you can skip this step</p>
          </div>
          {accessories.map((accessory, index) => (
            <motion.div
              key={accessory.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                config.accessories.includes(accessory.name)
                  ? 'bg-primary/10 border-primary shadow-md' 
                  : 'bg-card border-border hover:border-primary/50'
              } ${accessory.stock === 'unavailable' ? 'opacity-60' : ''}`}
              onClick={() => accessory.stock !== 'unavailable' && handleAccessoryToggle(accessory.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{accessory.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getStockIcon(accessory.stock)}
                      {config.accessories.includes(accessory.name) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                  {getStockBadge(accessory.stock, accessory.eta)}
                </div>
                <span className="text-primary font-medium text-sm">+AED {accessory.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorsAccessoriesStep;
