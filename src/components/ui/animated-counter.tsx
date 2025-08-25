
import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOutQuart * value;
      
      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration, hasAnimated]);

  return (
    <span className={`transition-opacity duration-500 ${className}`}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
