
// Premium typography system for luxury automotive experience
export const typography = {
  // Luxury headings with proper scaling
  display: {
    1: "text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter",
    2: "text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight",
    3: "text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
  },
  
  // Premium headings
  heading: {
    1: "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight",
    2: "text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
    3: "text-xl md:text-2xl lg:text-3xl font-bold leading-snug tracking-tight",
    4: "text-lg md:text-xl lg:text-2xl font-semibold leading-snug tracking-tight"
  },
  
  // Body text variations
  body: {
    large: "text-lg md:text-xl leading-relaxed",
    base: "text-base md:text-lg leading-relaxed",
    small: "text-sm md:text-base leading-relaxed"
  },
  
  // Premium accents
  accent: {
    gradient: "bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent",
    luxury: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400",
    premium: "font-black tracking-wider uppercase text-xs md:text-sm"
  },
  
  // Interactive text states
  interactive: {
    default: "transition-all duration-300 hover:text-primary cursor-pointer",
    luxury: "transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-primary hover:to-primary/80"
  }
};

// Premium number formatting for prices and specs
export const formatPremiumNumber = (num: number, prefix = "AED") => ({
  main: `${prefix} ${Math.floor(num / 1000).toLocaleString()}K`,
  full: `${prefix} ${num.toLocaleString()}`,
  monthly: `${prefix} ${Math.round((num * 0.8 * 0.035) / (12 * (1 - Math.pow(1 + 0.035/12, -60)))).toLocaleString()}/mo`
});
