import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AutoFleet Pro Custom Palette
        'glacier': '#F9F9F9',
        'midnight': '#151515',
        'rivian': '#004F43',
        'compass': '#DAAA00',
        
        // Semantic tokens (for design system)
        'primary': '#151515',        // Midnight
        'primary-light': '#2a2a2a',  // Slightly lighter Midnight
        'accent': '#004F43',          // Rivian Green
        'accent-light': '#006955',    // Lighter Rivian Green
        'highlight': '#DAAA00',       // Compass Yellow
        'background': '#F9F9F9',      // Glacier White
        'background-dark': '#F0F0F0', // Slightly darker white
        'text-primary': '#151515',    // Midnight
        'text-secondary': '#666666',  // Medium gray
        'text-light': '#999999',      // Light gray
        'border-light': '#E8E8E8',    // Light gray border
      },
      fontFamily: {
        'sans': ['Inter', 'Public Sans', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['Geist Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
      },
      spacing: {
        'nav-height': '80px',
      },
      backdropBlur: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      borderRadius: {
        'full': '9999px',
        'lg': '8px',
        'md': '4px',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-rivian': 'linear-gradient(135deg, #004F43 0%, #006955 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #DAAA00 0%, #E8C547 100%)',
      },
    },
  },
  plugins: [],
}

export default config
