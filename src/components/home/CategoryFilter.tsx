
import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onChange,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <button
              onClick={() => onChange(category.name)}
              className={`w-full flex flex-col items-center transition-all duration-300 ${
                activeCategory === category.name
                  ? 'transform scale-105'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div 
                className={`w-full aspect-square rounded-lg overflow-hidden mb-2 border-2 ${
                  activeCategory === category.name
                    ? 'border-toyota-red'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <span 
                className={`text-sm font-medium ${
                  activeCategory === category.name
                    ? 'text-toyota-red'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {category.name}
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
