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

        // Existing Toyota brand red
        "toyota-red": "#eb0a1e",

        // NEW: dynamic CSS-var based token
        toyota: "var(--toyota, #eb0a1e)",
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
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        // NEW: for moving filmstrip and pulsing line
        film: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-slide": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out forwards",

        // NEW: Toyota gallery animations
        film: "film 16s linear infinite",
        "pulse-slide": "pulse-slide 2.6s linear infinite",
      },
      spacing: {
        "safe-area-inset-top": "env(safe-area-inset-top)",
        "safe-area-inset-bottom": "env(safe-area-inset-bottom)",
        "safe-area-inset-left": "env(safe-area-inset-left)",
        "safe-area-inset-right": "env(safe-area-inset-right)",
      },
      minHeight: {
        "touch-target": "44px",
      },
      minWidth: {
        "touch-target": "44px",
      },
      zIndex: {
        "sticky-nav": "100",
        "mobile-dialog": "9999",
      },
      screens: {
        xs: "320px",
        "sm-mobile": "375px",
        mobile: "414px",
        "lg-mobile": "430px",
        "xl-mobile": "500px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".pb-safe-area": {
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        },
        ".pb-safe-area-inset-bottom": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".pt-safe-area-inset-top": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".touch-manipulation": {
          touchAction: "manipulation",
        },
        ".overscroll-none": {
          overscrollBehavior: "none",
        },
        ".force-visible": {
          display: "block !important",
          visibility: "visible !important",
          opacity: "1 !important",
        },
        ".mobile-sticky-nav": {
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "100",
          display: "block !important",
          visibility: "visible !important",
          opacity: "1 !important",
        },
        "@media (max-width: 500px)": {
          ".force-mobile-nav": {
            display: "block !important",
            visibility: "visible !important",
            opacity: "1 !important",
          },
        },
        "@media (min-width: 501px)": {
          ".hide-on-tablet-desktop": {
            display: "none !important",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
