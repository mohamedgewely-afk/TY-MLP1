
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				toyota: {
					red: '#E50000',
					darkred: '#BF0000',
					gray: '#58595B',
					lightgray: '#F1F2F2',
					black: '#000000',
					white: '#FFFFFF',
				},
				// Persona-specific colors
				persona: {
					family: {
						primary: '#4A6DA7',
						secondary: '#8FB0EA',
						accent: '#F2C94C',
					},
					tech: {
						primary: '#6B38FB',
						secondary: '#9F7AFF',
						accent: '#00D4FF',
					},
					eco: {
						primary: '#2E7D32',
						secondary: '#81C784',
						accent: '#CDDC39',
					},
					urban: {
						primary: '#455A64',
						secondary: '#78909C',
						accent: '#FF5722',
					},
					business: {
						primary: '#263238',
						secondary: '#546E7A',
						accent: '#90A4AE',
					},
					adventure: {
						primary: '#BF360C',
						secondary: '#FF8A65',
						accent: '#FFD54F',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)'
					},
				},
				'pulse-soft': {
					'0%, 100%': { 
						opacity: '1'
					},
					'50%': { 
						opacity: '0.8'
					},
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'rotate-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'scale-pulse': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'float': 'float 5s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'rotate-slow': 'rotate-slow 8s linear infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'scale-pulse': 'scale-pulse 3s ease-in-out infinite'
			},
			boxShadow: {
				'persona': '0 10px 25px -5px rgba(var(--persona-primary-rgb), 0.3)',
				'persona-hover': '0 20px 35px -10px rgba(var(--persona-primary-rgb), 0.4)',
				'inner-persona': 'inset 0 2px 4px 0 rgba(var(--persona-primary-rgb), 0.1)'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			textShadow: {
				sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
				md: '0 2px 4px rgba(0, 0, 0, 0.3)',
				lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add a custom plugin for text shadow
		function({ addUtilities }) {
			const newUtilities = {
				'.text-shadow-sm': {
					textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
				},
				'.text-shadow': {
					textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
				},
				'.text-shadow-lg': {
					textShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
				},
				'.text-shadow-none': {
					textShadow: 'none',
				},
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
