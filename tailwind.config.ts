
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "toyota-red": "#eb0a1e",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: '0',
          },
          "100%": {
            opacity: '1',
          },
        },
        // Luxury automotive-inspired animations
        "luxury-slide-up": {
          "0%": {
            opacity: '0',
            transform: 'translateY(40px) scale(0.95)',
          },
          "100%": {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        "luxury-slide-in-left": {
          "0%": {
            opacity: '0',
            transform: 'translateX(-40px) scale(0.95)',
          },
          "100%": {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        "luxury-slide-in-right": {
          "0%": {
            opacity: '0',
            transform: 'translateX(40px) scale(0.95)',
          },
          "100%": {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        "luxury-scale-in": {
          "0%": {
            opacity: '0',
            transform: 'scale(0.8) translateY(20px)',
          },
          "50%": {
            opacity: '0.8',
            transform: 'scale(1.02) translateY(-5px)',
          },
          "100%": {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        "luxury-morph": {
          "0%": {
            borderRadius: '8px',
            transform: 'scale(1)',
          },
          "50%": {
            borderRadius: '16px',
            transform: 'scale(1.02)',
          },
          "100%": {
            borderRadius: '12px',
            transform: 'scale(1)',
          },
        },
        "premium-pulse": {
          "0%, 100%": {
            boxShadow: '0 0 0 0 rgba(235, 10, 30, 0.4)',
            transform: 'scale(1)',
          },
          "50%": {
            boxShadow: '0 0 0 8px rgba(235, 10, 30, 0)',
            transform: 'scale(1.02)',
          },
        },
        "cinematic-reveal": {
          "0%": {
            opacity: '0',
            transform: 'translateY(80px) rotateX(15deg)',
            filter: 'blur(4px)',
          },
          "50%": {
            opacity: '0.8',
            transform: 'translateY(-10px) rotateX(-2deg)',
            filter: 'blur(1px)',
          },
          "100%": {
            opacity: '1',
            transform: 'translateY(0) rotateX(0deg)',
            filter: 'blur(0px)',
          },
        },
        "luxury-shimmer": {
          "0%": {
            backgroundPosition: '-200% 0',
          },
          "100%": {
            backgroundPosition: '200% 0',
          },
        },
        "floating": {
          "0%, 100%": {
            transform: 'translateY(0px) rotate(0deg)',
          },
          "50%": {
            transform: 'translateY(-10px) rotate(1deg)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out forwards",
        // Luxury animations with automotive timing
        "luxury-slide-up": "luxury-slide-up 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "luxury-slide-in-left": "luxury-slide-in-left 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "luxury-slide-in-right": "luxury-slide-in-right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "luxury-scale-in": "luxury-scale-in 0.7s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "luxury-morph": "luxury-morph 0.4s cubic-bezier(0.77, 0, 0.175, 1) forwards",
        "premium-pulse": "premium-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "cinematic-reveal": "cinematic-reveal 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards",
        "luxury-shimmer": "luxury-shimmer 2s linear infinite",
        "floating": "floating 3s ease-in-out infinite",
        // Combined luxury animations
        "luxury-entrance": "luxury-slide-up 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards, premium-pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s",
        "premium-hover": "luxury-scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
      },
      spacing: {
        'safe-area-inset-top': 'env(safe-area-inset-top)',
        'safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
        'safe-area-inset-left': 'env(safe-area-inset-left)',
        'safe-area-inset-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      zIndex: {
        'sticky-nav': '100',
        'mobile-dialog': '9999',
      },
      screens: {
        'xs': '320px',
        'sm-mobile': '375px',
        'mobile': '414px',
        'lg-mobile': '430px',
        'xl-mobile': '500px',
      },
      // Luxury timing functions
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'premium': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'cinematic': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'luxury-fast': '150ms',
        'luxury-normal': '250ms',
        'luxury-slow': '350ms',
        'cinematic': '500ms',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.pb-safe-area': {
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
        },
        '.pb-safe-area-inset-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)'
        },
        '.pt-safe-area-inset-top': {
          paddingTop: 'env(safe-area-inset-top)'
        },
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        '.touch-manipulation': {
          touchAction: 'manipulation'
        },
        '.overscroll-none': {
          overscrollBehavior: 'none'
        },
        '.force-visible': {
          display: 'block !important',
          visibility: 'visible !important',
          opacity: '1 !important'
        },
        '.mobile-sticky-nav': {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: '100',
          display: 'block !important',
          visibility: 'visible !important',
          opacity: '1 !important'
        },
        // Luxury animation utilities
        '.luxury-hover': {
          transition: 'all 250ms cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)'
          }
        },
        '.premium-card': {
          background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)/0.2) 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
          border: '1px solid hsl(var(--border)/0.5)',
          borderRadius: '12px',
        },
        '.luxury-gradient': {
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.9) 100%)',
          boxShadow: '0 8px 32px rgba(235, 10, 30, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
        },
        '.cinematic-shadow': {
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
        },
        '@media (max-width: 500px)': {
          '.force-mobile-nav': {
            display: 'block !important',
            visibility: 'visible !important',
            opacity: '1 !important'
          }
        },
        '@media (min-width: 501px)': {
          '.hide-on-tablet-desktop': {
            display: 'none !important'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
};

export default config;
