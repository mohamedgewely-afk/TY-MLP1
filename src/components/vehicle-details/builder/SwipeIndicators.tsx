
import React from "react";
import { motion } from "framer-motion";

interface SwipeIndicatorsProps {
  total: number;
  current: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const SwipeIndicators: React.FC<SwipeIndicatorsProps> = ({
  total,
  current,
  direction = 'horizontal',
  className = ''
}) => {
  if (total <= 1) return null;

  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} gap-1.5 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={`rounded-full transition-all duration-300 ${
            direction === 'vertical' ? 'w-1.5 h-3' : 'w-3 h-1.5'
          } ${
            index === current
              ? 'bg-primary shadow-md'
              : 'bg-muted-foreground/30'
          }`}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: index === current ? 1 : 0.8,
            opacity: index === current ? 1 : 0.5
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
};

export default SwipeIndicators;
