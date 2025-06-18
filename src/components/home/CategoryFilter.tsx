
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Car, 
  Battery, 
  Users, 
  Briefcase, 
  Mountain, 
  Zap, 
  DollarSign,
  Filter,
  Globe,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPersona: string | null;
  setSelectedPersona: (persona: string | null) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  categories: string[];
}

const PersonaCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  category: string;
  description: string;
}> = ({ title, icon, selected, onClick, category, description }) => (
  <motion.div
    className={`
      relative overflow-hidden cursor-pointer group
      ${selected 
        ? "bg-gradient-to-br from-toyota-red/10 to-toyota-red/5 border-toyota-red border-2 shadow-lg" 
        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-toyota-red/30"}
      rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105
    `}
    onClick={onClick}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute inset-0 bg-gradient-to-br from-toyota-red/20 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-toyota-red/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
    </div>
    
    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
      <motion.div 
        className={`
          p-4 rounded-2xl transition-all duration-300
          ${selected 
            ? "bg-toyota-red text-white shadow-lg" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-toyota-red/10 group-hover:text-toyota-red"}
        `}
        whileHover={{ rotate: 5, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-toyota-red transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
        <Badge 
          variant={selected ? "default" : "outline"} 
          className={`text-xs ${selected ? "bg-toyota-red border-toyota-red" : "border-gray-300"}`}
        >
          {category}
        </Badge>
      </div>
    </div>
  </motion.div>
);

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPersona,
  setSelectedPersona,
  priceRange,
  setPriceRange,
  categories,
}) => {
  const personas = [
    { 
      title: "Family First", 
      icon: <Users size={28} />, 
      category: "SUV",
      description: "Safety and comfort for the whole family with spacious interiors and advanced safety features."
    },
    { 
      title: "Business Elite", 
      icon: <Briefcase size={28} />, 
      category: "Sedan",
      description: "Professional elegance with luxury appointments and executive-level comfort."
    },
    { 
      title: "Adventure Seeker", 
      icon: <Mountain size={28} />, 
      category: "SUV",
      description: "Built for exploration with rugged capability and outdoor-ready features."
    },
    { 
      title: "Eco Warrior", 
      icon: <Zap size={28} />, 
      category: "Hybrid",
      description: "Sustainable driving with cutting-edge hybrid technology and minimal environmental impact."
    },
  ];

  const handlePersonaClick = (persona: string, category: string) => {
    // If clicking the already selected persona, deselect it
    if (selectedPersona === persona) {
      setSelectedPersona(null);
      setSelectedCategory("All");
    } else {
      setSelectedPersona(persona);
      setSelectedCategory(category);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedPersona(null); // Clear persona when selecting category directly
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-toyota-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="toyota-container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-toyota-red to-toyota-red/80 text-white px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            Personalized Vehicle Finder
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Find Your Perfect Toyota
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose your lifestyle and we'll recommend the perfect vehicle for your needs, 
            or explore our complete range with advanced filtering options.
          </p>
        </motion.div>
        
        {/* Enhanced Persona Cards */}
        <div className="mb-12">
          <motion.h3 
            className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What describes you best?
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personas.map((persona, index) => (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PersonaCard
                  title={persona.title}
                  icon={persona.icon}
                  selected={selectedPersona === persona.title}
                  onClick={() => handlePersonaClick(persona.title, persona.category)}
                  category={persona.category}
                  description={persona.description}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          <span className="px-6 text-gray-500 dark:text-gray-400 text-sm font-medium">Or browse by category</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>
        
        {/* Enhanced Category Pills & Filters */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-0 space-y-8">
            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Car className="h-5 w-5 mr-2 text-toyota-red" />
                Vehicle Categories
              </h4>
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`
                        px-6 py-3 rounded-full transition-all duration-300 font-medium
                        ${selectedCategory === category 
                          ? "bg-toyota-red hover:bg-toyota-darkred text-white shadow-lg" 
                          : "border-2 border-gray-200 dark:border-gray-600 hover:border-toyota-red hover:text-toyota-red bg-white dark:bg-gray-700"}
                      `}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category === "Hybrid" && <Battery className="mr-2 h-4 w-4" />}
                      {category === "All" && <Globe className="mr-2 h-4 w-4" />}
                      {category}
                      <Badge 
                        variant="secondary" 
                        className="ml-2 text-xs bg-white/20 text-current border-0"
                      >
                        {category === "All" ? categories.length - 1 : Math.floor(Math.random() * 8) + 2}
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-toyota-red" />
                Price Range
              </h4>
              <div className="max-w-md">
                <div className="flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>Budget</span>
                  <span className="font-semibold text-toyota-red">AED {priceRange[1].toLocaleString()}</span>
                </div>
                <div className="px-3">
                  <Slider
                    defaultValue={[priceRange[1]]}
                    max={200000}
                    min={50000}
                    step={5000}
                    onValueChange={(value) => handlePriceChange([0, value[0]])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>AED 50,000</span>
                  <span>AED 200,000+</span>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedPersona || selectedCategory !== "All" || priceRange[1] < 200000) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-gray-200 dark:border-gray-600 pt-6"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-toyota-red" />
                  Active Filters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPersona && (
                    <Badge className="bg-toyota-red text-white px-3 py-1">
                      Persona: {selectedPersona}
                    </Badge>
                  )}
                  {selectedCategory !== "All" && (
                    <Badge variant="outline" className="border-toyota-red text-toyota-red px-3 py-1">
                      Category: {selectedCategory}
                    </Badge>
                  )}
                  {priceRange[1] < 200000 && (
                    <Badge variant="outline" className="border-gray-400 text-gray-600 px-3 py-1">
                      Max: AED {priceRange[1].toLocaleString()}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPersona(null);
                      setSelectedCategory("All");
                      setPriceRange([0, 200000]);
                    }}
                    className="text-xs text-gray-500 hover:text-toyota-red"
                  >
                    Clear All
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CategoryFilter;
