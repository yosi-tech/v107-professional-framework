/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			heebo: ['var(--font-heebo)'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#F8FAFC',
  			foreground: '#111827',
  			card: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#111827'
  			},
  			popover: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#111827'
  			},
  			primary: {
  				DEFAULT: '#4338CA',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#EEF2FF',
  				foreground: '#312E81'
  			},
  			muted: {
  				DEFAULT: '#F3F4F6',
  				foreground: '#6B7280'
  			},
  			accent: {
  				DEFAULT: '#7C3AED',
  				foreground: '#FFFFFF'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#FFFFFF'
  			},
  			border: '#E5E7EB',
  			input: '#E5E7EB',
  			ring: '#4338CA',
  			chart: {
  				'1': '#4338CA',
  				'2': '#2563EB',
  				'3': '#10B981',
  				'4': '#F59E0B',
  				'5': '#7C3AED'
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
  			}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}