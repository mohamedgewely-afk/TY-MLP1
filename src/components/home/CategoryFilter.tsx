
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
  DollarSign 
} from "lucide-react";

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
}> = ({ title, icon, selected, onClick }) => (
  <div
    className={`
      flex flex-col items-center justify-center p-4 rounded-xl shadow-md
      ${selected 
        ? "bg-toyota-red/10 border-toyota-red border-2" 
        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}
      hover:shadow-lg transition-all duration-300 cursor-pointer
    `}
    onClick={onClick}
  >
    <div className={`
      p-3 rounded-full mb-2
      ${selected 
        ? "bg-toyota-red text-white" 
        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}
    `}>
      {icon}
    </div>
    <span className="text-sm font-medium">{title}</span>
  </div>
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
    { title: "Family", icon: <Users size={24} />, category: "SUV" },
    { title: "Executive", icon: <Briefcase size={24} />, category: "Sedan" },
    { title: "Adventure", icon: <Mountain size={24} />, category: "SUV" },
    { title: "Eco-Conscious", icon: <Zap size={24} />, category: "Hybrid" },
  ];

  const handlePersonaClick = (persona: string, category: string) => {
    // If clicking the already selected persona, deselect it
    if (selectedPersona === persona) {
      setSelectedPersona(null);
    } else {
      setSelectedPersona(persona);
      setSelectedCategory(category);
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  return (
    <div className="toyota-container py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Find Your Perfect Toyota</h2>
        
        {/* Personas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.title}
              title={persona.title}
              icon={persona.icon}
              selected={selectedPersona === persona.title}
              onClick={() => handlePersonaClick(persona.title, persona.category)}
            />
          ))}
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? "bg-toyota-red hover:bg-toyota-darkred" : ""}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedPersona(null);
              }}
            >
              {category === "Hybrid" && <Battery className="mr-1 h-4 w-4" />}
              {category === "All" && <Car className="mr-1 h-4 w-4" />}
              {category}
            </Button>
          ))}
        </div>
        
        {/* Price Range */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Price Range</span>
            <span>AED {priceRange[1].toLocaleString()}</span>
          </div>
          <div className="px-2">
            <Slider
              defaultValue={[priceRange[1]]}
              max={200000}
              min={50000}
              step={5000}
              onValueChange={(value) => handlePriceChange([0, value[0]])}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>AED 50,000</span>
            <span>AED 200,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
