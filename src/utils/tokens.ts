// Design tokens for luxury automotive styling
export const designTokens = {
  // Brand Colors
  colors: {
    // Primary Toyota Red
    primary: '#EB0A1E',
    primaryDark: '#CC0000',
    
    // BYD Accent Red
    accent: '#CC0000',
    accentBright: '#FF0000',
    
    // Carbon Matte Theme
    carbonMatte: '#0B0B0C',
    carbonLight: '#17191B',
    carbonEdge: '#2A2D30',
    
    // Neutral Palette
    white: '#FFFFFF',
    pearl: '#F8F9FA',
    platinum: '#E9ECEF',
    silver: '#ADB5BD',
    graphite: '#495057',
    charcoal: '#343A40',
    midnight: '#212529',
    
    // Semantic Colors
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8'
  },

  // Typography Scale
  typography: {
    // Cinematic Headlines
    headline: {
      fontSize: {
        mobile: '2.5rem',
        tablet: '4rem',
        desktop: '6rem',
        large: '8rem'
      },
      fontWeight: '300',
      lineHeight: '0.9',
      letterSpacing: '-0.02em'
    },
    
    // Subheadlines
    subheadline: {
      fontSize: {
        mobile: '1.25rem',
        tablet: '1.5rem',
        desktop: '2rem',
        large: '2.5rem'
      },
      fontWeight: '400',
      lineHeight: '1.2',
      letterSpacing: '0.01em'
    },
    
    // Body Text
    body: {
      fontSize: {
        mobile: '1rem',
        tablet: '1.125rem',
        desktop: '1.25rem'
      },
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0'
    },
    
    // Caption Text
    caption: {
      fontSize: {
        mobile: '0.875rem',
        tablet: '1rem',
        desktop: '1.125rem'
      },
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.01em'
    }
  },

  // Spacing Scale (8px base)
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
    '4xl': '8rem',   // 128px
    '5xl': '12rem'   // 192px
  },

  // Border Radius
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    
    // Luxury shadows
    luxury: '0 32px 64px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(235, 10, 30, 0.3)',
    carbon: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },

  // Glass Morphism
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.18)'
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    },
    premium: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    }
  },

  // Animation Durations
  durations: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.6s',
    cinematic: '1.2s'
  },

  // Easing Functions
  easing: {
    luxury: [0.25, 0.46, 0.45, 0.94],
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    sharp: [0.4, 0, 1, 1]
  },

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    mobileLg: '430px',
    tablet: '768px',
    desktop: '1024px',
    desktopLg: '1440px',
    ultrawide: '1920px'
  },

  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
    tooltip: 60
  }
};

// Utility functions for consistent styling
export const getResponsiveValue = (
  values: Record<string, string | number>,
  breakpoint: keyof typeof designTokens.breakpoints
) => {
  return values[breakpoint] || values.mobile || values.desktop;
};

export const createGlassStyle = (variant: keyof typeof designTokens.glass) => {
  const glass = designTokens.glass[variant];
  return {
    background: glass.background,
    backdropFilter: glass.backdropFilter,
    WebkitBackdropFilter: glass.backdropFilter,
    border: glass.border,
    ...(glass.boxShadow && { boxShadow: glass.boxShadow })
  };
};

export const createShadowStyle = (variant: keyof typeof designTokens.shadows) => {
  return {
    boxShadow: designTokens.shadows[variant]
  };
};