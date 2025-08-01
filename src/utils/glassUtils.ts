
// Glass morphism utility classes and configurations
export const glassStyles = {
  // Primary glass morphism variants
  primary: "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10",
  secondary: "bg-white/5 dark:bg-white/3 backdrop-blur-lg border border-white/15 dark:border-white/8",
  subtle: "bg-white/8 dark:bg-white/4 backdrop-blur-md border border-white/10 dark:border-white/5",
  
  // Premium overlays for content
  overlay: "bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/25",
  
  // Interactive states
  hover: "hover:bg-white/15 dark:hover:bg-white/8 hover:backdrop-blur-2xl transition-all duration-300",
  active: "active:bg-white/20 dark:active:bg-white/10 active:scale-[0.98] transition-all duration-150",
  
  // Premium shadows for depth
  shadow: {
    sm: "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.04)]",
    md: "shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.06)]",
    lg: "shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(255,255,255,0.08)]",
    xl: "shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(255,255,255,0.10)]"
  }
};

// Premium animation configurations
export const premiumAnimations = {
  // Luxury easing curves (Apple/BMW inspired)
  luxury: [0.25, 0.1, 0.25, 1.0] as const,
  smooth: [0.4, 0.0, 0.2, 1.0] as const,
  spring: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Duration scales
  duration: {
    instant: 150,
    fast: 250,
    normal: 350,
    slow: 500,
    cinematic: 750
  },
  
  // Stagger configurations
  stagger: {
    children: 0.1,
    items: 0.05,
    cards: 0.15
  }
};

// Glass morphism component wrapper utility
export const createGlassVariant = (variant: keyof typeof glassStyles, shadow?: keyof typeof glassStyles.shadow) => {
  const base = glassStyles[variant] || glassStyles.primary;
  const shadowClass = shadow ? glassStyles.shadow[shadow] : glassStyles.shadow.md;
  return `${base} ${shadowClass}`;
};
