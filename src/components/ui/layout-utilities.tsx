
import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Full-bleed wrapper for desktop (keeps mobile as-is)
export const Bleed: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:ml-[calc(50%-50vw)] lg:mr-[calc(50%-50vw)] lg:w-screen ${className}`}>
    {children}
  </div>
);

// Bleed only toward the viewport edge on desktop (prevents covering the text column)
export const BleedRight: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:mr-[calc(50%-50vw)] ${className}`}>{children}</div>
);

export const BleedLeft: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:ml-[calc(50%-50vw)] ${className}`}>{children}</div>
);

// Parallax image that drifts slightly on scroll (respects prefers-reduced-motion)
export const ParallaxImg: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  // Enhanced dramatic drift with subtle scale and opacity
  const y = useTransform(scrollYProgress, [0, 1], ["-6vh", "8vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.85]);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden pointer-events-none ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={reduce ? {} : { y, scale, opacity }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
