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
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
				'mobile-xs': '0.125rem',
				'mobile-sm': '0.25rem',
				'mobile-md': '0.375rem',
				'mobile-lg': '0.5rem',
				'mobile-xl': '0.75rem',
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
				},
				'mobile-slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(15px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'mobile-fade': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
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
				'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
				'mobile-slide-up': 'mobile-slide-up 0.3s ease-out',
				'mobile-fade': 'mobile-fade 0.2s ease-out'
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
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				},
				'.safe-area-inset-top': {
					paddingTop: 'env(safe-area-inset-top)',
				},
				'.safe-area-inset-bottom': {
					paddingBottom: 'env(safe-area-inset-bottom)',
				},
				'.safe-area-inset-left': {
					paddingLeft: 'env(safe-area-inset-left)',
				},
				'.safe-area-inset-right': {
					paddingRight: 'env(safe-area-inset-right)',
				},
				'.safe-area-inset': {
					paddingTop: 'env(safe-area-inset-top)',
					paddingBottom: 'env(safe-area-inset-bottom)',
					paddingLeft: 'env(safe-area-inset-left)',
					paddingRight: 'env(safe-area-inset-right)',
				},
				'.touch-target': {
					minHeight: '44px',
					minWidth: '44px',
				},
				'.touch-target-large': {
					minHeight: '48px',
					minWidth: '48px',
				},
				'.touch-target-xl': {
					minHeight: '52px',
					minWidth: '52px',
				},
				'.glass': {
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
				},
				'.glass-mobile': {
					backgroundColor: 'rgba(255, 255, 255, 0.05)',
					backdropFilter: 'blur(8px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
				},
				'.mobile-viewport': {
					width: '100vw',
					height: '100vh',
					position: 'fixed',
					top: '0',
					left: '0',
					right: '0',
					bottom: '0',
				},
				'.mobile-container': {
					maxWidth: '100%',
					paddingLeft: 'env(safe-area-inset-left)',
					paddingRight: 'env(safe-area-inset-right)',
				}
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
