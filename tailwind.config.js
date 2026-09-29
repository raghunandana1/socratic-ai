/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arcade: {
          blue: '#1250D8',
          'blue-dark': '#0E40B0',
          bezel: '#DC2626',
          'bezel-dark': '#B91C1C',
          screen: '#1E232A',
          card: '#262D36',
          'card-dark': '#191D24',
          yellow: '#F59E0B',
          'yellow-light': '#FBBF24',
          red: '#EF4444',
          'red-dark': '#DC2626',
        },
        bg: {
          dark: '#1250D8',
          card: '#1E232A',
          elevated: '#262D36',
          glass: 'rgba(30, 35, 42, 0.85)',
        },
        brand: {
          violet: '#8B5CF6',
          purple: '#A855F7',
          cyan: '#DC2626',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
        },
        border: {
          glass: 'rgba(255, 255, 255, 0.12)',
          glow: 'rgba(42, 166, 232, 0.4)',
        }
      },
      fontFamily: {
        sans: ['"Pixelify Sans"', '"Silkscreen"', 'monospace'],
        pixel: ['"Press Start 2P"', '"Silkscreen"', 'monospace'],
        'pixel-body': ['"Pixelify Sans"', 'monospace'],
        mono: ['"JetBrains Mono"', '"Pixelify Sans"', 'monospace'],
        solution: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        math: ['"Plus Jakarta Sans"', '"JetBrains Mono"', '-apple-system', 'sans-serif'],
        handwritten: ['"Pixelify Sans"', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 40px -10px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.4)',
        'glow-emerald': '0 0 40px -10px rgba(16, 185, 129, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'pixel': '3px 3px 0px rgba(0, 0, 0, 0.95)',
        'pixel-cyan': '3px 3px 0px rgba(34, 211, 238, 0.6)',
        'pixel-violet': '3px 3px 0px rgba(139, 92, 246, 0.6)',
        'pixel-sm': '2px 2px 0px rgba(0, 0, 0, 0.95)',
        'pixel-sm-cyan': '2px 2px 0px rgba(34, 211, 238, 0.6)',
        'pixel-sm-violet': '2px 2px 0px rgba(139, 92, 246, 0.6)',
        'pixel-block': '4px 4px 0px 0px #000000',
        'pixel-block-cyan': '4px 4px 0px 0px #00F0FF',
        'pixel-block-violet': '4px 4px 0px 0px #8B5CF6',
        'pixel-block-emerald': '4px 4px 0px 0px #10B981',
        'arcade-btn': '4px 4px 0px 0px #000000',
        'arcade-bezel': '6px 6px 0px 0px #000000',
        'arcade-card': '4px 4px 0px 0px #000000',
        'arcade-tab': '3px 3px 0px 0px #000000',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'scan': {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' }
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' }
        }
      }
    },
  },
  plugins: [],
}
