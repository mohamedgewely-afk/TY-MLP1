
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, ChevronDown, Brush, Palette, Sparkles } from "lucide-react";
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
    eta: null,
    hex: "#FFFFFF",
    gradient: "from-white to-slate-100"
  },
  { 
    name: "Midnight Black", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", 
    price: 500,
    stock: 'pipeline',
    eta: '2-3 weeks',
    hex: "#111111",
    gradient: "from-gray-900 to-black"
  },
  { 
    name: "Silver Metallic", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", 
    price: 300,
    stock: 'available',
    eta: null,
    hex: "#C0C0C0",
    gradient: "from-gray-300 to-gray-400"
  }
];

const interiorColors = [
  { 
    name: "Black Leather", 
    price: 0, 
    stock: 'available',
    hex: "#222222",
    gradient: "from-gray-900 to-gray-800",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true"
  },
  { 
    name: "Beige Leather", 
    price: 800, 
    stock: 'pipeline', 
    eta: '1-2 weeks',
    hex: "#D4C8B0",
    gradient: "from-amber-100 to-amber-200",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true"
  },
  { 
    name: "Gray Fabric", 
    price: -500, 
    stock: 'available',
    hex: "#707070",
    gradient: "from-gray-500 to-gray-600",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true"
  }
];

const accessories = [
  { 
    name: "Premium Sound System", 
    price: 1200, 
    stock: 'available',
    icon: <Sparkles className="h-5 w-5" />,
    description: "Enhanced audio experience with 12 speakers"
  },
  { 
    name: "Sunroof", 
    price: 800, 
    stock: 'available',
    icon: <Sparkles className="h-5 w-5" />,
    description: "Panoramic glass roof with power sunshade"
  },
  { 
    name: "Navigation System", 
    price: 600, 
    stock: 'pipeline', 
    eta: '3-4 weeks',
    icon: <Sparkles className="h-5 w-5" />,
    description: "GPS navigation with real-time traffic updates"
  },
  { 
    name: "Heated Seats", 
    price: 400, 
    stock: 'available',
    icon: <Sparkles className="h-5 w-5" />,
    description: "Multi-level heating for driver and passenger"
  },
  { 
    name: "Backup Camera", 
    price: 300, 
    stock: 'available',
    icon: <Sparkles className="h-5 w-5" />,
    description: "High-definition rear view with parking guidance"
  },
  { 
    name: "Alloy Wheels", 
    price: 900, 
    stock: 'available',
    icon: <Sparkles className="h-5 w-5" />,
    description: "Premium 19-inch alloy wheels with unique design"
  }
];

const tabVariants = {
  active: {
    backgroundColor: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    scale: 1
  },
  inactive: {
    backgroundColor: "hsl(var(--muted))",
    color: "hsl(var(--muted-foreground))",
    boxShadow: "none",
    scale: 0.98
  }
};

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

  return (
    <div className="p-4 pb-8">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t('builder.exteriorColor')} & {t('builder.interiorColor')}
      </motion.h2>
      
      {/* Enhanced Tabs with Icons */}
      <div className="flex space-x-1 mb-8 bg-muted rounded-xl p-1.5">
        {[
          { id: 'exterior', icon: <Brush className="h-4 w-4 mr-2" />, label: t('builder.exteriorColor') },
          { id: 'interior', icon: <Palette className="h-4 w-4 mr-2" />, label: t('builder.interiorColor') },
          { id: 'accessories', icon: <Sparkles className="h-4 w-4 mr-2" />, label: t('builder.accessories') }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'exterior' | 'interior' | 'accessories')}
            className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg flex items-center justify-center"
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === tab.id ? "active" : "inactive"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Exterior Colors - Enhanced 3D Cards */}
      {activeTab === 'exterior' && (
        <div className="space-y-4">
          {exteriorColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                config.exteriorColor === color.name 
                  ? 'bg-primary/10 border-primary shadow-xl' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig((prev: any) => ({ ...prev, exteriorColor: color.name }))}
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-16 overflow-hidden rounded-lg shadow-inner">
                  <motion.img 
                    src={color.image} 
                    alt={color.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-30 mix-blend-overlay`}
                    animate={config.exteriorColor === color.name ? {
                      opacity: [0.3, 0.6, 0.3]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground flex items-center">
                      {color.name}
                      {config.exteriorColor === color.name && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="ml-2"
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.span>
                      )}
                    </h3>
                    {getStockIcon(color.stock)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStockBadge(color.stock, color.eta)}
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
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

      {/* Interior Colors - Enhanced with Images */}
      {activeTab === 'interior' && (
        <div className="space-y-4">
          {interiorColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                config.interiorColor === color.name 
                  ? 'bg-primary/10 border-primary shadow-xl' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig((prev: any) => ({ ...prev, interiorColor: color.name }))}
              whileHover={{ 
                scale: 1.02, 
                y: -3,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-16 overflow-hidden rounded-lg shadow-inner">
                  <motion.img 
                    src={color.image} 
                    alt={color.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-30 mix-blend-overlay`}
                    animate={config.interiorColor === color.name ? {
                      opacity: [0.3, 0.6, 0.3]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground flex items-center">
                      {color.name}
                      {config.interiorColor === color.name && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="ml-2"
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.span>
                      )}
                    </h3>
                    {getStockIcon(color.stock)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStockBadge(color.stock, color.eta)}
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                    {color.price !== 0 && (
                      <span className={`font-medium text-sm ${color.price > 0 ? 'text-primary' : 'text-green-600'}`}>
                        {color.price > 0 ? '+' : ''}AED {Math.abs(color.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Accessories - Enhanced Cards with Icons */}
      {activeTab === 'accessories' && (
        <div className="space-y-4">
          {accessories.map((accessory, index) => (
            <motion.div
              key={accessory.name}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                config.accessories.includes(accessory.name)
                  ? 'bg-primary/10 border-primary shadow-xl' 
                  : 'bg-card border-border hover:border-primary/50'
              } ${accessory.stock === 'unavailable' ? 'opacity-60' : ''}`}
              onClick={() => accessory.stock !== 'unavailable' && handleAccessoryToggle(accessory.name)}
              whileHover={{ 
                scale: accessory.stock !== 'unavailable' ? 1.02 : 1,
                y: accessory.stock !== 'unavailable' ? -3 : 0,
                boxShadow: accessory.stock !== 'unavailable' ? "0 15px 30px rgba(0, 0, 0, 0.1)" : "none"
              }}
              whileTap={accessory.stock !== 'unavailable' ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <motion.div
                    animate={config.accessories.includes(accessory.name) ? {
                      rotate: [0, 15, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-primary"
                  >
                    {accessory.icon}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-foreground flex items-center">
                      {accessory.name}
                      {config.accessories.includes(accessory.name) && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="ml-2"
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.span>
                      )}
                    </h3>
                    {getStockIcon(accessory.stock)}
                  </div>
                  <p className="text-muted-foreground text-xs mb-2">{accessory.description}</p>
                  <div className="flex items-center justify-between">
                    {getStockBadge(accessory.stock, accessory.eta)}
                    <span className="text-primary font-medium text-sm">+AED {accessory.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorsAccessoriesStep;
