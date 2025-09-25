
import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface PerformantParallaxProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number;
}

export const PerformantParallax: React.FC<PerformantParallaxProps> = ({ 
  src, 
  alt, 
  className = "",
  intensity = 0.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const rafRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    
    if (!container || !image || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );

    observer.observe(container);

    const handleScroll = () => {
      if (!isVisible) return;
      
      // Cancel previous frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        ));
        
        const translateY = (scrollProgress - 0.5) * 100 * intensity;
        
        // Use CSS transform for better performance
        image.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    };

    if (isVisible) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial calculation
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible, reduceMotion, intensity]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ contain: 'layout style paint' }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          willChange: isVisible && !reduceMotion ? 'transform' : 'auto',
          transform: 'translate3d(0, 0, 0)' // Force GPU layer
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
