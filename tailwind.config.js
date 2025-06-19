/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-night': '#0f0f0f',
        'soft-beige': '#f5f5dc',
        'sunset-orange': '#ff8c42',
        'soft-gold': '#ffd700',
        'warm-red': '#e74c3c',
        'soft-gray': '#333333',
        'night-900': '#1a1a1a',
        'sunset-500': '#ff8c42',
        'warm-300': '#ffa366',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'cursive'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backdropBlur: {
        '3xl': '64px',
      }
    },
  },
  safelist: [
    'from-yellow-400',
    'to-amber-500',
    'from-gray-400',
    'to-gray-500',
    'from-orange-700',
    'to-amber-700',
    'from-gray-500',
    'to-gray-700',
    // Nuevas clases para safelist
    'bg-deep-night/95',
    'backdrop-blur-2xl',
    'backdrop-blur-3xl',
    'text-sunset-orange',
    'text-soft-gold',
    'text-soft-beige',
    'border-soft-gray/20',
    'hover:bg-sunset-orange/20',
    'hover:bg-soft-gold/20',
    'hover:bg-warm-red/10',
    'from-sunset-orange',
    'to-soft-gold',
    'from-soft-gold',
    'to-sunset-orange',
  ],
}

